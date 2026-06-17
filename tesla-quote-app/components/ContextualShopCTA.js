/**
 * ContextualShopCTA
 *
 * 글 "본문" 맥락에 맞는 상품을 추천하는 쿠팡 파트너스 CTA.
 * text(본문 전체)에서 상품 트리거 키워드를 찾아 가장 잘 맞는 2개를 노출하고,
 * 본문 매칭이 부족하면 베스트 랭킹으로 폴백합니다.
 *
 * Usage:
 *   <ContextualShopCTA text={본문문자열} />            // 가이드 상세 (권장)
 *   <ContextualShopCTA keywords={["충전", "전자기기"]} /> // 본문이 없는 페이지(비교/지역)
 */
import { COUPANG_PARTNERS_NOTICE, pickProductsByText } from "@/data/shop-products";

export default function ContextualShopCTA({ keywords = [], text = "" }) {
  // 본문(text) 우선, 없으면 keywords 모음을 매칭 대상 텍스트로 사용
  const haystack = [text, ...(Array.isArray(keywords) ? keywords : [])].join(" ");
  const products = pickProductsByText(haystack);

  return (
    <section className="rounded-[32px] bg-[linear-gradient(135deg,#eef2ff_0%,#fdf4ff_100%)] border border-slate-200 p-6 md:p-8">
      {/* 헤더 */}
      <div className="mb-5">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
          추천 액세서리
        </span>
        <h2 className="mt-3 text-lg font-black tracking-tight text-slate-950 md:text-xl">
          이 글과 함께 챙기면 좋은 액세서리
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          실제 테슬라 오너들이 가장 많이 구매한 아이템
        </p>
      </div>

      {/* 상품 카드 2개 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-2xl border border-white bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.08)]"
          >
            {/* 배지 + 이모지 */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                추천 {p.rank}위
              </span>
              <span className="text-xl">{p.emoji}</span>
            </div>
            {/* 상품명 */}
            <p className="mb-1.5 text-sm font-black leading-snug text-slate-950 md:text-base">
              {p.name}
            </p>
            {/* 설명 */}
            <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-500">
              {p.description}
            </p>
            {/* 가격 + 버튼 */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-slate-700">₩{p.price}~</span>
              <a
                href={p.affiliate}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                쿠팡에서 보기
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 고지문 */}
      <div className="mt-4">
        <p className="text-[11px] leading-5 text-slate-400">
          ※ {COUPANG_PARTNERS_NOTICE}
        </p>
      </div>
    </section>
  );
}
