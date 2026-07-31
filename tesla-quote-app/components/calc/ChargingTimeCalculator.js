"use client";

import { useState, useMemo } from "react";
import { calcChargingTime } from "@/lib/calcExtra";
import { formatNumber } from "@/lib/quoteCalculations";
import CalcField from "@/components/calc/CalcField";

/**
 * 충전기 출력 프리셋.
 * 차량 사양이 아니라 충전기 등급이므로 일반적으로 통용되는 구간을 제시한다.
 * 실제 출력은 충전기 모델·차량 수용 능력·배터리 온도에 따라 더 낮을 수 있다.
 */
const CHARGER_PRESETS = [
  { id: "home", label: "가정용 완속", kw: 7, hint: "밤새 충전용 (3~7kW)" },
  { id: "public-slow", label: "공용 완속", kw: 7, hint: "아파트·직장 완속기" },
  { id: "fast-50", label: "공공 급속 50kW", kw: 50, hint: "일반적인 공공 급속" },
  { id: "fast-100", label: "공공 급속 100kW", kw: 100, hint: "고출력 급속기" },
  { id: "supercharger", label: "슈퍼차저", kw: 250, hint: "최대 출력 기준 (실제는 낮을 수 있음)" },
];

export default function ChargingTimeCalculator() {
  const [batteryKwh, setBatteryKwh] = useState(60);
  const [startSoc, setStartSoc] = useState(20);
  const [targetSoc, setTargetSoc] = useState(80);
  const [powerKw, setPowerKw] = useState(50);
  const [efficiency, setEfficiency] = useState(90);
  const [rangeKm, setRangeKm] = useState(400);

  const result = useMemo(
    () => calcChargingTime({ batteryKwh, startSoc, targetSoc, powerKw, efficiency, rangeKm }),
    [batteryKwh, startSoc, targetSoc, powerKw, efficiency, rangeKm]
  );

  const overEighty = Number(targetSoc) > 80;
  const invalidRange = Number(targetSoc) <= Number(startSoc);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 space-y-4">
        <div>
          <span className="text-sm font-semibold text-slate-700">충전기 종류</span>
          <div className="mt-2 grid gap-2">
            {CHARGER_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPowerKw(p.kw)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                  Number(powerKw) === p.kw
                    ? "border-blue-400 bg-white"
                    : "border-slate-200 bg-white/60 hover:border-slate-300"
                }`}
              >
                <span>
                  <span className="block text-sm font-bold text-slate-900">{p.label}</span>
                  <span className="block text-xs text-slate-500">{p.hint}</span>
                </span>
                <span className="shrink-0 text-sm font-black text-blue-700">{p.kw}kW</span>
              </button>
            ))}
          </div>
        </div>

        <CalcField
          label="충전기 출력"
          suffix="kW"
          value={powerKw}
          onChange={(v) => setPowerKw(v)}
          step={1}
          min={1}
        />
        <CalcField
          label="배터리 용량"
          suffix="kWh"
          value={batteryKwh}
          onChange={(v) => setBatteryKwh(v)}
          step={1}
          min={1}
        />
        <p className="text-xs leading-6 text-slate-500">
          배터리 용량은 트림에 따라 다릅니다. 정확한 값은 테슬라 공식 사양을 확인해 입력하세요.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <CalcField
            label="현재 충전율"
            suffix="%"
            value={startSoc}
            onChange={(v) => setStartSoc(v)}
            step={5}
            min={0}
          />
          <CalcField
            label="목표 충전율"
            suffix="%"
            value={targetSoc}
            onChange={(v) => setTargetSoc(v)}
            step={5}
            min={0}
          />
        </div>
        {invalidRange ? (
          <p className="text-xs text-amber-600">
            목표 충전율이 현재 충전율보다 높아야 계산됩니다.
          </p>
        ) : null}

        <CalcField
          label="인증 주행거리"
          suffix="km"
          value={rangeKm}
          onChange={(v) => setRangeKm(v)}
          step={10}
        />
        <CalcField
          label="충전 효율"
          suffix="%"
          value={efficiency}
          onChange={(v) => setEfficiency(v)}
          step={1}
          min={1}
        />
        <p className="text-xs leading-6 text-slate-500">
          충전 효율은 충전기에서 나온 전력 중 배터리에 실제로 담기는 비율입니다. 손실을 감안해
          85~95% 범위로 잡는 것이 일반적입니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 md:p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">예상 충전 시간</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-slate-400">
              {formatNumber(startSoc)}% → {formatNumber(targetSoc)}%
            </p>
            <p className="text-3xl font-black tracking-tight">
              {result.hours > 0 ? `${result.hours}시간 ` : ""}
              {result.minutes}분
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">필요 전력량</p>
              <p className="mt-1 text-lg font-black">{result.neededKwh} kWh</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs text-slate-400">늘어나는 주행거리</p>
              <p className="mt-1 text-lg font-black">
                {result.addedKm !== null ? `약 ${formatNumber(result.addedKm)}km` : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-6 text-amber-100">
            <strong className="block text-amber-200">이 값은 평균 출력 기준 추정치입니다</strong>
            실제 충전은 일정한 속도로 진행되지 않습니다. 배터리 잔량이 낮을 때 가장 빠르고,
            충전율이 올라갈수록 출력이 단계적으로 낮아집니다. 특히 80%를 넘어가면 속도가 크게
            떨어져 실제 소요 시간이 계산값보다 길어집니다.
          </div>

          {overEighty ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-6 text-slate-300">
              목표를 80% 이상으로 잡으셨습니다. 급속 충전에서는 80~100% 구간에 80% 구간까지
              걸린 시간만큼이 더 드는 경우도 있습니다. 장거리 이동 중이라면 80%에서 끊고 다음
              충전소로 이동하는 편이 전체 소요 시간이 짧은 경우가 많습니다.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
