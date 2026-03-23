import Link from "next/link";
import { SHOP_PRODUCTS, COUPANG_PARTNERS_NOTICE } from "@/data/shop-products";

/**
 * ShopBanner
 * 가이드 하단 / 계산기 결과 후에 재사용 가능한 테슬라 액세서리 CTA 배너
 *
 * variant:
 *   "inline"  — 미니 카드 4개 + 더보기 버튼 (기본, 가이드 하단용)
 *   "compact" — 텍스트+버튼 한 줄 (계산기 결과 후용, 공간 적을 때)
 */
export default function ShopBanner({ variant = "inline" }) {
  const top4 = SHOP_PRODUCTS.slice(0, 4);

  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <div>
              <p className="text-sm font-black text-slate-950">테슬라 꾸미기 구매 베스트</p>
              <p className="text-xs text-slate-500">커뮤니티 검증 TOP 8 액세서리 모음</p>
            </div>
          </div>
          <Link
            href="/shop"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            보러가기
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <p className="text-[11px] text-slate-400 leading-5">{COUPANG_PARTNERS_NOTICE}</p>
      </div>
    );
  }

  // variant === "inline" (기본)
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-8">
      {/* 헤더 */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
            커뮤니티 검증
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            테슬라 꾸미기 구매 베스트
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            실제 오너들이 가장 많이 구매한 액세서리 TOP 8
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700 shrink-0"
        >
          전체 보기
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* 미니 제품 카드 4개 */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {top4.map((product) => (
          <a
            key={product.id}
            href={product.affiliate}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group relative flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            {/* 랭크 배지 */}
            <span
              className={`absolute -top-2 -left-1 inline-flex w-6 h-6 items-center justify-center rounded-full text-[10px] font-black shadow-sm ${product.badgeColor}`}
            >
              {product.rank}
            </span>

            <span className="text-2xl">{product.emoji}</span>
            <p className="text-sm font-black leading-snug text-slate-950 transition group-hover:text-blue-700">
              {product.name}
            </p>
            <p className="text-xs font-bold text-slate-400">₩ {product.price} ~</p>
          </a>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <div className="mt-5 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          베스트 8개 전체 보기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* 쿠팡 파트너스 고지 */}
      <p className="mt-4 text-center text-[11px] text-slate-400 leading-5">
        {COUPANG_PARTNERS_NOTICE}
      </p>
    </section>
  );
}
