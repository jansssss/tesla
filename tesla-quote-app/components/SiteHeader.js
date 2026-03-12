import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "계산기" },
  { href: "/guides", label: "정보성 가이드" },
  { href: "/about", label: "사이트 소개" },
  { href: "/contact", label: "문의" }
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="text-sm font-black tracking-tight text-slate-950 md:text-base">
          하우머치 <span className="text-brandRed">테슬라</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2 md:gap-3" aria-label="메인 메뉴">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 md:px-4 md:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
