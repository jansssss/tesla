import { getAllGuides } from "../lib/guides.js";
import { MERGED_REDIRECTS } from "../lib/mergedGuides.js";

const guides = getAllGuides();
const slugs = new Set(guides.map((guide) => guide.slug));
const errors = [];
const warnings = [];

const OFFICIAL_SOURCE_HOSTS = new Set([
  "www.tesla.com",
  "tesla.com",
  "www.ev.or.kr",
  "ev.or.kr",
  "www.me.go.kr",
  "me.go.kr",
  "finlife.fss.or.kr",
  "www.fss.or.kr",
  "fss.or.kr",
  "www.nts.go.kr",
  "nts.go.kr",
  "www.car365.go.kr",
  "car365.go.kr",
  "www.law.go.kr",
  "law.go.kr",
]);

const EMOJI_PATTERN = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const HYPE_PATTERN = /(완벽\s*가이드|완전\s*정리|무조건|반드시\s*(유리|구매|승인)|충격|대박|솔직한\s*판단)/;
const FAKE_EXPERIENCE_PATTERN = /(제가\s*(직접|타보|구매)|저는\s*(직접|구매|운전)|타면서\s*느꼈|솔직히\s*말하면)/;

function articleText(guide) {
  return [
    guide.title,
    guide.description,
    ...(guide.keyPoints || []),
    guide.readerNeed?.question || "",
    guide.readerNeed?.intent || "",
    ...(guide.sections || []).flatMap((section) => [
      section.title,
      ...(section.paragraphs || []),
      ...(section.bullets || []),
      section.callout || "",
      ...(section.table?.headers || []),
      ...(section.table?.rows || []).flat(),
    ]),
  ].join(" ");
}

function fail(slug, message) {
  errors.push(`${slug}: ${message}`);
}

if (guides.length < 30) {
  errors.push(`공개 대표 글은 최소 30편이어야 합니다. 현재 ${guides.length}편입니다.`);
}

if (slugs.size !== guides.length) {
  errors.push("공개 가이드 slug가 중복되었습니다.");
}

for (const guide of guides) {
  const text = articleText(guide);
  const sections = guide.sections || [];
  const paragraphCount = sections.reduce((sum, section) => sum + (section.paragraphs?.length || 0), 0);
  const tableCount = sections.filter((section) => section.table?.rows?.length).length;
  const bulletCount = sections.reduce((sum, section) => sum + (section.bullets?.length || 0), 0);

  if (!guide.readerNeed?.question || !guide.readerNeed?.stage || !guide.readerNeed?.intent) {
    fail(guide.slug, "대상 독자·핵심 질문·확인 시점이 없습니다.");
  }
  if ((guide.keyPoints || []).length < 3) fail(guide.slug, "핵심 요약은 3개 이상이어야 합니다.");
  if (sections.length < 5) fail(guide.slug, "본문 섹션은 5개 이상이어야 합니다.");
  if (paragraphCount < 8) fail(guide.slug, "완전한 설명 문단은 8개 이상이어야 합니다.");
  if (tableCount < 1) fail(guide.slug, "판단 기준 비교표가 없습니다.");
  if (bulletCount < 5) fail(guide.slug, "실행 체크리스트가 5개 미만입니다.");
  if (text.replace(/\s/g, "").length < 1400) fail(guide.slug, "실질 본문이 1,400자 미만입니다.");
  if (EMOJI_PATTERN.test(text)) fail(guide.slug, "본문에 이모티콘 또는 장식용 기호가 있습니다.");
  if (HYPE_PATTERN.test(text)) fail(guide.slug, "과장형·단정형 문구가 있습니다.");
  if (FAKE_EXPERIENCE_PATTERN.test(text)) fail(guide.slug, "검증되지 않은 1인칭 경험 표현이 있습니다.");

  if ((guide.sources || []).length < 2) fail(guide.slug, "공식 출처가 2개 미만입니다.");
  for (const source of guide.sources || []) {
    try {
      const url = new URL(source.url);
      if (!OFFICIAL_SOURCE_HOSTS.has(url.hostname)) {
        fail(guide.slug, `검증 허용 목록에 없는 출처입니다: ${url.hostname}`);
      }
    } catch {
      fail(guide.slug, `출처 URL이 올바르지 않습니다: ${source.url}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.accessedAt || "")) {
      fail(guide.slug, `출처 확인일 형식이 올바르지 않습니다: ${source.name}`);
    }
  }

  if ((guide.relatedSlugs || []).length !== 3) {
    fail(guide.slug, "관련 대표 글은 정확히 3개여야 합니다.");
  }
  for (const relatedSlug of guide.relatedSlugs || []) {
    if (relatedSlug === guide.slug) fail(guide.slug, "자기 자신을 관련 글로 연결했습니다.");
    if (!slugs.has(relatedSlug)) fail(guide.slug, `공개되지 않은 관련 글로 연결했습니다: ${relatedSlug}`);
  }
}

const redirectSources = new Set();
for (const redirect of MERGED_REDIRECTS) {
  if (redirectSources.has(redirect.from)) errors.push(`리다이렉트 출발 slug 중복: ${redirect.from}`);
  redirectSources.add(redirect.from);
  if (!slugs.has(redirect.to)) errors.push(`리다이렉트 목적지가 공개 대표 글이 아닙니다: ${redirect.to}`);
  if (slugs.has(redirect.from)) errors.push(`공개 대표 글을 다시 리다이렉트하고 있습니다: ${redirect.from}`);
}

if (MERGED_REDIRECTS.length !== 27) {
  errors.push(`통합 대상은 27개여야 합니다. 현재 ${MERGED_REDIRECTS.length}개입니다.`);
}

const titleWords = new Map();
for (const guide of guides) {
  const key = guide.title.replace(/[\s·:?,.()]/g, "").slice(0, 16);
  if (titleWords.has(key)) warnings.push(`제목 앞부분이 유사합니다: ${titleWords.get(key)} / ${guide.slug}`);
  titleWords.set(key, guide.slug);
}

if (errors.length) {
  console.error(`[content:audit] 실패 ${errors.length}건`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`[content:audit] 통과: 대표 글 ${guides.length}편, 통합 리다이렉트 ${MERGED_REDIRECTS.length}개`);
if (warnings.length) {
  console.log(`[content:audit] 참고 ${warnings.length}건`);
  for (const warning of warnings) console.log(`- ${warning}`);
}
