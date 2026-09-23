import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function requireFile(relativePath) {
  if (!existsSync(resolve(root, relativePath))) {
    failures.push(`필수 페이지 또는 파일이 없습니다: ${relativePath}`);
  }
}

function requireText(relativePath, pattern, message) {
  const content = read(relativePath);
  if (!pattern.test(content)) failures.push(`${relativePath}: ${message}`);
}

const trustPages = [
  "app/about/page.js",
  "app/contact/page.js",
  "app/privacy/page.js",
  "app/terms/page.js",
  "app/disclaimer/page.js",
  "app/editorial-policy/page.js",
  "app/data-sources/page.js",
];

trustPages.forEach(requireFile);
requireFile("public/ads.txt");

requireText(
  "public/ads.txt",
  /^google\.com,\s*pub-\d+,\s*DIRECT,\s*f08c47fec0942fa0\s*$/m,
  "Google 판매자 선언이 올바르지 않습니다.",
);
requireText(
  "app/layout.js",
  /google-adsense-account["']?\s*:\s*ADSENSE_ACCOUNT/,
  "사이트 전체 AdSense 계정 메타 태그가 없습니다.",
);
requireText(
  "lib/guides.js",
  /export const GUIDES_SECTION_PUBLIC\s*=\s*true/,
  "가이드 섹션이 공개 상태가 아닙니다.",
);
requireText(
  "app/about/page.js",
  /AI[\s\S]*최종 대조/,
  "AI 보조 범위와 사람의 최종 검수 책임이 명시되지 않았습니다.",
);
requireText(
  "app/editorial-policy/page.js",
  /운영자 jans가[\s\S]*직접 대조/,
  "작성·검수 책임 주체가 명시되지 않았습니다.",
);
requireText(
  "app/editorial-policy/page.js",
  /정정 및 이의 제기/,
  "정정 절차가 명시되지 않았습니다.",
);

const guideRewrites = read("lib/guideRewrites.js");
const originalAnalysisCount = (guideRewrites.match(/originalAnalysis:\s*{/g) || []).length;
if (originalAnalysisCount < 5) {
  failures.push(`대표 가이드 자체 분석이 5개 미만입니다: ${originalAnalysisCount}개`);
}

if (failures.length) {
  console.error("AdSense 재심사 준비 점검 실패");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("AdSense 재심사 준비 점검 통과");
console.log(`- 신뢰 페이지 ${trustPages.length}개 확인`);
console.log(`- 자체 계산·분석 대표 가이드 ${originalAnalysisCount}개 확인`);
console.log("- ads.txt 및 사이트 계정 메타 확인");
