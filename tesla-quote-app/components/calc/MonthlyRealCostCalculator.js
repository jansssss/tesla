'use client'

import { useState } from "react";
import Link from "next/link";
import { CALC_DEFAULTS, calcCharging } from "@/lib/calcExtra";

function monthlyPayment(principal, annualRatePct, months) {
  if (months <= 0 || principal <= 0) return 0;
  if (annualRatePct === 0) return principal / months;
  const r = annualRatePct / 100 / 12;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function safeNum(val) {
  const n = Number(val);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function fmt(n) {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toLocaleString("ko-KR");
}

const DEFAULT = {
  price: 49990000,
  subsidy: 0,
  down: 10000000,
  months: 60,
  rate: 4.9,
  monthlyKm: 1250,
  fastRatio: 20,
  slowRatio: 80,
  fastPrice: CALC_DEFAULTS.fastPrice,
  slowPrice: CALC_DEFAULTS.slowPrice,
  efficiency: CALC_DEFAULTS.efficiency,
  insurancePerYear: CALC_DEFAULTS.insurancePerYear,
  taxPerYear: CALC_DEFAULTS.taxPerYear,
};

function Field({ label, value, onChange, suffix, min, step = "1", note }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(safeNum(e.target.value))}
        />
        {suffix && <span className="shrink-0 text-xs text-slate-400">{suffix}</span>}
      </div>
      {note && <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{note}</p>}
    </div>
  );
}

export default function MonthlyRealCostCalculator({ dataDate }) {
  const [v, setV] = useState(DEFAULT);
  const set = (k) => (val) => setV((prev) => ({ ...prev, [k]: val }));

  const principal = Math.max(0, v.price - v.subsidy - v.down);
  const loanMonthly = monthlyPayment(principal, v.rate, v.months);
  const { monthly: chargingMonthly } = calcCharging({
    monthlyKm: v.monthlyKm,
    efficiency: v.efficiency,
    fastRatio: v.fastRatio / 100,
    slowRatio: v.slowRatio / 100,
    fastPrice: v.fastPrice,
    slowPrice: v.slowPrice,
  });
  const insuranceMonthly = v.insurancePerYear / 12;
  const taxMonthly = v.taxPerYear / 12;
  const totalMonthly = loanMonthly + chargingMonthly + insuranceMonthly + taxMonthly;

  return (
    <div className="rounded-[28px] bg-white shadow-[0_4px_40px_rgba(15,23,42,0.10)] border border-slate-100 p-6 md:p-8 space-y-6">

      {/* 차량·금융 */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">차량 · 금융</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="출고가 (원)" value={v.price} onChange={set("price")} suffix="원" min={0} step="100000"
            note="테슬라 공식 홈페이지 기준. 변동될 수 있습니다." />
          <Field label="보조금 (원)" value={v.subsidy} onChange={set("subsidy")} suffix="원" min={0} step="100000"
            note="지역별 보조금은 홈 계산기에서 확인하세요." />
          <Field label="선수금 (원)" value={v.down} onChange={set("down")} suffix="원" min={0} step="500000" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">할부 기간</label>
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={v.months}
              onChange={(e) => set("months")(Number(e.target.value))}
            >
              {[24, 36, 48, 60, 72].map((m) => <option key={m} value={m}>{m}개월</option>)}
            </select>
          </div>
          <Field label="할부 금리 (%)" value={v.rate} onChange={set("rate")} suffix="%" min={0} step="0.1"
            note="정확한 금리는 금융사·딜러에서 확인하세요." />
        </div>
      </div>

      {/* 충전 패턴 */}
      <div className="border-t border-slate-100 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">충전 패턴</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="월 주행거리 (km)" value={v.monthlyKm} onChange={set("monthlyKm")} suffix="km" min={0} />
          <Field label="전비 (km/kWh)" value={v.efficiency} onChange={set("efficiency")} suffix="km/kWh" min={1} step="0.1" />
          <Field label="완속 충전 비율 (%)" value={v.slowRatio} onChange={(val) => { set("slowRatio")(val); set("fastRatio")(100 - val); }} suffix="%" min={0} max={100} />
          <Field label="급속 충전 비율 (%)" value={v.fastRatio} onChange={(val) => { set("fastRatio")(val); set("slowRatio")(100 - val); }} suffix="%" min={0} max={100} />
          <Field label="완속 단가 (원/kWh)" value={v.slowPrice} onChange={set("slowPrice")} suffix="원" min={0} />
          <Field label="급속 단가 (원/kWh)" value={v.fastPrice} onChange={set("fastPrice")} suffix="원" min={0} />
        </div>
      </div>

      {/* 연간 고정비 */}
      <div className="border-t border-slate-100 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">연간 고정비</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="연 보험료 (원)" value={v.insurancePerYear} onChange={set("insurancePerYear")} suffix="원" min={0} step="100000"
            note="실제 보험료는 보험사에서 확인하세요." />
          <Field label="연 자동차세 (원)" value={v.taxPerYear} onChange={set("taxPerYear")} suffix="원" min={0} step="10000" />
        </div>
      </div>

      {/* 결과 */}
      <div className="border-t border-slate-100 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">월 부담금 분석</p>
        <div className="space-y-1">
          {[
            { label: "월 할부금", value: loanMonthly },
            { label: "월 충전비", value: chargingMonthly },
            { label: "월 보험료 (연 ÷ 12)", value: insuranceMonthly },
            { label: "월 자동차세 (연 ÷ 12)", value: taxMonthly },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-semibold text-slate-700">{fmt(value)}원</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <span className="text-base font-black text-slate-900">월 실제 부담 합계</span>
            <span className="text-2xl font-black text-blue-600">{fmt(totalMonthly)}원</span>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 space-y-1.5">
          <p className="text-xs text-slate-500 leading-relaxed">
            대출원금 <strong>{fmt(principal)}원</strong> ({fmt(v.price)}원 − {fmt(v.subsidy)}원 보조금 − {fmt(v.down)}원 선수금).
            보조금은 지역에 따라 다릅니다 — <Link href="/" className="text-blue-600 underline">홈 계산기</Link>에서 지역 선택 후 확인하세요.
          </p>
          {dataDate && (
            <p className="text-[11px] text-slate-400">데이터 기준일: {dataDate}. 결과는 참고용이며 실제 조건은 딜러·금융사에서 확인하세요.</p>
          )}
        </div>
      </div>

      {/* 관련 링크 */}
      <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2">
        <Link href="/calc/maintenance" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 transition-colors">유지비 계산기</Link>
        <Link href="/calc/tco" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 transition-colors">TCO 계산기</Link>
        <Link href="/calc/switch-to-tesla" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 transition-colors">전환 비교 계산기</Link>
      </div>
    </div>
  );
}
