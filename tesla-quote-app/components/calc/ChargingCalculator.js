"use client";

import { useState, useMemo } from "react";
import { calcCharging, CALC_DEFAULTS } from "@/lib/calcExtra";
import { formatWon, formatNumber } from "@/lib/quoteCalculations";
import CalcField from "@/components/calc/CalcField";

export default function ChargingCalculator() {
  const [monthlyKm, setMonthlyKm] = useState(1250);
  const [efficiency, setEfficiency] = useState(CALC_DEFAULTS.efficiency);
  const [fastRatio, setFastRatio] = useState(30);
  const [slowRatio, setSlowRatio] = useState(70);
  const [fastPrice, setFastPrice] = useState(CALC_DEFAULTS.fastPrice);
  const [slowPrice, setSlowPrice] = useState(CALC_DEFAULTS.slowPrice);

  const result = useMemo(
    () => calcCharging({ monthlyKm, efficiency, fastRatio, slowRatio, fastPrice, slowPrice }),
    [monthlyKm, efficiency, fastRatio, slowRatio, fastPrice, slowPrice]
  );

  const ratioSum = (Number(fastRatio) || 0) + (Number(slowRatio) || 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 space-y-4">
        <CalcField label="월 주행거리" suffix="km" value={monthlyKm} onChange={(v) => setMonthlyKm(v)} step={100} />
        <CalcField label="전비" suffix="km/kWh" value={efficiency} onChange={(v) => setEfficiency(v)} step={0.1} />
        <div className="grid grid-cols-2 gap-3">
          <CalcField label="급속 비율" suffix="%" value={fastRatio} onChange={(v) => setFastRatio(v)} step={5} />
          <CalcField label="완속 비율" suffix="%" value={slowRatio} onChange={(v) => setSlowRatio(v)} step={5} />
        </div>
        {ratioSum !== 100 ? (
          <p className="text-xs text-amber-600">
            급속+완속 비율 합계가 {ratioSum}% 입니다. 비율대로 가중 평균해 계산하지만, 합계를 100%로 맞추면 더 정확합니다.
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <CalcField label="급속 단가" suffix="원/kWh" value={fastPrice} onChange={(v) => setFastPrice(v)} step={10} />
          <CalcField label="완속 단가" suffix="원/kWh" value={slowPrice} onChange={(v) => setSlowPrice(v)} step={10} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 md:p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">예상 충전비</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-slate-400">월 충전비</p>
            <p className="text-3xl font-black tracking-tight">{formatWon(result.monthly)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">연 충전비</p>
              <p className="mt-1 text-lg font-black">{formatWon(result.annual)}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">월 충전량</p>
              <p className="mt-1 text-lg font-black">{formatNumber(result.monthlyKwh)} kWh</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-6 text-slate-300">
            가중 평균 충전 단가는 약 <strong className="text-white">{formatNumber(result.blendedPrice)}원/kWh</strong> 입니다.
            완속 비중을 높일수록 충전비가 줄어듭니다.
          </div>
        </div>
      </div>
    </div>
  );
}
