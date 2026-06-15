const fs = require("fs");
const path = require("path");

const APP_ROOT = path.resolve(__dirname, "..");
const TARGET_DIR = path.join(APP_ROOT, "data");
const TARGET_FILE = path.join(TARGET_DIR, "latest.csv");
const META_FILE = path.join(TARGET_DIR, "subsidy-meta.json");
const SOURCE_DIR = path.join(APP_ROOT, "..", "보조금");

function writeMeta(sourcePath) {
  const m = path.basename(sourcePath).match(/(\d{4})(\d{2})(\d{2})/);
  if (!m) return;
  const dataDate = `${m[1]}-${m[2]}-${m[3]}`;
  fs.writeFileSync(META_FILE, JSON.stringify({ dataDate }, null, 2) + "\n", "utf8");
  console.log(`wrote subsidy meta: dataDate=${dataDate}`);
}

function findLatestCsv(sourceDir) {
  if (!fs.existsSync(sourceDir)) return null;
  const files = fs
    .readdirSync(sourceDir)
    .filter((name) => /^tesla_subsidy_by_local_\d{8}\.csv$/i.test(name))
    .sort();
  if (files.length === 0) return null;
  return path.join(sourceDir, files[files.length - 1]);
}

function main() {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  const latest = findLatestCsv(SOURCE_DIR);

  if (latest) {
    fs.copyFileSync(latest, TARGET_FILE);
    writeMeta(latest);
    console.log(`synced subsidy csv: ${latest} -> ${TARGET_FILE}`);
    return;
  }

  if (fs.existsSync(TARGET_FILE)) {
    console.log(`no source csv found, keep existing: ${TARGET_FILE}`);
    return;
  }

  throw new Error(
    "No subsidy csv found. Put tesla_subsidy_by_local_YYYYMMDD.csv under ../보조금."
  );
}

main();
