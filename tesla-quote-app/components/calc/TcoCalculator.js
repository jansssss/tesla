"use client";

import { useState, useMemo } from "react";
import { calcTco, CALC_DEFAULTS } from "@/lib/calcExtra";
import { formatWon } from "@/lib/quoteCalculations";
import CalcField from "@/components/calc/CalcField";

export default function TcoCalculator() {
  const [price, setPrice] = useState(49990000);
  const [subsidy, setSubsidy] = useState(0);
  const [depreciationRate, setDepreciationRate] = useState(CALC_DEFAULTS.depreciationRate);
  const [insurance, setInsurance] = useState(CALC_DEFAULTS.insurancePerYear);
  const [charging, setCharging] = useState(720000);
  const [years, setYears] = useState(5);

  // 내연기관 비교 가정
  const [compareIce, setCompareIce] = useState(true);
  const [icePrice, setIcePrice] = useState(40000000);
  const annualKm = 15000;

  const result = useMemo(
    () =>
      calcTco({
        price,
        subsidy,
        depreciationRate,
        insurance,
        charging,
        years,
        iceOptions: compareIce
          ? {
              price: icePrice,
              annualKm,
              fuelEfficiency: CALC_DEFAULTS.ice.fuelEfficiency,
              fuelPrice: CALC_DEFAULTS.ice.fuelPrice,
              maintenancePerYear: CALC_DEFAULTS.ice.maintenancePerYear,
            }
          : null,
      }),
    [price, subsidy, depreciationRate, insurance, charging, years, compareIce, icePrice]
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 space-y-4">
        <CalcField label="차량 가격" suffix="원" value={price} onChange={(v) => setPrice(v)} step={1000000} />
        <CalcField label="보조금" suffix="원" value={subsidy} onChange={(v) => setSubsidy(v)} step={500000} />
        <p className="-mt-2 text-[11px] leading-relaxed text-slate-400">
          지역별 보조금은 <a href="/" className="text-blue-600 hover:underline">홈 계산기</a>에서 지역 선택 후 확인해 입력하세요.
        </p>
        <CalcField label="연 감가상각률" suffix="%" value={depreciationRate} onChange={(v) => setDepreciationRate(v)} step={1} />
        <CalcField label="연 보험료" suffix="원" value={insurance} onChange={(v) => setInsurance(v)} step={50000} />
        <CalcField label="연 충전비" suffix="원" value={charging} onChange={(v) => setCharging(v)} step={60000} />
        <CalcField label="보유기간" suffix="년" value={years} onChange={(v) => setYears(v)} step={1} />

        <label className="flex items-center gap-2 pt-1 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={compareIce}
            onChange={(e) => setCompareIce(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          동급 내연기관차와 비교
        </label>
        {compareIce ? (
          <CalcField label="비교 내연차 가격" suffix="원" value={icePrice} onChange={(v) => setIcePrice(v)} step={1000000} />
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 md:p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">간이 TCO (총소유비용)</p>
        <p className="mt-1 text-[11px] text-slate-500">감가상각 + 운영비 기준의 간이 추정치입니다.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] leading-relaxed">
          <div className="rounded-lg bg-emerald-500/10 p-2.5">
            <p className="font-bold text-emerald-300">포함</p>
            <p className="mt-0.5 text-slate-300">감가상각 · 보험료 · 충전비</p>
          </div>
          <div className="rounded-lg bg-rose-500/10 p-2.5">
            <p className="font-bold text-rose-300">미포함</p>
            <p className="mt-0.5 text-slate-300">할부 이자 · 취득/등록세 · 정비 · 타이어 · 통행/주차</p>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-slate-400">{years}년 예상 지출</p>
            <p className="text-3xl font-black tracking-tight">{formatWon(result.total)}</p>
            <p className="mt-1 text-sm text-slate-400">월 평균 {formatWon(result.monthly)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">감가상각비</p>
              <p className="mt-1 text-base font-black">{formatWon(result.depreciation)}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">운영비(보험+충전)</p>
              <p className="mt-1 text-base font-black">{formatWon(result.operating)}</p>
            </div>
          </div>
          {result.iceTotal !== null ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">동급 내연차 {years}년 총비용</p>
              <p className="mt-1 text-lg font-black">{formatWon(result.iceTotal)}</p>
              <p
                className={`mt-2 text-sm font-bold ${
                  result.iceDiff >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {result.iceDiff >= 0
                  ? `전기차가 약 ${formatWon(result.iceDiff)} 저렴`
                  : `전기차가 약 ${formatWon(-result.iceDiff)} 더 비쌈`}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
