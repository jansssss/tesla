import Link from "next/link";
import { SHOP_PRODUCTS, COUPANG_PARTNERS_NOTICE } from "@/data/shop-products";

export const metadata = {
  title: "테슬라 꾸미기 베스트 — 하우머치 테슬라",
  description:
    "테슬라 오너들이 가장 많이 구매하는 액세서리 TOP 8. 카고 매트, 무선 충전 패드, 선쉐이드 등 커뮤니티 검증 베스트 아이템.",
  openGraph: {
    title: "테슬라 꾸미기 베스트 — 하우머치 테슬라",
    description:
      "테슬라 오너들이 가장 많이 구매하는 액세서리 TOP 8.",
    url: "https://paytesla.kr/shop",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: {
    canonical: "https://paytesla.kr/shop",
  },
};

function RankBadge({ rank, color }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${color} shadow-sm`}
    >
      {rank}
    </span>
  );
}

function ProductCard({ product }) {
  const isTop3 = product.rank <= 3;

  return (
    <a
      href={product.affiliate}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`group relative flex flex-col rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] ${
        isTop3
          ? "border-blue-200 shadow-[0_4px_20px_rgba(37,99,235,0.08)]"
          : "border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
      }`}
    >
      {/* 랭크 배지 */}
      <div className="absolute -top-3 -left-2 z-10">
        <RankBadge rank={product.rank} color={product.badgeColor} />
      </div>

      {/* 상단 강조 (TOP3) */}
      {isTop3 && (
        <div className="absolute top-0 right-0 rounded-tr-2xl rounded-bl-xl bg-blue-600 px-2 py-1 text-[10px] font-bold text-white tracking-wide">
          {product.badge}
        </div>
      )}

      <div className="flex flex-col gap-2.5 p-4 pt-5 md:gap-3 md:p-5 md:pt-6">
        {/* 이모지 + 카테고리 */}
        <div className="flex items-center gap-2">
          <span className="text-2xl md:text-3xl">{product.emoji}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {product.category}
          </span>
        </div>

        {/* 제품명 */}
        <div>
          <h3 className="text-sm font-black leading-snug text-slate-950 transition group-hover:text-blue-700 md:text-base">
            {product.name}
          </h3>
          <p className="mt-0.5 hidden text-xs text-slate-400 md:block">{product.nameEn}</p>
        </div>

        {/* 설명 — 데스크톱만 */}
        <p className="hidden text-sm leading-6 text-slate-600 md:block">{product.description}</p>

        {/* 태그 — 데스크톱만 */}
        <div className="hidden flex-wrap gap-1.5 md:flex">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-50 border border-slate-100 px-2 py-0.5 text-[11px] text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 가격 + 버튼 */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="min-w-0">
            <p className="text-base font-black text-slate-950 md:text-lg">
              ₩{product.price}
              <span className="text-xs font-normal text-slate-400">~</span>
            </p>
            <p className="hidden text-[10px] text-slate-400 md:block">{product.priceNote}</p>
          </div>
          {/* 모바일: 아이콘만 / 데스크톱: 텍스트+아이콘 */}
          <span className="shrink-0 inline-flex items-center justify-center gap-1 rounded-xl bg-slate-950 p-2.5 transition group-hover:bg-blue-600 md:px-3 md:py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="hidden whitespace-nowrap text-xs font-bold text-white md:inline">구매하기</span>
          </span>
        </div>
      </div>
    </a>
  );
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f0f4ff_0%,#f8fafc_20%,#ffffff_100%)]">
      {/* 헤더 */}
      <header className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_50%,#1d4ed8_100%)] text-white py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-200 transition hover:text-white mb-8"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            홈으로
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
              커뮤니티 검증
            </span>
            <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[11px] font-bold text-yellow-300 tracking-wide">
              TOP 8
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            테슬라 꾸미기 구매 베스트
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-200 md:text-lg">
            실제 테슬라 오너 커뮤니티에서 가장 많이 추천된 액세서리 8가지를 엄선했습니다.
            구매 후 바로 체감되는 제품들만 담았어요.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-blue-300">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
              커뮤니티 후기 기반 선정
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
              Model 3 · Model Y 호환 위주
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
              링크 클릭 시 쿠팡 이동 (추천 링크)
            </span>
          </div>
        </div>
      </header>

      {/* 제품 그리드 */}
      <section className="mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {SHOP_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 쿠팡 파트너스 고지 */}
        <p className="mt-10 text-center text-xs text-slate-400 leading-6">
          {COUPANG_PARTNERS_NOTICE}
          <br />
          제품 가격 및 재고는 판매처 사정에 따라 변경될 수 있으니 구매 전 확인하세요.
        </p>
      </section>

      {/* 계산기 CTA 배너 */}
      <section className="mx-auto max-w-5xl px-4 md:px-8 pb-16">
        <div className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.15)] md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
              지역별 계산기
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">
              내 지역 보조금도 계산해보셨나요?
            </h2>
            <p className="mt-2 text-sm leading-7 text-blue-200">
              전국 시·군·구 보조금을 기반으로 실구매가와 월 납입금을 바로 확인하세요.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
          >
            계산기 바로가기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
