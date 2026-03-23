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
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-8">
      {/* 헤더 — 항상 한 줄 (좌: 뱃지+타이틀, 우: 전체보기) */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
            커뮤니티 검증
          </span>
          <h2 className="mt-2.5 text-lg font-black tracking-tight text-slate-950 md:text-2xl">
            테슬라 꾸미기 구매 베스트
          </h2>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            실제 오너들이 가장 많이 구매한 액세서리 TOP 8
          </p>
        </div>
        <Link
          href="/shop"
          className="shrink-0 mt-0.5 inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-blue-600 transition hover:text-blue-700 md:text-sm"
        >
          전체 보기
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* 미니 제품 카드 4개 */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 md:mt-6 md:grid-cols-4 md:gap-3">
        {top4.map((product) => (
          <a
            key={product.id}
            href={product.affiliate}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group relative flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:p-4"
          >
            {/* 랭크 배지 */}
            <span
              className={`absolute -top-2 -left-1 inline-flex w-5 h-5 items-center justify-center rounded-full text-[9px] font-black shadow-sm md:w-6 md:h-6 md:text-[10px] ${product.badgeColor}`}
            >
              {product.rank}
            </span>

            <span className="text-xl md:text-2xl">{product.emoji}</span>
            <p className="line-clamp-2 text-xs font-black leading-snug text-slate-950 transition group-hover:text-blue-700 md:text-sm">
              {product.name}
            </p>
            <p className="text-[11px] font-bold text-slate-400 md:text-xs">₩{product.price}~</p>
          </a>
        ))}
      </div>

      {/* 더보기 버튼 — 모바일 full width */}
      <Link
        href="/shop"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3 text-sm font-bold text-white transition hover:bg-blue-700 md:mt-5 md:w-auto md:px-6 md:mx-auto md:table"
      >
        베스트 8개 전체 보기
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline-block">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>

      {/* 쿠팡 파트너스 고지 */}
      <p className="mt-3 text-center text-[11px] text-slate-400 leading-5">
        {COUPANG_PARTNERS_NOTICE}
      </p>
    </section>
  );
}
