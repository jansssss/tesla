import Link from "next/link";

const NAV_ITEMS = [
  // 지역별 보조금 (주요 지역)
  { label: "서울 보조금", href: "/subsidy/seoul" },
  { label: "경기 보조금", href: "/subsidy/gyeonggi" },
  { label: "인천 보조금", href: "/subsidy/incheon" },
  { label: "부산 보조금", href: "/subsidy/busan" },
  { label: "대전 보조금", href: "/subsidy/daejeon" },
  { label: "제주 보조금", href: "/subsidy/jeju" },
  { label: "전남 보조금", href: "/subsidy/jeonnam" },
  // 모델 정보
  { label: "Model 3 가격", href: "/models/model-3" },
  { label: "Model Y 가격", href: "/models/model-y" },
  // 비교
  { label: "Model 3 vs Y", href: "/compare/model-3-vs-model-y" },
  { label: "RWD vs AWD", href: "/compare/rwd-vs-awd" },
  // 쇼핑
  { label: "액세서리 베스트", href: "/shop" },
];

export default function SiteNav() {
  return (
    <nav
      className="border-b border-gray-100 bg-white"
      aria-label="자주 찾는 정보"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center gap-3 overflow-x-auto py-2.5 scrollbar-hide">
          {/* 레이블 */}
          <span className="shrink-0 text-xs font-medium text-gray-400">
            자주 찾는 정보
          </span>
          <span className="shrink-0 text-gray-200">|</span>

          {/* 링크 pills */}
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition-all hover:border-gray-400 hover:bg-white hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
