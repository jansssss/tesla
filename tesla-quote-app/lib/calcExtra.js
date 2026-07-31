/**
 * 부가 계산기(유지비·충전비·TCO·모델비교) 공용 계산 로직
 * - 모든 함수는 순수 함수(서버/클라이언트 양쪽 사용 가능)
 * - 기본 가정값은 사용자가 조정할 수 있으며, 출처·기준일은 페이지에 명시한다.
 */

// ─────────────────────────────────────────────
// 기본 가정값 (2026년 기준, 사용자 조정 가능)
// ─────────────────────────────────────────────
export const CALC_DEFAULTS = {
  // 충전 단가 (원/kWh)
  slowPrice: 300, // 완속(가정용·공용 완속) 평균 가정
  fastPrice: 400, // 급속(공공 급속) 평균 가정
  // 전비 (km/kWh) — Model 3/Y 평균 가정
  efficiency: 5.5,
  // 연간 고정비 (원)
  insurancePerYear: 1200000, // 보험료(가정)
  taxPerYear: 130000, // 전기차 자동차세(비영업용, 지방교육세 포함 가정)
  // 감가상각률 (연 %, 잔존가치 = 차량가 × (1-율)^연수)
  depreciationRate: 12,
  // 내연기관 비교 가정
  ice: {
    fuelEfficiency: 12, // km/L (동급 가솔린차 가정)
    fuelPrice: 1700, // 원/L (휘발유 가정)
    maintenancePerYear: 600000, // 내연 정비·소모품(가정)
  },
};

export const CALC_DATA_DATE = "2026-07-02";

/**
 * 유지비 계산
 * @param {Object} p
 * @param {number} p.annualKm        연간 주행거리(km)
 * @param {number} p.chargePrice     충전 단가(원/kWh)
 * @param {number} p.efficiency      전비(km/kWh)
 * @param {number} p.insurance       연 보험료(원)
 * @param {number} p.tax             연 자동차세(원)
 * @returns {{monthly:number, annual:number, fiveYear:number, annualCharge:number}}
 */
export function calcMaintenance({ annualKm, chargePrice, efficiency, insurance, tax }) {
  const km = Math.max(Number(annualKm) || 0, 0);
  const eff = Math.max(Number(efficiency) || 0, 0.1);
  const annualCharge = (km / eff) * (Number(chargePrice) || 0);
  const annual = annualCharge + (Number(insurance) || 0) + (Number(tax) || 0);
  return {
    annualCharge: Math.round(annualCharge),
    monthly: Math.round(annual / 12),
    annual: Math.round(annual),
    fiveYear: Math.round(annual * 5),
  };
}

/**
 * 충전비 계산
 * @param {Object} p
 * @param {number} p.monthlyKm   월 주행거리(km)
 * @param {number} p.efficiency  전비(km/kWh)
 * @param {number} p.fastRatio   급속 비율(%)
 * @param {number} p.slowRatio   완속 비율(%)
 * @param {number} p.fastPrice   급속 단가(원/kWh)
 * @param {number} p.slowPrice   완속 단가(원/kWh)
 * @returns {{monthly:number, annual:number, monthlyKwh:number, blendedPrice:number}}
 */
export function calcCharging({ monthlyKm, efficiency, fastRatio, slowRatio, fastPrice, slowPrice }) {
  const km = Math.max(Number(monthlyKm) || 0, 0);
  const eff = Math.max(Number(efficiency) || 0, 0.1);
  const fast = Math.max(Number(fastRatio) || 0, 0);
  const slow = Math.max(Number(slowRatio) || 0, 0);
  const totalRatio = fast + slow || 1;
  const monthlyKwh = km / eff;
  const blendedPrice =
    ((fast / totalRatio) * (Number(fastPrice) || 0)) +
    ((slow / totalRatio) * (Number(slowPrice) || 0));
  const monthly = monthlyKwh * blendedPrice;
  return {
    monthlyKwh: Math.round(monthlyKwh),
    blendedPrice: Math.round(blendedPrice),
    monthly: Math.round(monthly),
    annual: Math.round(monthly * 12),
  };
}

/**
 * 홈 충전기 설치 손익 계산
 * 설치 전후의 가중 평균 충전 단가 차이로 월 절감액을 구하고, 설치비 회수 기간을 산출한다.
 * @param {Object} p
 * @param {number} p.installCost   설치비(원)
 * @param {number} p.monthlyKm     월 주행거리(km)
 * @param {number} p.efficiency    전비(km/kWh)
 * @param {number} p.beforeSlowRatio 설치 전 완속(공용) 비율(%)
 * @param {number} p.afterSlowRatio  설치 후 완속(가정용) 비율(%)
 * @param {number} p.homePrice     가정용 충전 단가(원/kWh)
 * @param {number} p.publicSlowPrice 공용 완속 단가(원/kWh)
 * @param {number} p.fastPrice     급속 단가(원/kWh)
 * @returns {{monthlyKwh, beforePrice, afterPrice, beforeMonthly, afterMonthly, monthlySaving, paybackMonths, fiveYearSaving}}
 */
export function calcChargerInstall({
  installCost,
  monthlyKm,
  efficiency,
  beforeSlowRatio,
  afterSlowRatio,
  homePrice,
  publicSlowPrice,
  fastPrice,
}) {
  const km = Math.max(Number(monthlyKm) || 0, 0);
  const eff = Math.max(Number(efficiency) || 0, 0.1);
  const monthlyKwh = km / eff;

  const clampPct = (v) => Math.min(Math.max(Number(v) || 0, 0), 100);
  const beforeSlow = clampPct(beforeSlowRatio);
  const afterSlow = clampPct(afterSlowRatio);

  // 설치 전: 공용 완속 + 급속
  const beforePrice =
    (beforeSlow / 100) * (Number(publicSlowPrice) || 0) +
    ((100 - beforeSlow) / 100) * (Number(fastPrice) || 0);
  // 설치 후: 가정용 완속 + 급속
  const afterPrice =
    (afterSlow / 100) * (Number(homePrice) || 0) +
    ((100 - afterSlow) / 100) * (Number(fastPrice) || 0);

  const beforeMonthly = monthlyKwh * beforePrice;
  const afterMonthly = monthlyKwh * afterPrice;
  const monthlySaving = beforeMonthly - afterMonthly;
  const cost = Math.max(Number(installCost) || 0, 0);
  const paybackMonths = monthlySaving > 0 ? cost / monthlySaving : null;

  return {
    monthlyKwh: Math.round(monthlyKwh),
    beforePrice: Math.round(beforePrice),
    afterPrice: Math.round(afterPrice),
    beforeMonthly: Math.round(beforeMonthly),
    afterMonthly: Math.round(afterMonthly),
    monthlySaving: Math.round(monthlySaving),
    paybackMonths: paybackMonths === null ? null : Math.ceil(paybackMonths),
    fiveYearSaving: Math.round(monthlySaving * 60 - cost),
  };
}

/**
 * 충전 시간 계산
 * 충전기 출력과 배터리 용량, 시작/목표 충전율로 소요 시간을 추정한다.
 * @param {Object} p
 * @param {number} p.batteryKwh  배터리 용량(kWh)
 * @param {number} p.startSoc    현재 충전율(%)
 * @param {number} p.targetSoc   목표 충전율(%)
 * @param {number} p.powerKw     충전기 출력(kW)
 * @param {number} p.efficiency  충전 효율(%) — 손실을 반영한 실효 비율
 * @returns {{neededKwh, hours, minutes, totalMinutes, addedKm}}
 */
export function calcChargingTime({ batteryKwh, startSoc, targetSoc, powerKw, efficiency = 90, rangeKm }) {
  const cap = Math.max(Number(batteryKwh) || 0, 0);
  const start = Math.min(Math.max(Number(startSoc) || 0, 0), 100);
  const target = Math.min(Math.max(Number(targetSoc) || 0, 0), 100);
  const kw = Math.max(Number(powerKw) || 0, 0.1);
  const eff = Math.min(Math.max(Number(efficiency) || 0, 1), 100) / 100;

  const deltaSoc = Math.max(target - start, 0);
  const neededKwh = cap * (deltaSoc / 100);
  const totalMinutes = neededKwh > 0 ? (neededKwh / (kw * eff)) * 60 : 0;

  // 충전으로 늘어나는 주행거리(인증 주행거리 기준 비례 추정)
  const addedKm = rangeKm ? Math.round((Number(rangeKm) || 0) * (deltaSoc / 100)) : null;

  return {
    neededKwh: Math.round(neededKwh * 10) / 10,
    totalMinutes: Math.round(totalMinutes),
    hours: Math.floor(totalMinutes / 60),
    minutes: Math.round(totalMinutes % 60),
    addedKm,
  };
}

/**
 * 총소유비용(TCO) 계산
 * 총비용 = 초기 실구매가(차량가-보조금) - 잔존가치 + 운영비(보험+충전)×보유기간
 * @param {Object} p
 * @param {number} p.price            차량 가격(원)
 * @param {number} p.subsidy          보조금(원)
 * @param {number} p.depreciationRate 연 감가상각률(%)
 * @param {number} p.insurance        연 보험료(원)
 * @param {number} p.charging         연 충전비(원)
 * @param {number} p.years            보유기간(년)
 * @param {Object} [p.iceOptions]     내연 비교 가정 {price, fuelEfficiency, fuelPrice, maintenancePerYear, annualKm}
 * @returns {{netPrice, residual, depreciation, operating, total, monthly, iceTotal, iceDiff}}
 */
export function calcTco({ price, subsidy, depreciationRate, insurance, charging, years, iceOptions }) {
  const p = Math.max(Number(price) || 0, 0);
  const sub = Math.max(Number(subsidy) || 0, 0);
  const yrs = Math.max(Number(years) || 0, 0);
  const rate = Math.min(Math.max(Number(depreciationRate) || 0, 0), 100) / 100;

  const netPrice = Math.max(p - sub, 0);
  const residual = p * Math.pow(1 - rate, yrs);
  const depreciation = Math.max(netPrice - residual, 0);
  const operating = ((Number(insurance) || 0) + (Number(charging) || 0)) * yrs;
  const total = depreciation + operating;
  const monthly = yrs > 0 ? total / (yrs * 12) : 0;

  let iceTotal = null;
  let iceDiff = null;
  if (iceOptions) {
    const icePrice = Math.max(Number(iceOptions.price) || 0, 0);
    const iceResidual = icePrice * Math.pow(1 - rate, yrs);
    const iceDep = Math.max(icePrice - iceResidual, 0);
    const annualKm = Math.max(Number(iceOptions.annualKm) || 0, 0);
    const fuelEff = Math.max(Number(iceOptions.fuelEfficiency) || 0, 0.1);
    const annualFuel = (annualKm / fuelEff) * (Number(iceOptions.fuelPrice) || 0);
    const iceOperating =
      (annualFuel + (Number(iceOptions.maintenancePerYear) || 0) + (Number(insurance) || 0)) * yrs;
    iceTotal = iceDep + iceOperating;
    iceDiff = iceTotal - total; // 양수면 내연이 더 비쌈(전기차 절약액)
  }

  return {
    netPrice: Math.round(netPrice),
    residual: Math.round(residual),
    depreciation: Math.round(depreciation),
    operating: Math.round(operating),
    total: Math.round(total),
    monthly: Math.round(monthly),
    iceTotal: iceTotal === null ? null : Math.round(iceTotal),
    iceDiff: iceDiff === null ? null : Math.round(iceDiff),
  };
}
