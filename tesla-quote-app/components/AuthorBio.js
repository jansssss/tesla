import Link from "next/link";

/**
 * AuthorBio — 운영자(jans) 저자 박스
 *
 * 가이드/경험담 하단에 노출해 저자 정체성(E-E-A-T)을 드러냅니다.
 * 실명 대신 일관된 필명 "jans"로 콘텐츠 작성·검수 주체를 표기합니다.
 */
export default function AuthorBio({ reviewedAt, sourceCount = 0 }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-black text-white">
          js
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">
            jans
            <span className="ml-1.5 text-xs font-medium text-slate-400">· 작성·최종 검수</span>
          </p>
          <p className="mt-1.5 text-xs leading-6 text-slate-600 md:text-sm">
            전기차 구매 과정에서 확인한 공고와 비용 항목을 바탕으로 계산기를 만든 운영자입니다.
            AI는 검색 질문 분류와 초안 구조화에만 보조적으로 사용하고, 공개 전 공식 출처·수치·조건·내부 링크는 운영자가 직접 대조합니다.
          </p>
          {reviewedAt || sourceCount > 0 ? (
            <p className="mt-2 text-[11px] font-medium text-slate-500">
              {reviewedAt ? `최종 검수 ${reviewedAt}` : ""}
              {reviewedAt && sourceCount > 0 ? " · " : ""}
              {sourceCount > 0 ? `공식·공공 출처 ${sourceCount}개 대조` : ""}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
            <Link href="/about" className="text-blue-600 transition hover:text-blue-700">
              운영자 소개 →
            </Link>
            <Link href="/editorial-policy" className="text-blue-600 transition hover:text-blue-700">
              작성·검수 기준 →
            </Link>
            <Link href="/data-sources" className="text-blue-600 transition hover:text-blue-700">
              계산 데이터 출처 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
