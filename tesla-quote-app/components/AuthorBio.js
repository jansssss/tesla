import Link from "next/link";

/**
 * AuthorBio — 운영자(jans) 저자 박스
 *
 * 가이드/경험담 하단에 노출해 저자 정체성(E-E-A-T)을 드러냅니다.
 * 실명 대신 일관된 필명 "jans"로 콘텐츠 작성·검수 주체를 표기합니다.
 */
export default function AuthorBio() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-black text-white">
          js
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">
            jans
            <span className="ml-1.5 text-xs font-medium text-slate-400">· 하우머치 테슬라 운영자</span>
          </p>
          <p className="mt-1.5 text-xs leading-6 text-slate-600 md:text-sm">
            전기차를 직접 구매한 평범한 직장인입니다. 복잡한 보조금·실구매가 계산을 누구나
            쉽게 확인할 수 있도록 공고 데이터를 모아 계산기를 만들고, 직접 겪은 내용을 정리합니다.
          </p>
          <Link
            href="/about"
            className="mt-2 inline-block text-xs font-semibold text-blue-600 transition hover:text-blue-700"
          >
            운영자 소개 →
          </Link>
        </div>
      </div>
    </section>
  );
}
