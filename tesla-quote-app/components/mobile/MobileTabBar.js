"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenuSheet from "./MobileMenuSheet";

/**
 * 모바일 전용 하단 탭바.
 *
 * 데스크톱은 상단 pill 네비(SiteHeader + SiteNav)로 이동하지만, 좁은 화면에서는
 * 같은 링크를 상단에 밀어 넣으면 375px에서 가로로 넘친다. 모바일은 엄지가 닿는
 * 하단에 4개 핵심 동선 + 전체 메뉴를 두는 앱형 구조로 분리한다.
 */
const TABS = [
  {
    href: "/",
    label: "계산기",
    match: (p) => p === "/",
    icon: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2.5" />
        <line x1="8" y1="6.5" x2="16" y2="6.5" />
        <line x1="8.5" y1="11" x2="8.5" y2="11" />
        <line x1="12" y1="11" x2="12" y2="11" />
        <line x1="15.5" y1="11" x2="15.5" y2="11" />
        <line x1="8.5" y1="15" x2="8.5" y2="15" />
        <line x1="12" y1="15" x2="12" y2="15" />
        <line x1="15.5" y1="15" x2="15.5" y2="18.5" />
        <line x1="8.5" y1="18.5" x2="12" y2="18.5" />
      </>
    ),
  },
  {
    href: "/calc",
    label: "도구",
    match: (p) => p.startsWith("/calc"),
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1.8" />
      </>
    ),
  },
  {
    href: "/subsidy/seoul",
    label: "보조금",
    match: (p) => p.startsWith("/subsidy"),
    icon: (
      <>
        <path d="M3 21h18" />
        <path d="M4 21V10l8-6 8 6v11" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
  },
  {
    href: "/models/model-3",
    label: "모델",
    match: (p) => p.startsWith("/models") || p.startsWith("/compare"),
    icon: (
      <>
        <path d="M5 17h14" />
        <path d="M4 17v-3.2a2 2 0 0 1 .3-1.05l2.2-3.5A2 2 0 0 1 8.2 8.3h7.6a2 2 0 0 1 1.7.95l2.2 3.5a2 2 0 0 1 .3 1.05V17" />
        <circle cx="7.5" cy="17" r="1.8" />
        <circle cx="16.5" cy="17" r="1.8" />
      </>
    ),
  },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /* 관리자 화면은 별도 UI를 쓰므로 탭바를 띄우지 않는다 */
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <nav
        aria-label="모바일 주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "var(--safe-b)" }}
      >
        <ul className="mx-auto flex h-[58px] max-w-lg items-stretch">
          {TABS.map((tab) => {
            const active = tab.match(pathname ?? "");
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                    active ? "text-slate-950" : "text-slate-400"
                  }`}
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={active ? 2.2 : 1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {tab.icon}
                  </svg>
                  <span className={`text-[10px] leading-none ${active ? "font-bold" : "font-medium"}`}>
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          })}

          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="전체 메뉴 열기"
              aria-expanded={menuOpen}
              className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-colors ${
                menuOpen ? "text-slate-950" : "text-slate-400"
              }`}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <span className="text-[10px] font-medium leading-none">전체</span>
            </button>
          </li>
        </ul>
      </nav>

      <MobileMenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
