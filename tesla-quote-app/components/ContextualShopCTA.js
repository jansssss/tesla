/**
 * ContextualShopCTA
 *
 * blogger의 _pick_products + _build_cta_section 패턴을 Tesla에 적용.
 * 페이지 컨텍스트 키워드(keywords)와 가장 많이 겹치는 상품 2개를 자동 선택해
 * 직접 구매 카드로 노출합니다.
 *
 * Usage:
 *   <ContextualShopCTA keywords={["충전", "전자기기"]} />
 *   <ContextualShopCTA keywords={["차종·트림", "AWD", "RWD"]} />
 */
import Link from "next/link";
import { SHOP_PRODUCTS, COUPANG_PARTNERS_NOTICE } from "@/data/shop-products";

/** keywords 배열과 가장 많이 겹치는 상품 최대 2개 반환. 매칭 0이면 rank 1·2 기본. */
function pickProducts(keywords) {
  const kSet = new Set(keywords.map((k) => k.toLowerCase()));
  const scored = SHOP_PRODUCTS.map((p) => {
    const overlap = [...p.keywords].filter((k) => kSet.has(k.toLowerCase())).length;
    return { product: p, score: overlap };
  });
  scored.sort((a, b) => b.score - a.score || a.product.rank - b.product.rank);
  const top = scored.slice(0, 2).filter((x) => x.score > 0).map((x) => x.product);
  return top.length > 0 ? top : SHOP_PRODUCTS.slice(0, 2);
}

export default function ContextualShopCTA({ keywords = [] }) {
  const products = pickProducts(keywords);

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

      {/* 전체보기 + 고지문 */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
        >
          베스트 8개 전체 보기
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
        <p className="text-[11px] leading-5 text-slate-400">
          ※ {COUPANG_PARTNERS_NOTICE}
        </p>
      </div>
    </section>
  );
}
