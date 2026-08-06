"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",                           label: "계산기",     match: (p) => p === "/" },
  { href: "/models/model-3",             label: "모델",       match: (p) => p.startsWith("/models") },
  { href: "/compare/model-3-vs-model-y", label: "비교",       match: (p) => p.startsWith("/compare") },
  { href: "/subsidy/seoul",              label: "지역 보조금", match: (p) => p.startsWith("/subsidy") },
  { href: "/guides",                     label: "가이드",     match: (p) => p.startsWith("/guides") },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/"
          className="shrink-0 text-[15px] font-black tracking-tight text-slate-950 md:text-base"
        >
          하우머치 <span className="text-red-600">테슬라</span>
        </Link>

        {/* 데스크톱 전용 상단 네비.
            모바일은 같은 동선을 하단 탭바(MobileTabBar)에서 제공한다 —
            좁은 화면에서 로고 + pill 5개를 한 줄에 두면 375px에서 가로로 넘친다. */}
        <nav className="hidden items-center gap-2 md:flex" aria-label="메인 메뉴">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname ?? "");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 모바일 전용 우측 바로가기 — 현재 위치와 무관하게 계산기로 한 번에 */}
        <Link
          href="/calc"
          className="flex h-10 shrink-0 items-center rounded-full bg-slate-950 px-4 text-xs font-bold text-white md:hidden"
        >
          계산기 전체
        </Link>
      </div>
    </header>
  );
}
