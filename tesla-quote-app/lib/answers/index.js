/**
 * 답변 페이지 레지스트리.
 *
 * 설계 의도
 * ─────────
 * 검색자는 "테슬라"라는 단어가 든 질문 30개를 따로따로 검색하지 않는다.
 * 구매 전후로 이어지는 하나의 의도 체인을 따라 움직인다.
 * 그래서 이 사이트는 30개 질문을 독립 페이지로 흩어놓지 않고,
 * 1 → 2 → … → 30 → 다시 1로 돌아오는 폐쇄형 여정(JOURNEY)으로 묶는다.
 *
 * 중복은 만들지 않는다
 * ────────────────────
 * 30개 중 8개(2·5·6·7·8·10·13·14)는 이미 계산기/비교 페이지가 더 잘 답하고 있다.
 * 그 질문들은 글을 새로 쓰지 않고 JOURNEY에서 기존 페이지로 연결만 한다(kind: "external").
 * 남은 22개만 답변 페이지로 만든다(kind: "answer").
 */
import { MODEL_ANSWERS } from "./model.js";
import { MONEY_ANSWERS } from "./money.js";
import { CHARGING_ANSWERS } from "./charging.js";
import { RANGE_ANSWERS } from "./range.js";
import { BATTERY_ANSWERS } from "./battery.js";
import { OWNERSHIP_ANSWERS } from "./ownership.js";
import { RISK_ANSWERS } from "./risk.js";
import { FUTURE_ANSWERS } from "./future.js";

/** 전체 답변 페이지 (그룹 순서대로) */
export const ANSWERS = [
  ...MODEL_ANSWERS,
  ...MONEY_ANSWERS,
  ...CHARGING_ANSWERS,
  ...RANGE_ANSWERS,
  ...BATTERY_ANSWERS,
  ...OWNERSHIP_ANSWERS,
  ...RISK_ANSWERS,
  ...FUTURE_ANSWERS,
];

const BY_SLUG = Object.fromEntries(ANSWERS.map((a) => [a.slug, a]));

/** 허브에서 묶어 보여주는 분류 */
export const ANSWER_GROUPS = [
  { id: "model", label: "① 차를 고를 때", desc: "어떤 차를, 어떤 트림으로 살지 좁히는 단계입니다." },
  { id: "money", label: "② 돈 계산", desc: "차값 외에 매달·매년 나가는 금액을 확정합니다." },
  { id: "charging", label: "③ 충전 환경", desc: "전기차 만족도를 가장 크게 좌우하는 영역입니다." },
  { id: "range", label: "④ 주행거리", desc: "인증 거리와 실제 거리의 간극을 조건별로 계산합니다." },
  { id: "battery", label: "⑤ 배터리", desc: "수명·충전 습관·보증까지 장기 보유의 근거를 만듭니다." },
  { id: "ownership", label: "⑥ 타면서 겪는 것", desc: "실제 오너가 마주치는 문제와 정비·소모품입니다." },
  { id: "risk", label: "⑦ 꺼려지는 이유", desc: "수리비와 화재 — 불안을 정면으로 다룹니다." },
  { id: "future", label: "⑧ 중고차와 FSD", desc: "중고 구매 체크리스트와 소프트웨어 옵션 판단." },
];

/**
 * 구매 의도 체인.
 * n: 원래 질문 번호(참고용), kind: "answer" | "external"
 */
export const JOURNEY = [
  { n: "1", kind: "answer", slug: "model-y-worth-buying" },
  {
    n: "2",
    kind: "external",
    label: "모델Y RWD와 롱레인지, 어떤 트림을 사야 할까?",
    href: "/compare/rwd-vs-awd",
    note: "구동 방식 비교 페이지에서 이미 다룹니다",
  },
  { n: "3", kind: "answer", slug: "model-y-vs-ioniq5" },
  { n: "4", kind: "answer", slug: "model-y-vs-ev6" },
  {
    n: "5",
    kind: "external",
    label: "모델 Y와 모델 3 중 어떤 차가 나에게 맞을까?",
    href: "/compare/model-3-vs-model-y",
    note: "모델 비교 페이지에서 이미 다룹니다",
  },
  {
    n: "6·7",
    kind: "external",
    label: "보조금은 얼마이고, 실제 구매가격은 얼마일까?",
    href: "/subsidy",
    note: "지역별 보조금이 자동 적용되는 실구매가 계산기",
  },
  {
    n: "8",
    kind: "external",
    label: "할부로 사면 한 달에 얼마를 내야 할까?",
    href: "/calc/monthly-real-cost",
    note: "할부금·충전비·보험료·세금을 합산한 계산기",
  },
  { n: "9", kind: "answer", slug: "tesla-insurance-cost" },
  {
    n: "10",
    kind: "external",
    label: "1년 유지비는 실제로 얼마나 들까?",
    href: "/calc/maintenance",
    note: "유지비 계산기에서 직접 계산합니다",
  },
  { n: "11", kind: "answer", slug: "tesla-car-tax" },
  { n: "12", kind: "answer", slug: "tesla-without-home-charger" },
  {
    n: "13",
    kind: "external",
    label: "아파트 완속충전만 쓰면 한 달 충전비는 얼마일까?",
    href: "/calc/charging",
    note: "충전비 계산기에서 급속·완속 비율로 계산합니다",
  },
  {
    n: "14",
    kind: "external",
    label: "수퍼차저는 20%에서 80%까지 얼마나 걸릴까?",
    href: "/calc/charging-time",
    note: "충전 시간 계산기에서 출력별로 계산합니다",
  },
  { n: "15", kind: "answer", slug: "tesla-fast-charging-ccs" },
  { n: "16", kind: "answer", slug: "ev-charging-card" },
  { n: "17", kind: "answer", slug: "model-y-real-range" },
  { n: "18", kind: "answer", slug: "tesla-winter-range" },
  { n: "19", kind: "answer", slug: "tesla-seoul-to-busan" },
  { n: "20", kind: "answer", slug: "tesla-lfp-vs-ncm" },
  { n: "21", kind: "answer", slug: "tesla-charge-80-or-100" },
  { n: "22", kind: "answer", slug: "tesla-battery-degradation" },
  { n: "23", kind: "answer", slug: "tesla-battery-warranty" },
  { n: "24", kind: "answer", slug: "tesla-phantom-drain" },
  { n: "25", kind: "answer", slug: "tesla-maintenance-items" },
  { n: "26", kind: "answer", slug: "tesla-tire-replacement" },
  { n: "27", kind: "answer", slug: "tesla-repair-cost" },
  { n: "28", kind: "answer", slug: "ev-fire-underground-parking" },
  { n: "29", kind: "answer", slug: "used-model-y-checklist" },
  { n: "30", kind: "answer", slug: "tesla-fsd-korea" },
];

/** JOURNEY 항목을 {label, href, note} 형태로 정규화 */
function resolveStop(stop) {
  if (!stop) return null;
  if (stop.kind === "answer") {
    const a = BY_SLUG[stop.slug];
    if (!a) return null;
    return { n: stop.n, kind: "answer", label: a.question, href: `/answers/${a.slug}`, note: a.heroSub };
  }
  return { n: stop.n, kind: "external", label: stop.label, href: stop.href, note: stop.note };
}

/** 정규화된 전체 여정 (허브에서 사용) */
export const JOURNEY_STOPS = JOURNEY.map(resolveStop).filter(Boolean);

/** slug로 답변 조회 */
export function getAnswer(slug) {
  return BY_SLUG[slug] ?? null;
}

/** generateStaticParams용 */
export function getAnswerSlugs() {
  return ANSWERS.map((a) => a.slug);
}

/** 그룹 id로 답변 목록 */
export function answersByGroup(groupId) {
  return ANSWERS.filter((a) => a.group === groupId);
}

/**
 * 여정에서 다음 지점 — 마지막(30번)이면 처음(1번)으로 돌아온다.
 * 폐쇄형 링크 구조를 만들기 위한 핵심 함수.
 */
export function getNextStop(slug) {
  const i = JOURNEY.findIndex((s) => s.kind === "answer" && s.slug === slug);
  if (i === -1) return null;
  return resolveStop(JOURNEY[(i + 1) % JOURNEY.length]);
}

/** 여정에서 이전 지점 */
export function getPrevStop(slug) {
  const i = JOURNEY.findIndex((s) => s.kind === "answer" && s.slug === slug);
  if (i === -1) return null;
  return resolveStop(JOURNEY[(i - 1 + JOURNEY.length) % JOURNEY.length]);
}

/** 여정 내 위치 (1-indexed) */
export function getStopPosition(slug) {
  const i = JOURNEY.findIndex((s) => s.kind === "answer" && s.slug === slug);
  return i === -1 ? null : { index: i + 1, total: JOURNEY.length, n: JOURNEY[i].n };
}

/** 답변 페이지 콘텐츠 최종 갱신일 — 사이트맵·표기에 공용 사용 */
export const ANSWERS_UPDATED_AT = "2026-08-10";
