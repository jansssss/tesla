import Link from "next/link";

// primary: 모바일에서도 노출하는 핵심 링크. 나머지는 데스크톱에서만 노출한다.
const NAV_ITEMS = [
  // 계산기 (핵심 도구)
  { label: "계산기 전체", href: "/calc", primary: true },
  { label: "테슬라 보조금 계산기", href: "/", primary: true },
  { label: "월실제부담 계산기", href: "/calc/monthly-real-cost", primary: true },
  { label: "전환비교 계산기", href: "/calc/switch-to-tesla" },
  { label: "구매준비도 체크", href: "/calc/ev-purchase-readiness" },
  { label: "유지비 계산기", href: "/calc/maintenance" },
  { label: "총소유비용 계산기", href: "/calc/tco" },
  { label: "모델 비교 계산기", href: "/calc/compare" },
  // 충전 인프라
  { label: "충전비 계산기", href: "/calc/charging", primary: true },
  { label: "충전시간 계산기", href: "/calc/charging-time" },
  { label: "충전기 설치비 계산기", href: "/calc/charger-install" },
  // 지역별 보조금 — 색인 유지 대상(광역시/특별시)만
  { label: "서울 보조금", href: "/subsidy/seoul", primary: true },
  { label: "부산 보조금", href: "/subsidy/busan" },
  { label: "인천 보조금", href: "/subsidy/incheon" },
  { label: "대구 보조금", href: "/subsidy/daegu" },
  { label: "대전 보조금", href: "/subsidy/daejeon" },
  { label: "광주 보조금", href: "/subsidy/gwangju" },
  { label: "제주 보조금", href: "/subsidy/jeju" },
  // 모델 정보
  { label: "Model 3 가격", href: "/models/model-3" },
  { label: "Model Y 가격", href: "/models/model-y" },
  { label: "Model Y L", href: "/models/model-y-l" },
  // 비교
  { label: "Model 3 vs Y", href: "/compare/model-3-vs-model-y" },
  { label: "RWD vs AWD", href: "/compare/rwd-vs-awd" },
];

export default function SiteNav() {
  return (
    <nav
      className="border-b border-gray-100 bg-white"
      aria-label="자주 찾는 정보"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div
          className="flex items-center gap-3 overflow-x-auto py-2.5 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* 레이블 */}
          <span className="shrink-0 text-xs font-medium text-gray-400">
            자주 찾는 정보
          </span>
          <span className="shrink-0 text-gray-200">|</span>

          {/* 링크 pills — 모바일은 핵심(primary)만, 데스크톱은 전체 노출 */}
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition-all hover:border-gray-400 hover:bg-white hover:text-gray-900 ${
                item.primary ? "" : "hidden md:inline-block"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
