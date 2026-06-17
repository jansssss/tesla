"use client";

import { useState, useMemo } from "react";
import { calcMaintenance, CALC_DEFAULTS } from "@/lib/calcExtra";
import { formatWon } from "@/lib/quoteCalculations";
import CalcField from "@/components/calc/CalcField";

export default function MaintenanceCalculator() {
  const [annualKm, setAnnualKm] = useState(15000);
  const [chargePrice, setChargePrice] = useState(CALC_DEFAULTS.slowPrice);
  const [efficiency, setEfficiency] = useState(CALC_DEFAULTS.efficiency);
  const [insurance, setInsurance] = useState(CALC_DEFAULTS.insurancePerYear);
  const [tax, setTax] = useState(CALC_DEFAULTS.taxPerYear);

  const result = useMemo(
    () => calcMaintenance({ annualKm, chargePrice, efficiency, insurance, tax }),
    [annualKm, chargePrice, efficiency, insurance, tax]
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 space-y-4">
        <CalcField label="연간 주행거리" suffix="km" value={annualKm} onChange={(v) => setAnnualKm(v)} step={1000} />
        <CalcField label="충전 단가" suffix="원/kWh" value={chargePrice} onChange={(v) => setChargePrice(v)} step={10} />
        <CalcField label="전비" suffix="km/kWh" value={efficiency} onChange={(v) => setEfficiency(v)} step={0.1} />
        <CalcField label="연 보험료" suffix="원" value={insurance} onChange={(v) => setInsurance(v)} step={50000} />
        <CalcField label="연 자동차세" suffix="원" value={tax} onChange={(v) => setTax(v)} step={10000} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 md:p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">예상 유지비</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-slate-400">월 유지비</p>
            <p className="text-3xl font-black tracking-tight">{formatWon(result.monthly)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">연 유지비</p>
              <p className="mt-1 text-lg font-black">{formatWon(result.annual)}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">5년 유지비</p>
              <p className="mt-1 text-lg font-black">{formatWon(result.fiveYear)}</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-6 text-slate-300">
            이 중 연간 충전비는 약 <strong className="text-white">{formatWon(result.annualCharge)}</strong> 입니다.
            나머지는 보험료·자동차세 등 고정비입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
