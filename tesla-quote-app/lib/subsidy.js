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
    )
  };
}
