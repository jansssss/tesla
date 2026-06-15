import fs from "fs";
import path from "path";

const APP_DATA_DIR = path.join(process.cwd(), "data");
const APP_DATA_CSV = path.join(APP_DATA_DIR, "latest.csv");
const SHARED_DATA_DIR = path.join(process.cwd(), "..", "보조금");

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

  const regionMap = new Map();
  rows.forEach((row) => {
    if (!regionMap.has(row.local_code)) {
      regionMap.set(row.local_code, {
        code: row.local_code,
        name: row.local_name
      });
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
