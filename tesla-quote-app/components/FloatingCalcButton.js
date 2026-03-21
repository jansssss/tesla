"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingCalcButton() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      aria-label="계산기로 이동"
      className="fixed bottom-6 right-5 z-50 flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-xs font-bold text-white shadow-[0_8px_32px_rgba(15,23,42,0.3)] transition hover:bg-slate-800 active:scale-95 md:bottom-8 md:right-8 md:px-5 md:text-sm"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="10" y2="10" />
        <line x1="14" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="10" y2="14" />
        <line x1="14" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="10" y2="18" />
        <line x1="14" y1="18" x2="16" y2="18" />
      </svg>
      계산기
    </Link>
  );
}
