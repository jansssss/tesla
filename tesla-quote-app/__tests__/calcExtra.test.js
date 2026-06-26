import { describe, it, expect } from "vitest";
import { calcMaintenance, calcCharging, calcTco, CALC_DEFAULTS } from "../lib/calcExtra.js";

// ─── calcCharging ────────────────────────────────────────────────────────────

describe("calcCharging", () => {
  it("정상 입력 — 월 충전비 계산", () => {
    const result = calcCharging({
      monthlyKm: 1000,
      efficiency: 5,
      fastRatio: 0.2,
      slowRatio: 0.8,
      fastPrice: 400,
      slowPrice: 300,
    });
    // 월 kWh = 1000 / 5 = 200
    // blended = 0.2*400 + 0.8*300 = 80+240 = 320 원/kWh
    // monthly = 200 * 320 = 64,000
    expect(result.monthlyKwh).toBe(200);
    expect(result.blendedPrice).toBe(320);
    expect(result.monthly).toBe(64000);
    expect(result.annual).toBe(64000 * 12);
  });

  it("월 주행거리 0 — 충전비 0", () => {
    const result = calcCharging({
      monthlyKm: 0,
      efficiency: 5,
      fastRatio: 0.5,
      slowRatio: 0.5,
      fastPrice: 400,
      slowPrice: 300,
    });
    expect(result.monthly).toBe(0);
    expect(result.monthlyKwh).toBe(0);
  });

  it("빈 입력값(undefined) — 0으로 대체, 오류 없음", () => {
    const result = calcCharging({
      monthlyKm: undefined,
      efficiency: undefined,
      fastRatio: undefined,
      slowRatio: undefined,
      fastPrice: undefined,
      slowPrice: undefined,
    });
    expect(Number.isFinite(result.monthly)).toBe(true);
    expect(result.monthly).toBe(0);
  });

  it("문자열 입력값 — 숫자 변환 또는 0으로 처리", () => {
    const result = calcCharging({
      monthlyKm: "1000",
      efficiency: "5",
      fastRatio: "0.2",
      slowRatio: "0.8",
      fastPrice: "400",
      slowPrice: "300",
    });
    expect(Number.isFinite(result.monthly)).toBe(true);
    expect(result.monthly).toBeGreaterThan(0);
  });

  it("충전 비율 합계 100% — 정상 계산", () => {
    const result = calcCharging({
      monthlyKm: 1000,
      efficiency: 5,
      fastRatio: 0.3,
      slowRatio: 0.7,
      fastPrice: 400,
      slowPrice: 300,
    });
    // blended = 0.3*400 + 0.7*300 = 120+210 = 330
    expect(result.blendedPrice).toBe(330);
  });

  it("충전 비율 합계 100% 아님 — 비율로 정규화하여 계산, Infinity 없음", () => {
    // fastRatio + slowRatio = 0.3 + 0.3 = 0.6 (합이 1 아님)
    const result = calcCharging({
      monthlyKm: 1000,
      efficiency: 5,
      fastRatio: 0.3,
      slowRatio: 0.3,
      fastPrice: 400,
      slowPrice: 300,
    });
    expect(Number.isFinite(result.monthly)).toBe(true);
    expect(Number.isFinite(result.blendedPrice)).toBe(true);
  });

  it("급속 비율 0 — 완속만 사용", () => {
    const result = calcCharging({
      monthlyKm: 1000,
      efficiency: 5,
      fastRatio: 0,
      slowRatio: 1,
      fastPrice: 400,
      slowPrice: 300,
    });
    expect(result.blendedPrice).toBe(300);
  });
});

// ─── calcMaintenance ─────────────────────────────────────────────────────────

describe("calcMaintenance", () => {
  it("정상 입력 — 연·월·5년 비용 계산", () => {
    const result = calcMaintenance({
      annualKm: 15000,
      chargePrice: 300,
      efficiency: 5,
      insurance: 1200000,
      tax: 130000,
    });
    // annualCharge = 15000/5 * 300 = 900,000
    // annual = 900,000 + 1,200,000 + 130,000 = 2,230,000
    expect(result.annualCharge).toBe(900000);
    expect(result.annual).toBe(2230000);
    expect(result.monthly).toBe(Math.round(2230000 / 12));
    expect(result.fiveYear).toBe(2230000 * 5);
  });

  it("보험료 0 — 보험 제외 계산", () => {
    const result = calcMaintenance({
      annualKm: 12000,
      chargePrice: 300,
      efficiency: 5,
      insurance: 0,
      tax: 130000,
    });
    expect(result.annual).toBe(12000 / 5 * 300 + 130000);
  });

  it("빈 입력값 — 오류 없이 0 반환", () => {
    const result = calcMaintenance({
      annualKm: undefined,
      chargePrice: undefined,
      efficiency: undefined,
      insurance: undefined,
      tax: undefined,
    });
    expect(Number.isFinite(result.annual)).toBe(true);
    expect(result.annual).toBe(0);
  });
});

// ─── calcTco ─────────────────────────────────────────────────────────────────

describe("calcTco", () => {
  it("정상 입력 — TCO 계산", () => {
    const result = calcTco({
      price: 50000000,
      subsidy: 7000000,
      depreciationRate: 12,
      insurance: 1200000,
      charging: 720000,
      years: 5,
    });
    // netPrice = 43,000,000
    // residual = 50,000,000 * (0.88^5) ≈ 26,916,736
    // depreciation = netPrice - residual = 43,000,000 - 26,916,736 = 16,083,264
    // operating = (1,200,000 + 720,000) * 5 = 9,600,000
    // total = ~25,683,264
    expect(result.netPrice).toBe(43000000);
    expect(result.total).toBeGreaterThan(0);
    expect(Number.isFinite(result.total)).toBe(true);
    expect(result.monthly).toBe(Math.round(result.total / (5 * 12)));
    expect(result.iceTotal).toBeNull();
  });

  it("보유기간 0 — monthly 0, 오류 없음", () => {
    const result = calcTco({
      price: 50000000,
      subsidy: 5000000,
      depreciationRate: 12,
      insurance: 1200000,
      charging: 720000,
      years: 0,
    });
    expect(result.monthly).toBe(0);
    expect(Number.isFinite(result.total)).toBe(true);
  });

  it("보조금 > 차량가 — netPrice 0으로 클램프", () => {
    const result = calcTco({
      price: 30000000,
      subsidy: 40000000,
      depreciationRate: 12,
      insurance: 1200000,
      charging: 720000,
      years: 5,
    });
    expect(result.netPrice).toBe(0);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("내연기관 비교 포함 — iceDiff 계산", () => {
    const result = calcTco({
      price: 50000000,
      subsidy: 7000000,
      depreciationRate: 12,
      insurance: 1200000,
      charging: 720000,
      years: 5,
      iceOptions: {
        price: 40000000,
        annualKm: 15000,
        fuelEfficiency: 12,
        fuelPrice: 1700,
        maintenancePerYear: 600000,
      },
    });
    expect(result.iceTotal).not.toBeNull();
    expect(Number.isFinite(result.iceDiff)).toBe(true);
  });

  it("빈 입력값 — Infinity/NaN 없음", () => {
    const result = calcTco({
      price: undefined,
      subsidy: undefined,
      depreciationRate: undefined,
      insurance: undefined,
      charging: undefined,
      years: undefined,
    });
    expect(Number.isFinite(result.total)).toBe(true);
    expect(Number.isFinite(result.monthly)).toBe(true);
  });
});
