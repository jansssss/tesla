import Link from "next/link";

export default function RegionPresetButtons({ presets, metro }) {
  return (
    <section>
      <div className="mb-4">
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          맞춤 계산
        </span>
      </div>
      <h2 className="text-lg md:text-xl font-black mb-1.5">
        {metro.shortName} 맞춤 계산 바로가기
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        버튼을 클릭하면 {metro.name} 보조금이 자동 적용된 계산기로 이동합니다.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {presets.map((preset, i) => (
          <Link
            key={i}
            href={preset.url}
            className="group block bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] hover:bg-none hover:bg-slate-900 text-white rounded-[24px] p-5 md:p-6 transition-all border border-blue-900/50 hover:border-blue-700/50 hover:shadow-[0_8px_32px_rgba(29,78,216,0.2)]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-blue-200 mb-3">
              {i + 1}
            </span>
            <span className="block font-bold text-sm md:text-base mb-1">
              {preset.label}
            </span>
            <span className="block text-xs text-blue-200/70 mb-4">
              {preset.sublabel}
            </span>
            <span className="block text-xs text-blue-300 font-semibold group-hover:text-white transition-colors">
              계산기 열기 →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
