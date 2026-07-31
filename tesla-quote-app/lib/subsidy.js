import fs from "fs";
import path from "path";

const APP_DATA_DIR = path.join(process.cwd(), "data");
const APP_DATA_CSV = path.join(APP_DATA_DIR, "latest.csv");
const SHARED_DATA_DIR = path.join(process.cwd(), "..", "보조금");

// 일반 지역 선택에서 제외할 코드 (한국환경공단: 국비-only baseline, 지방비 0)
const EXCLUDED_LOCAL_CODE = "9999";

// local_code 앞 2자리 → 시·도 약칭 (동일 지명 구분용)
const SIDO_BY_PREFIX = {
  "11": "서울", "26": "부산", "27": "대구", "28": "인천", "29": "광주",
  "30": "대전", "31": "울산", "36": "세종", "41": "경기", "42": "강원",
  "43": "충북", "44": "충남", "45": "전북", "46": "전남", "47": "경북",
  "48": "경남", "50": "제주",
};

function findLatestCsvFile(dirPath) {
  if (!fs.existsSync(dirPath)) return null;
  const files = fs
    .readdirSync(dirPath)
    .filter((name) => /^tesla_subsidy_by_local_\d{8}\.csv$/i.test(name))
    .sort();
  if (files.length === 0) return null;
  return path.join(dirPath, files[files.length - 1]);
}

function resolveCsvPath() {
  if (fs.existsSync(APP_DATA_CSV)) return APP_DATA_CSV;
  const latestShared = findLatestCsvFile(SHARED_DATA_DIR);
  if (latestShared) return latestShared;
  throw new Error(
    "CSV file not found. Run `npm run prepare:data` in tesla-quote-app first."
  );
}

const APP_DATA_META = path.join(APP_DATA_DIR, "subsidy-meta.json");

// 보조금 데이터 기준일(YYYY-MM-DD)을 산출한다.
// 1) sync-subsidy가 기록한 subsidy-meta.json
// 2) ../보조금 폴더의 최신 dated CSV 파일명(tesla_subsidy_by_local_YYYYMMDD.csv)
// 3) latest.csv 파일 수정시각
function resolveDataDate() {
  try {
    if (fs.existsSync(APP_DATA_META)) {
      const meta = JSON.parse(fs.readFileSync(APP_DATA_META, "utf8"));
      if (meta && meta.dataDate) return meta.dataDate;
    }
  } catch {}

  const latestShared = findLatestCsvFile(SHARED_DATA_DIR);
  if (latestShared) {
    const m = path.basename(latestShared).match(/(\d{4})(\d{2})(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }

  try {
    if (fs.existsSync(APP_DATA_CSV)) {
      const d = fs.statSync(APP_DATA_CSV).mtime;
      const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return ymd;
    }
  } catch {}

  return null;
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out;
}

function toNumber(value) {
  const n = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/**
 * CSV 모델명(csvModel)의 국고보조금(만원)을 조회한다.
 * 국고보조금은 지역과 무관하게 트림별로 동일하므로 첫 매칭 행의 값을 사용한다.
 * 페이지 본문에 보조금 수치를 하드코딩하지 않기 위한 헬퍼(서버 전용).
 * @param {string} csvModel
 * @returns {number|null} 만원 단위 국고보조금. 해당 모델이 CSV에 없으면 null
 */
export function getNationalSubsidyManwon(csvModel) {
  const { rows } = loadSubsidySnapshot();
  const hit = rows.find((row) => row.model === csvModel);
  return hit ? hit.national_subsidy_manwon : null;
}

export function loadSubsidySnapshot() {
  const raw = fs.readFileSync(resolveCsvPath(), "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = cols[idx] ?? "";
    });

    return {
      ...obj,
      national_subsidy_manwon: toNumber(obj.national_subsidy_manwon),
      local_subsidy_manwon: toNumber(obj.local_subsidy_manwon),
      total_subsidy_manwon: toNumber(obj.total_subsidy_manwon)
    };
  });

  // 지역 드롭다운 목록 구성
  //  - 한국환경공단(코드 9999): 지방비 0의 국비-only baseline → 일반 지역 선택에서 제외
  //  - 동일 지명(예: 고성군: 강원 4282 / 경남 4882)은 시·도를 접두로 붙여 구분
  const filteredRows = rows.filter((row) => row.local_code !== EXCLUDED_LOCAL_CODE);

  const nameCounts = new Map();
  filteredRows.forEach((row) => {
    if (!nameCounts.has(row.local_code)) {
      nameCounts.set(row.local_code, row.local_name);
    }
  });
  const displayNameFreq = new Map();
  for (const name of nameCounts.values()) {
    displayNameFreq.set(name, (displayNameFreq.get(name) || 0) + 1);
  }

  const regionMap = new Map();
  filteredRows.forEach((row) => {
    if (!regionMap.has(row.local_code)) {
      const isAmbiguous = (displayNameFreq.get(row.local_name) || 0) > 1;
      const sido = SIDO_BY_PREFIX[row.local_code.slice(0, 2)];
      const name = isAmbiguous && sido ? `${sido} ${row.local_name}` : row.local_name;
      regionMap.set(row.local_code, { code: row.local_code, name });
    }
  });

  return {
    rows,
    regions: [...regionMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "ko")
    ),
    dataDate: resolveDataDate()
  };
}
