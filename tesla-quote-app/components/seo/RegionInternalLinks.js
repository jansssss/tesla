import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";

export default function RegionInternalLinks({ currentSlug }) {
  const otherRegions = METRO_REGIONS.filter((r) => r.slug !== currentSlug);

  return (
    <section className="border-t border-gray-100 pt-8">
      {/* 다른 지역 */}
      <h2 className="text-base font-bold mb-3 text-gray-700">다른 지역 보조금 보기</h2>
      <div className="flex flex-wrap gap-2 mb-7">
        {otherRegions.map((r) => (
          <Link
            key={r.slug}
            href={`/subsidy/${r.slug}`}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors"
          >
            {r.shortName}
          </Link>
        ))}
      </div>

      {/* 모델 페이지 */}
      <h2 className="text-base font-bold mb-3 text-gray-700">모델별 상세 정보</h2>
      <div className="flex flex-wrap gap-2 mb-7">
        <Link
          href="/models/model-3"
          className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-medium transition-colors"
        >
          Model 3 상세
        </Link>
        <Link
          href="/models/model-y"
          className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-medium transition-colors"
        >
          Model Y 상세
        </Link>
      </div>

      {/* 비교 페이지 */}
      <h2 className="text-base font-bold mb-3 text-gray-700">모델 비교</h2>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/compare/model-3-vs-model-y"
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors"
        >
          Model 3 vs Model Y
        </Link>
        <Link
          href="/compare/rwd-vs-awd"
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors"
        >
          RWD vs AWD(사륜) 비교
        </Link>
      </div>
    </section>
  );
}
