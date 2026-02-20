import Link from "next/link";

export default function RegionPresetButtons({ presets, metro }) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold mb-1.5">
        {metro.shortName} 맞춤 계산 바로가기
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        버튼을 클릭하면 {metro.name} 보조금이 자동 적용된 계산기로 이동합니다.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {presets.map((preset, i) => (
          <Link
            key={i}
            href={preset.url}
            className="group block bg-gray-900 hover:bg-gray-800 text-white rounded-2xl p-4 md:p-5 transition-colors border border-gray-800 hover:border-gray-600"
          >
            <span className="block font-semibold text-sm md:text-base mb-1">
              {preset.label}
            </span>
            <span className="block text-xs text-gray-400 mb-3">
              {preset.sublabel}
            </span>
            <span className="block text-xs text-red-400 font-semibold group-hover:text-red-300 transition-colors">
              계산기 열기 →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
