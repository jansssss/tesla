"use client";

import { useState, useMemo } from "react";
import { calcChargerInstall, CALC_DEFAULTS } from "@/lib/calcExtra";
import { formatWon, formatNumber } from "@/lib/quoteCalculations";
import CalcField from "@/components/calc/CalcField";

/** 설치 유형별 설치비 프리셋 (가정값 — 실제 견적으로 조정해 사용) */
const PRESETS = [
  { id: "apartment-shared", label: "아파트 공용 완속", cost: 0, hint: "단지 공용 충전기 이용 — 개인 설치비 없음" },
  { id: "apartment-private", label: "아파트 개인 전용", cost: 1500000, hint: "전용 구획 + 개별 계량 설치 가정" },
  { id: "house-wall", label: "단독주택 월커넥터", cost: 2000000, hint: "전기 인입·배선 공사 포함 가정" },
];

export default function ChargerInstallCalculator() {
  const [installCost, setInstallCost] = useState(1500000);
  const [monthlyKm, setMonthlyKm] = useState(1250);
  const [efficiency, setEfficiency] = useState(CALC_DEFAULTS.efficiency);
  const [beforeSlowRatio, setBeforeSlowRatio] = useState(40);
  const [afterSlowRatio, setAfterSlowRatio] = useState(90);
  const [homePrice, setHomePrice] = useState(180);
  const [publicSlowPrice, setPublicSlowPrice] = useState(CALC_DEFAULTS.slowPrice);
  const [fastPrice, setFastPrice] = useState(CALC_DEFAULTS.fastPrice);

  const result = useMemo(
    () =>
      calcChargerInstall({
        installCost,
        monthlyKm,
        efficiency,
        beforeSlowRatio,
        afterSlowRatio,
        homePrice,
        publicSlowPrice,
        fastPrice,
      }),
    [
      installCost,
      monthlyKm,
      efficiency,
      beforeSlowRatio,
      afterSlowRatio,
      homePrice,
      publicSlowPrice,
      fastPrice,
    ]
  );

  const payback = result.paybackMonths;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 space-y-4">
        <div>
          <span className="text-sm font-semibold text-slate-700">설치 유형</span>
          <div className="mt-2 grid gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setInstallCost(p.cost)}
                className={`rounded-xl border px-3 py-2.5 text-left transition ${
                  Number(installCost) === p.cost
                    ? "border-blue-400 bg-white"
                    : "border-slate-200 bg-white/60 hover:border-slate-300"
                }`}
              >
                <span className="block text-sm font-bold text-slate-900">{p.label}</span>
                <span className="block text-xs text-slate-500">{p.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <CalcField
          label="설치비"
          suffix="원"
          value={installCost}
          onChange={(v) => setInstallCost(v)}
          step={100000}
          min={0}
        />
        <CalcField
          label="월 주행거리"
          suffix="km"
          value={monthlyKm}
          onChange={(v) => setMonthlyKm(v)}
          step={100}
        />
        <CalcField
          label="전비"
          suffix="km/kWh"
          value={efficiency}
          onChange={(v) => setEfficiency(v)}
          step={0.1}
        />

        <div className="grid grid-cols-2 gap-3">
          <CalcField
            label="설치 전 완속 비율"
            suffix="%"
            value={beforeSlowRatio}
            onChange={(v) => setBeforeSlowRatio(v)}
            step={5}
          />
          <CalcField
            label="설치 후 완속 비율"
            suffix="%"
            value={afterSlowRatio}
            onChange={(v) => setAfterSlowRatio(v)}
            step={5}
          />
        </div>
        <p className="text-xs leading-6 text-slate-500">
          나머지 비율은 급속 충전으로 계산합니다. 설치 후에도 장거리 이동 시 급속을 쓰므로 100%로
          잡지 않는 편이 현실적입니다.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <CalcField
            label="가정용 단가"
            suffix="원/kWh"
            value={homePrice}
            onChange={(v) => setHomePrice(v)}
            step={10}
          />
          <CalcField
            label="공용 완속 단가"
            suffix="원/kWh"
            value={publicSlowPrice}
            onChange={(v) => setPublicSlowPrice(v)}
            step={10}
          />
        </div>
        <CalcField
          label="급속 단가"
          suffix="원/kWh"
          value={fastPrice}
          onChange={(v) => setFastPrice(v)}
          step={10}
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 md:p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">설치 손익</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-slate-400">월 절감액</p>
            <p
              className={`text-3xl font-black tracking-tight ${
                result.monthlySaving > 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {result.monthlySaving > 0 ? "−" : "+"}
              {formatWon(Math.abs(result.monthlySaving))}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {result.monthlySaving > 0
                ? "설치 후 매달 이만큼 충전비가 줄어듭니다."
                : "현재 조건에서는 절감 효과가 없습니다. 완속 비율·단가를 확인해보세요."}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">설치비 회수 기간</p>
            {payback === null ? (
              <p className="mt-1 text-lg font-black text-slate-300">회수 불가</p>
            ) : payback === 0 ? (
              <p className="mt-1 text-lg font-black text-emerald-400">즉시 (설치비 없음)</p>
            ) : (
              <p className="mt-1 text-2xl font-black">
                약 {formatNumber(payback)}개월
                <span className="ml-2 text-sm font-semibold text-slate-400">
                  ({(payback / 12).toFixed(1)}년)
                </span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">설치 전 월 충전비</p>
              <p className="mt-1 text-base font-black">{formatWon(result.beforeMonthly)}</p>
              <p className="text-[11px] text-slate-500">
                단가 {formatNumber(result.beforePrice)}원/kWh
              </p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">설치 후 월 충전비</p>
              <p className="mt-1 text-base font-black">{formatWon(result.afterMonthly)}</p>
              <p className="text-[11px] text-slate-500">
                단가 {formatNumber(result.afterPrice)}원/kWh
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-6 text-slate-300">
            월 충전량 <strong className="text-white">{formatNumber(result.monthlyKwh)} kWh</strong>{" "}
            기준입니다. 5년(60개월) 기준 설치비를 제외한 순 절감액은{" "}
            <strong className={result.fiveYearSaving > 0 ? "text-emerald-400" : "text-red-400"}>
              {formatWon(result.fiveYearSaving)}
            </strong>{" "}
            입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
