import { describe, it, expect } from "vitest";
import { monthlyPayment, calculateQuote, calcConversionSubsidyWon } from "../lib/quoteCalculations.js";

// ─── monthlyPayment ───────────────────────────────────────────────────────────

describe("monthlyPayment", () => {
  it("정상 입력 — 원리금균등 월 납입금 계산", () => {
    // 3억, 연 4%, 60개월 → 약 552만원/월
    const result = monthlyPayment(300000000, 4, 60);
    expect(result).toBeGreaterThan(5000000);
    expect(result).toBeLessThan(6000000);
    expect(Number.isFinite(result)).toBe(true);
  });

  it("금리 0% — 원금 / 개월수", () => {
    const result = monthlyPayment(6000000, 0, 60);
    expect(result).toBe(100000);
  });

  it("원금 0 — 납입금 0", () => {
    const result = monthlyPayment(0, 4, 60);
    expect(result).toBe(0);
  });

  it("개월수 0 — 납입금 0 (가드)", () => {
    const result = monthlyPayment(10000000, 4, 0);
    expect(result).toBe(0);
  });

  it("원금 음수 — 납입금 0 (가드)", () => {
    const result = monthlyPayment(-5000000, 4, 60);
    expect(result).toBe(0);
  });

  it("결과가 항상 유한수", () => {
    [
      [50000000, 3.6, 60],
      [0, 0, 0],
      [10000000, 100, 12],
    ].forEach(([p, r, m]) => {
      expect(Number.isFinite(monthlyPayment(p, r, m))).toBe(true);
    });
  });

  it("Model Y RWD 실구매가 예시 — 4,999만원, 보조금 700만, 선수금 1,000만, 연 4.9%, 60개월", () => {
    // 대출원금 = 49,990,000 - 7,000,000 - 10,000,000 = 32,990,000
    const principal = 49990000 - 7000000 - 10000000;
    const result = monthlyPayment(principal, 4.9, 60);
    // 합리적 범위 검증: 30만~100만원
    expect(result).toBeGreaterThan(300000);
    expect(result).toBeLessThan(1000000);
  });
});

// ─── calcConversionSubsidyWon ─────────────────────────────────────────────────

describe("calcConversionSubsidyWon", () => {
  it("일반 국비보조금에 비례 — min(100, round(100*국비/500)) 만원", () => {
    expect(calcConversionSubsidyWon(168)).toBe(340000); // round(33.6)=34
    expect(calcConversionSubsidyWon(170)).toBe(340000); // round(34)=34
    expect(calcConversionSubsidyWon(210)).toBe(420000); // 42
    expect(calcConversionSubsidyWon(215)).toBe(430000); // 43
  });

  it("국비 500만원 이상 — 100만원 전액 상한", () => {
    expect(calcConversionSubsidyWon(500)).toBe(1000000);
    expect(calcConversionSubsidyWon(600)).toBe(1000000);
  });

  it("국비 0/비정상 — 0원", () => {
    expect(calcConversionSubsidyWon(0)).toBe(0);
    expect(calcConversionSubsidyWon(undefined)).toBe(0);
    expect(calcConversionSubsidyWon(null)).toBe(0);
    expect(calcConversionSubsidyWon("abc")).toBe(0);
  });
});

describe("calculateQuote — 전환지원금(일반 국비 기준)", () => {
  it("전환지원금은 총보조금이 아닌 일반 국비보조금 기준으로 가산", () => {
    const result = calculateQuote({
      trim: { price: 49990000 },
      subsidy: { national_subsidy_manwon: 210, local_subsidy_manwon: 105, total_subsidy_manwon: 315 },
      benefits: {
        isYouthBenefit: false,
        isLowIncomeBenefit: false,
        isEvConversionBenefit: true,
        multiChildCount: 0,
      },
      financing: { downPayment: 0, rate: 0, months: 60 },
    });
    // 전환지원금 = min(100, round(100*210/500)) = 42만원 (총보조금 315만 기준 아님)
    expect(result.breakdown.evConversionBenefitWon).toBe(420000);
    expect(result.extraBenefitWon).toBe(420000);
  });
});

// ─── calculateQuote ───────────────────────────────────────────────────────────

describe("calculateQuote", () => {
  const baseTrim = { price: 49990000 };
  const baseSubsidy = {
    national_subsidy_manwon: 450,
    local_subsidy_manwon: 250,
    total_subsidy_manwon: 700,
  };
  const baseBenefits = {
    isYouthBenefit: false,
    isLowIncomeBenefit: false,
    isEvConversionBenefit: false,
    multiChildCount: 0,
  };
  const baseFinancing = { downPayment: 10000000, rate: 4.9, months: 60 };

  it("기본 견적 — 실구매가·월납입금 계산", () => {
    const result = calculateQuote({
      trim: baseTrim,
      subsidy: baseSubsidy,
      benefits: baseBenefits,
      financing: baseFinancing,
    });
    // 보조금 700만 → 실구매가 = 49,990,000 - 7,000,000 = 42,990,000
    expect(result.estimatedPrice).toBe(42990000);
    // 대출원금 = 42,990,000 - 10,000,000 = 32,990,000
    expect(result.loanPrincipal).toBe(32990000);
    expect(result.monthly).toBeGreaterThan(0);
    expect(Number.isFinite(result.monthly)).toBe(true);
  });

  it("청년 혜택 — 국고보조금의 20% 추가", () => {
    const result = calculateQuote({
      trim: baseTrim,
      subsidy: baseSubsidy,
      benefits: { ...baseBenefits, isYouthBenefit: true },
      financing: baseFinancing,
    });
    const nationalWon = 4500000;
    const youthBonus = Math.round(nationalWon * 0.2);
    expect(result.breakdown.youthBenefitWon).toBe(youthBonus);
    expect(result.estimatedPrice).toBe(42990000 - youthBonus);
  });

  it("선수금 > 실구매가 — 대출원금 0으로 클램프", () => {
    const result = calculateQuote({
      trim: baseTrim,
      subsidy: baseSubsidy,
      benefits: baseBenefits,
      financing: { ...baseFinancing, downPayment: 99000000 },
    });
    expect(result.loanPrincipal).toBe(0);
    expect(result.monthly).toBe(0);
  });

  it("금리 0% 무이자 할부", () => {
    const result = calculateQuote({
      trim: baseTrim,
      subsidy: baseSubsidy,
      benefits: baseBenefits,
      financing: { downPayment: 0, rate: 0, months: 60 },
    });
    const expectedMonthly = Math.round(result.estimatedPrice / 60);
    expect(result.monthly).toBe(expectedMonthly);
  });

  it("다자녀 4명 — 300만원 추가 혜택", () => {
    const result = calculateQuote({
      trim: baseTrim,
      subsidy: baseSubsidy,
      benefits: { ...baseBenefits, multiChildCount: 4 },
      financing: baseFinancing,
    });
    expect(result.breakdown.multiChildBenefitWon).toBe(3000000);
  });

  it("월납입금이 항상 유한수", () => {
    const result = calculateQuote({
      trim: { price: 0 },
      subsidy: { national_subsidy_manwon: 0, local_subsidy_manwon: 0, total_subsidy_manwon: 0 },
      benefits: baseBenefits,
      financing: { downPayment: 0, rate: 0, months: 0 },
    });
    expect(Number.isFinite(result.monthly)).toBe(true);
  });
});
