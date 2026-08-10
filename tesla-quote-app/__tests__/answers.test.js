import { describe, it, expect } from "vitest";
import {
  ANSWERS,
  ANSWER_GROUPS,
  JOURNEY,
  JOURNEY_STOPS,
  getAnswer,
  getAnswerSlugs,
  getNextStop,
  getPrevStop,
} from "../lib/answers/index.js";
import { ANSWER_BREADCRUMB_LABELS } from "../lib/answerLabels.js";
import { CALCULATORS } from "../lib/calculators.js";

const CALC_HREFS = new Set(CALCULATORS.map((c) => c.href));

// 답변 페이지가 링크할 수 있는 기존 페이지 목록.
// 여기 없는 경로로 링크하면 404가 되므로 테스트로 막는다.
const KNOWN_HREFS = new Set([
  ...CALC_HREFS,
  "/calc",
  "/answers",
  "/models/model-3",
  "/models/model-y",
  "/models/model-y-l",
  "/compare/model-3-vs-model-y",
  "/compare/rwd-vs-awd",
  "/subsidy/seoul",
]);

describe("답변 레지스트리 무결성", () => {
  it("slug가 중복되지 않는다", () => {
    const slugs = getAnswerSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("모든 답변에 필수 필드가 있다", () => {
    for (const a of ANSWERS) {
      expect(a.slug, `slug 누락`).toBeTruthy();
      expect(a.question, `${a.slug}: question 누락`).toBeTruthy();
      expect(a.title, `${a.slug}: title 누락`).toBeTruthy();
      expect(a.description, `${a.slug}: description 누락`).toBeTruthy();
      expect(a.answer, `${a.slug}: answer(짧은 답) 누락`).toBeTruthy();
      expect(a.sections.length, `${a.slug}: 섹션 없음`).toBeGreaterThan(2);
      expect(a.sources.length, `${a.slug}: 출처 없음`).toBeGreaterThan(0);
      expect(a.dataNote, `${a.slug}: dataNote 누락`).toBeTruthy();
    }
  });

  it("모든 답변의 group이 정의된 그룹에 속한다", () => {
    const ids = new Set(ANSWER_GROUPS.map((g) => g.id));
    for (const a of ANSWERS) {
      expect(ids.has(a.group), `${a.slug}: 알 수 없는 group ${a.group}`).toBe(true);
    }
  });

  it("모든 답변에 FAQ 블록이 하나 이상 있다", () => {
    for (const a of ANSWERS) {
      const faq = a.sections.flatMap((s) => s.blocks.filter((b) => b.type === "faq"));
      expect(faq.length, `${a.slug}: FAQ 블록 없음`).toBeGreaterThan(0);
    }
  });

  it("브레드크럼 라벨이 모든 slug에 대해 존재한다", () => {
    for (const slug of getAnswerSlugs()) {
      expect(ANSWER_BREADCRUMB_LABELS[slug], `${slug}: 브레드크럼 라벨 누락`).toBeTruthy();
    }
  });

  it("브레드크럼 라벨에 존재하지 않는 slug가 없다", () => {
    const slugs = new Set(getAnswerSlugs());
    for (const slug of Object.keys(ANSWER_BREADCRUMB_LABELS)) {
      expect(slugs.has(slug), `${slug}: 답변에 없는 라벨`).toBe(true);
    }
  });
});

describe("내부 링크", () => {
  it("맥락형 내부링크가 실제 존재하는 경로를 가리킨다", () => {
    for (const a of ANSWERS) {
      for (const l of a.contextLinks) {
        const ok = KNOWN_HREFS.has(l.href) || l.href.startsWith("/answers/");
        expect(ok, `${a.slug}: 알 수 없는 링크 ${l.href}`).toBe(true);
      }
    }
  });

  it("calcCta가 계산기 레지스트리 또는 알려진 경로를 가리킨다", () => {
    for (const a of ANSWERS) {
      if (!a.calcCta) continue;
      expect(KNOWN_HREFS.has(a.calcCta), `${a.slug}: 알 수 없는 calcCta ${a.calcCta}`).toBe(true);
    }
  });

  it("각 답변은 맥락형 내부링크를 2개 이상 갖는다", () => {
    for (const a of ANSWERS) {
      expect(a.contextLinks.length, `${a.slug}: 내부링크 부족`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("구매 의도 체인(JOURNEY)", () => {
  it("모든 답변이 여정에 정확히 한 번 등장한다", () => {
    const inJourney = JOURNEY.filter((s) => s.kind === "answer").map((s) => s.slug);
    expect(new Set(inJourney).size).toBe(inJourney.length);
    expect(inJourney.sort()).toEqual(getAnswerSlugs().sort());
  });

  it("여정의 external 지점이 알려진 경로를 가리킨다", () => {
    for (const s of JOURNEY) {
      if (s.kind !== "external") continue;
      expect(KNOWN_HREFS.has(s.href), `알 수 없는 external 경로 ${s.href}`).toBe(true);
    }
  });

  it("모든 여정 지점이 정상적으로 해석된다", () => {
    expect(JOURNEY_STOPS.length).toBe(JOURNEY.length);
    for (const s of JOURNEY_STOPS) {
      expect(s.label).toBeTruthy();
      expect(s.href).toBeTruthy();
    }
  });

  it("마지막 답변의 다음은 첫 지점으로 돌아온다(폐쇄형)", () => {
    const last = JOURNEY[JOURNEY.length - 1];
    expect(last.kind).toBe("answer");
    const next = getNextStop(last.slug);
    expect(next.href).toBe(JOURNEY_STOPS[0].href);
  });

  it("첫 답변의 이전은 마지막 지점이다", () => {
    const first = JOURNEY[0];
    expect(first.kind).toBe("answer");
    const prev = getPrevStop(first.slug);
    expect(prev.href).toBe(JOURNEY_STOPS[JOURNEY_STOPS.length - 1].href);
  });

  it("모든 답변에서 다음 지점을 찾을 수 있다", () => {
    for (const slug of getAnswerSlugs()) {
      expect(getNextStop(slug), `${slug}: 다음 지점 없음`).toBeTruthy();
      expect(getPrevStop(slug), `${slug}: 이전 지점 없음`).toBeTruthy();
    }
  });
});

describe("조회 함수", () => {
  it("getAnswer는 존재하는 slug를 반환하고 없는 slug는 null", () => {
    expect(getAnswer("model-y-worth-buying")?.slug).toBe("model-y-worth-buying");
    expect(getAnswer("존재하지-않음")).toBeNull();
  });
});
