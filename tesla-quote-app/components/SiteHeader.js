"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",                           label: "계산기",      match: (p) => p === "/" },
  { href: "/models/model-3",             label: "모델",        match: (p) => p.startsWith("/models") },
  { href: "/compare/model-3-vs-model-y", label: "비교",        match: (p) => p.startsWith("/compare") },
  { href: "/subsidy/seoul",              label: "지역 보조금",  match: (p) => p.startsWith("/subsidy") },
  { href: "/guides",                     label: "가이드",      match: (p) => p.startsWith("/guides") },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="shrink-0 text-sm font-black tracking-tight text-slate-950 md:text-base">
          하우머치 <span className="text-red-600">테슬라</span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2" aria-label="메인 메뉴">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition md:px-4 md:text-sm ${
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
      </div>
    </header>
  );
}
