"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 데스크톱 전용 플로팅 계산기 버튼.
 * 모바일에서는 하단 탭바의 '계산기' 탭이 같은 역할을 하므로 렌더링하지 않는다
 * (겹쳐 놓으면 탭바·견적 요약 바와 함께 하단이 3중으로 가려진다).
 */
export default function FloatingCalcButton() {
  const pathname = usePathname();
  // 계산기 본체가 있는 페이지에서는 띄우지 않는다.
  if (pathname === "/subsidy") return null;

  return (
    <Link
      href="/subsidy"
      aria-label="보조금 확인 계산기로 이동"
      className="fixed bottom-8 right-8 z-50 hidden items-center gap-2 rounded-full bg-[#171a20] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_32px_rgba(15,23,42,0.3)] transition hover:bg-[#3457dc] active:scale-95 md:flex"
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
      보조금 확인
    </Link>
  );
}
