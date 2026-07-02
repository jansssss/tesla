import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";

export default function RegionInternalLinks({ currentSlug }) {
  // 색인 유지 대상(광역시/특별시, si)만 노출 — noindex 처리된 '도(do)' 페이지로의 내부링크 제외
  const otherRegions = METRO_REGIONS.filter(
    (r) => r.slug !== currentSlug && r.type === "si"
  );

  return (
    <section className="border-t border-gray-100 pt-8">
      {/* 전용 계산기 */}
      <h2 className="text-base font-bold mb-3 text-gray-700">테슬라 보조금 계산기</h2>
      <div className="mb-7">
        <Link
          href="/calc/tesla-subsidy"
          className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
        >
          테슬라 보조금 계산기로 실구매가 계산하기 →
        </Link>
      </div>

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
