"use client";

/** 계산기 공용 숫자 입력 필드 */
export default function CalcField({ label, suffix, value, onChange, step = 1, min }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-blue-400">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-right text-base font-semibold text-slate-900 outline-none"
        />
        {suffix ? <span className="pr-3 text-sm text-slate-400">{suffix}</span> : null}
      </div>
    </label>
  );
}
