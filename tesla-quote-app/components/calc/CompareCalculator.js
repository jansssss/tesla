"use client";

import { useState, useMemo } from "react";
import { TRIM_CATALOG } from "@/lib/regions";
import { monthlyPayment, formatWon } from "@/lib/quoteCalculations";
import { calcMaintenance, CALC_DEFAULTS } from "@/lib/calcExtra";
import CalcField from "@/components/calc/CalcField";

const M3_TRIMS = TRIM_CATALOG.filter((t) => t.modelId === "model3");
const MY_TRIMS = TRIM_CATALOG.filter((t) => t.modelId === "modely");

function TrimSelect({ label, trims, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400"
      >
        {trims.map((t) => (
          <option key={t.trimId} value={t.trimId}>
            {t.label} ({(t.price / 10000).toLocaleString()}만원)
          </option>
        ))}
      </select>
    </label>
  );
}

function buildResult(trim, subsidyManwon, financing, usage) {
  const estimatedPrice = Math.max(trim.price - (Number(subsidyManwon) || 0) * 10000, 0);
  const loanPrincipal = Math.max(estimatedPrice - (Number(financing.downPayment) || 0), 0);
  const monthly = Math.round(monthlyPayment(loanPrincipal, Number(financing.rate) || 0, Number(financing.months) || 0));
  const maint = calcMaintenance({
    annualKm: usage.annualKm,
    chargePrice: CALC_DEFAULTS.slowPrice,
    efficiency: usage.efficiency,
    insurance: CALC_DEFAULTS.insurancePerYear,
    tax: CALC_DEFAULTS.taxPerYear,
  });
  const fiveYearTotal = estimatedPrice + maint.fiveYear;
  return { estimatedPrice, monthly, annualMaintenance: maint.annual, fiveYearTotal };
}

function Row({ label, a, b, highlightLower }) {
  const aLower = a <= b;
  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr] items-center border-b border-slate-100 last:border-0">
      <div className="px-3 py-3 text-xs text-slate-500">{label}</div>
      <div className={`px-3 py-3 text-center text-sm font-bold ${highlightLower && aLower ? "text-emerald-600" : "text-slate-900"}`}>
        {formatWon(a)}
      </div>
      <div className={`px-3 py-3 text-center text-sm font-bold ${highlightLower && !aLower ? "text-emerald-600" : "text-slate-900"}`}>
        {formatWon(b)}
      </div>
    </div>
  );
}

export default function CompareCalculator() {
  const [m3, setM3] = useState("m3-rwd");
  const [my, setMy] = useState("my-rwd");
  const [m3Subsidy, setM3Subsidy] = useState(680);
  const [mySubsidy, setMySubsidy] = useState(700);
  const [downPayment, setDownPayment] = useState(10000000);
  const [rate, setRate] = useState(3.6);
  const [months, setMonths] = useState(60);
  const [annualKm, setAnnualKm] = useState(15000);

  const trim3 = M3_TRIMS.find((t) => t.trimId === m3) || M3_TRIMS[0];
  const trimY = MY_TRIMS.find((t) => t.trimId === my) || MY_TRIMS[0];

  const resA = useMemo(
    () => buildResult(trim3, m3Subsidy, { downPayment, rate, months }, { annualKm, efficiency: 6.0 }),
    [trim3, m3Subsidy, downPayment, rate, months, annualKm]
  );
  const resB = useMemo(
    () => buildResult(trimY, mySubsidy, { downPayment, rate, months }, { annualKm, efficiency: 5.0 }),
    [trimY, mySubsidy, downPayment, rate, months, annualKm]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
          <TrimSelect label="Model 3 트림" trims={M3_TRIMS} value={m3} onChange={setM3} />
          <CalcField label="Model 3 보조금" suffix="만원" value={m3Subsidy} onChange={(v) => setM3Subsidy(v)} step={10} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
          <TrimSelect label="Model Y 트림" trims={MY_TRIMS} value={my} onChange={setMy} />
          <CalcField label="Model Y 보조금" suffix="만원" value={mySubsidy} onChange={(v) => setMySubsidy(v)} step={10} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 grid gap-3 sm:grid-cols-4">
        <CalcField label="선수금" suffix="원" value={downPayment} onChange={(v) => setDownPayment(v)} step={1000000} />
        <CalcField label="금리" suffix="%" value={rate} onChange={(v) => setRate(v)} step={0.1} />
        <CalcField label="할부" suffix="개월" value={months} onChange={(v) => setMonths(v)} step={6} />
        <CalcField label="연 주행" suffix="km" value={annualKm} onChange={(v) => setAnnualKm(v)} step={1000} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-slate-950 text-white">
          <div className="px-3 py-3 text-xs font-bold uppercase tracking-[0.1em]">항목</div>
          <div className="px-3 py-3 text-center text-sm font-black">{trim3.label}</div>
          <div className="px-3 py-3 text-center text-sm font-black">{trimY.label}</div>
        </div>
        <Row label="실구매가" a={resA.estimatedPrice} b={resB.estimatedPrice} highlightLower />
        <Row label="월 납입금" a={resA.monthly} b={resB.monthly} highlightLower />
        <Row label="연 유지비" a={resA.annualMaintenance} b={resB.annualMaintenance} highlightLower />
        <Row label="5년 총비용" a={resA.fiveYearTotal} b={resB.fiveYearTotal} highlightLower />
      </div>
      <p className="text-xs leading-6 text-slate-500">
        초록색은 더 낮은 값(유리)을 의미합니다. 보조금은 지역에 따라 달라지므로 정확한 지역별 보조금은{" "}
        <a href="/" className="text-blue-600 hover:underline">실구매가·월납입금 계산기</a>에서 확인하세요.
        유지비는 전비(Model 3 6.0 · Model Y 5.0 km/kWh)와 기본 보험료·세금 가정값으로 계산됩니다.
      </p>
    </div>
  );
}
