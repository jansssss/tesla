'use client'

import { useState } from "react";
import Link from "next/link";
import { CALC_DEFAULTS } from "@/lib/calcExtra";

function monthlyPayment(principal, annualRatePct, months) {
  if (months <= 0 || principal <= 0) return 0;
  if (annualRatePct === 0) return principal / months;
  const r = annualRatePct / 100 / 12;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function fmt(n) {
  return Math.round(n).toLocaleString("ko-KR");
}

const ICE_DEFAULT = {
  fuelEfficiency: CALC_DEFAULTS.ice.fuelEfficiency,
  fuelPrice: CALC_DEFAULTS.ice.fuelPrice,
  monthlyKm: 1250,
  maintenancePerMonth: Math.round(CALC_DEFAULTS.ice.maintenancePerYear / 12),
  insurancePerMonth: 100000,
  taxPerMonth: Math.round(300000 / 12),
};

const EV_DEFAULT = {
  price: 49990000,
  subsidy: 7000000,
  down: 10000000,
  months: 60,
  rate: 4.9,
  efficiency: CALC_DEFAULTS.efficiency,
  slowPrice: CALC_DEFAULTS.slowPrice,
  fastPrice: CALC_DEFAULTS.fastPrice,
  slowRatio: 80,
  insurancePerMonth: 110000,
  taxPerMonth: Math.round(130000 / 12),
  maintenancePerMonth: 20000,
};

function Field({ label, value, onChange, suffix, min = 0, step = "1", note }) {
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
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && <span className="shrink-0 text-xs text-slate-400">{suffix}</span>}
      </div>
      {note && <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{note}</p>}
    </div>
  );
}

export default function SwitchToTeslaCalculator({ dataDate }) {
  const [ice, setIce] = useState(ICE_DEFAULT);
  const [ev, setEv] = useState(EV_DEFAULT);
  const setI = (k) => (val) => setIce((p) => ({ ...p, [k]: val }));
  const setE = (k) => (val) => setEv((p) => ({ ...p, [k]: val }));

  // ICE monthly total
  const iceFuelMonthly = (ice.monthlyKm / ice.fuelEfficiency) * ice.fuelPrice;
  const iceTotal = iceFuelMonthly + ice.maintenancePerMonth + ice.insurancePerMonth + ice.taxPerMonth;

  // EV monthly total
  const principal = Math.max(0, ev.price - ev.subsidy - ev.down);
  const loanMonthly = monthlyPayment(principal, ev.rate, ev.months);
  const fastRatio = (100 - ev.slowRatio) / 100;
  const slowRatio = ev.slowRatio / 100;
  const evChargingMonthly = (ice.monthlyKm / ev.efficiency) * (fastRatio * ev.fastPrice + slowRatio * ev.slowPrice);
  const evTotal = loanMonthly + evChargingMonthly + ev.maintenancePerMonth + ev.insurancePerMonth + ev.taxPerMonth;

  const monthlySaving = iceTotal - evTotal;
  const extraInitial = ev.down;
  const breakEvenMonths = monthlySaving > 0 ? Math.ceil(extraInitial / monthlySaving) : null;

  const isPositive = monthlySaving > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* 현재 차량 */}
        <div className="rounded-[28px] bg-white shadow-[0_4px_32px_rgba(15,23,42,0.09)] border border-slate-100 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">현재 차량 (내연기관)</p>
          <div className="space-y-3">
            <Field label="월 주행거리 (km)" value={ice.monthlyKm} onChange={setI("monthlyKm")} suffix="km" />
            <Field label="연비 (km/L)" value={ice.fuelEfficiency} onChange={setI("fuelEfficiency")} suffix="km/L" min={1} step="0.1" />
            <Field label="연료 단가 (원/L)" value={ice.fuelPrice} onChange={setI("fuelPrice")} suffix="원" />
            <Field label="월 점검·소모품비" value={ice.maintenancePerMonth} onChange={setI("maintenancePerMonth")} suffix="원" step="5000" note="오일 교환, 소모품 등 월 평균 비용" />
            <Field label="월 보험료" value={ice.insurancePerMonth} onChange={setI("insurancePerMonth")} suffix="원" step="10000" />
            <Field label="월 자동차세" value={ice.taxPerMonth} onChange={setI("taxPerMonth")} suffix="원" step="5000" />
          </div>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500">월 연료비</span>
              <span className="text-xs font-semibold">{fmt(iceFuelMonthly)}원</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-sm font-black text-slate-800">월 합계</span>
              <span className="text-xl font-black text-slate-800">{fmt(iceTotal)}원</span>
            </div>
          </div>
        </div>

        {/* 테슬라 */}
        <div className="rounded-[28px] bg-white shadow-[0_4px_32px_rgba(15,23,42,0.09)] border border-blue-100 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-4">테슬라 전환 후</p>
          <div className="space-y-3">
            <Field label="출고가 (원)" value={ev.price} onChange={setE("price")} suffix="원" step="100000" note="변동 가능. 공식 홈페이지에서 확인하세요." />
            <Field label="보조금 (원)" value={ev.subsidy} onChange={setE("subsidy")} suffix="원" step="100000" note="홈 계산기에서 지역 선택 후 확인하세요." />
            <Field label="선수금 (원)" value={ev.down} onChange={setE("down")} suffix="원" step="500000" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">할부 기간</label>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={ev.months} onChange={(e) => setE("months")(Number(e.target.value))}>
                {[24, 36, 48, 60, 72].map((m) => <option key={m} value={m}>{m}개월</option>)}
              </select>
            </div>
            <Field label="할부 금리 (%)" value={ev.rate} onChange={setE("rate")} suffix="%" min={0} step="0.1" />
            <Field label="전비 (km/kWh)" value={ev.efficiency} onChange={setE("efficiency")} suffix="km/kWh" min={1} step="0.1" />
            <Field label="완속 충전 비율 (%)" value={ev.slowRatio} onChange={(val) => setE("slowRatio")(Math.min(100, Math.max(0, val)))} suffix="%" />
            <Field label="완속 단가 (원/kWh)" value={ev.slowPrice} onChange={setE("slowPrice")} suffix="원" />
            <Field label="급속 단가 (원/kWh)" value={ev.fastPrice} onChange={setE("fastPrice")} suffix="원" />
            <Field label="월 보험료" value={ev.insurancePerMonth} onChange={setE("insurancePerMonth")} suffix="원" step="10000" />
            <Field label="월 자동차세" value={ev.taxPerMonth} onChange={setE("taxPerMonth")} suffix="원" step="5000" />
            <Field label="월 점검·소모품비" value={ev.maintenancePerMonth} onChange={setE("maintenancePerMonth")} suffix="원" step="5000" note="전기차는 오일 교환 불필요, 타이어 위주" />
          </div>
          <div className="mt-5 rounded-2xl bg-blue-50 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500">월 충전비</span>
              <span className="text-xs font-semibold">{fmt(evChargingMonthly)}원</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500">월 할부금</span>
              <span className="text-xs font-semibold">{fmt(loanMonthly)}원</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <span className="text-sm font-black text-blue-800">월 합계</span>
              <span className="text-xl font-black text-blue-600">{fmt(evTotal)}원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 비교 결과 */}
      <div className={`rounded-[28px] p-6 md:p-8 ${isPositive ? "bg-[linear-gradient(135deg,#0f172a,#1e3a8a)]" : "bg-slate-800"} text-white`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 mb-4">전환 효과 요약</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-blue-200 mb-1">월 {isPositive ? "절감액" : "추가 부담"}</p>
            <p className={`text-2xl font-black ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? "−" : "+"}{fmt(Math.abs(monthlySaving))}원
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-blue-200 mb-1">연간 {isPositive ? "절감액" : "추가 부담"}</p>
            <p className={`text-2xl font-black ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? "−" : "+"}{fmt(Math.abs(monthlySaving) * 12)}원
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-blue-200 mb-1">선수금 회수 기간</p>
            <p className="text-2xl font-black text-white">
              {breakEvenMonths && breakEvenMonths > 0
                ? `${breakEvenMonths}개월`
                : isPositive ? "즉시" : "—"}
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-blue-200/70">
          * 선수금 {fmt(ev.down)}원 기준. 보조금·금리는 변동될 수 있습니다.
          {dataDate && ` 데이터 기준일: ${dataDate}.`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 transition-colors">홈 계산기 (지역 보조금)</Link>
        <Link href="/calc/tco" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 transition-colors">TCO 계산기</Link>
        <Link href="/guides/tesla-ev-maintenance-cost" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 transition-colors">유지비 가이드</Link>
      </div>
    </div>
  );
}
