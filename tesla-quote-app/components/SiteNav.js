import Link from "@/components/AppLink";
import SiteNavMore from "@/components/SiteNavMore";
import popularity from "@/data/nav-popularity.json";

// 데스크톱 전용 보조 네비게이션 — '많이 찾는 메뉴'.
// 모바일은 하단 탭바 + 전체 메뉴 시트(MobileMenuSheet)가 같은 링크를 담당한다.
//
// 순서와 색은 data/nav-popularity.json 으로 정한다.
//   clicks:    GSC 검색 클릭(Vercel 수집 시작 전 기간)
//   pageviews: Vercel Web Analytics 실제 방문(수집 시작 후 기간) — 둘을 더해 점수로 쓴다
//   갱신 방법은 README '많이 찾는 메뉴 인기 순위 갱신' 참고
// 헤더(SiteHeader)에 이미 있는 목적지(/subsidy, /calc, /answers, /guides,
// /models/model-3, /compare/model-3-vs-model-y)는 중복이라 넣지 않는다.
const NAV_ITEMS = [
  { label: "월실제부담 계산기", href: "/calc/monthly-real-cost", group: "계산기" },
  { label: "전환비교 계산기", href: "/calc/switch-to-tesla", group: "계산기" },
  { label: "구매준비도 체크", href: "/calc/ev-purchase-readiness", group: "계산기" },
  { label: "유지비 계산기", href: "/calc/maintenance", group: "계산기" },
  { label: "총소유비용 계산기", href: "/calc/tco", group: "계산기" },
  { label: "모델 비교 계산기", href: "/calc/compare", group: "계산기" },
  { label: "충전비 계산기", href: "/calc/charging", group: "충전" },
  { label: "충전시간 계산기", href: "/calc/charging-time", group: "충전" },
  { label: "충전기 설치비 계산기", href: "/calc/charger-install", group: "충전" },
  // 지역별 보조금 — 색인 유지 대상(광역시/특별시)만
  { label: "서울 보조금", href: "/subsidy/seoul", group: "지역별 보조금" },
  { label: "부산 보조금", href: "/subsidy/busan", group: "지역별 보조금" },
  { label: "인천 보조금", href: "/subsidy/incheon", group: "지역별 보조금" },
  { label: "대구 보조금", href: "/subsidy/daegu", group: "지역별 보조금" },
  { label: "대전 보조금", href: "/subsidy/daejeon", group: "지역별 보조금" },
  { label: "광주 보조금", href: "/subsidy/gwangju", group: "지역별 보조금" },
  { label: "제주 보조금", href: "/subsidy/jeju", group: "지역별 보조금" },
  { label: "Model Y 가격", href: "/models/model-y", group: "모델·비교" },
  { label: "Model Y L", href: "/models/model-y-l", group: "모델·비교" },
  { label: "RWD vs AWD", href: "/compare/rwd-vs-awd", group: "모델·비교" },
];

const GROUP_ORDER = ["계산기", "충전", "지역별 보조금", "모델·비교"];
const HOT_COUNT = 3; // 상위 3개: 진한 그라디언트 + 순위 숫자
const WARM_COUNT = 4; // 다음 4개: 은은한 그라디언트

// 화면 폭에 맞춰 한 줄에 보이는 개수 — 나머지는 '전체 메뉴'에서 연다.
// md 4개 · lg 6개 · xl 이상 8개
function visibilityClass(rank) {
  if (rank < 4) return "inline-flex";
  if (rank < 6) return "hidden lg:inline-flex";
  if (rank < 8) return "hidden xl:inline-flex";
  return "hidden";
}

const TIER_CLASS = {
  hot:
    "border-transparent bg-gradient-to-r from-[#ff8a5b] via-[#f4512c] to-[#e2456f] text-white " +
    "shadow-[0_3px_12px_-4px_rgba(226,69,111,0.55)] hover:-translate-y-px hover:brightness-105",
  warm:
    "border-[#dfe4fb] bg-gradient-to-r from-[#f1f4ff] to-[#f7f1ff] text-[#3446b8] " +
    "hover:border-[#b6c0f4] hover:text-[#25338f]",
  base: "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400 hover:bg-white hover:text-gray-900",
};

// 인기 점수 = GSC 검색 클릭 + Vercel 방문(pageviews).
// 검색 클릭 1건은 그 자체로 방문 1건이라 같은 기간을 더하면 이중 집계가 된다.
// 그래서 GSC 기간은 Vercel 수집 시작일(analyticsStart) 전날까지로 잘라 두 기간이 겹치지 않게 한다
// (scripts/analytics/nav_popularity.py 가 처리).
function pickSource() {
  const clicks = popularity?.clicks ?? {};
  const pv = popularity?.pageviews?.counts ?? {};
  const counts = {};
  for (const item of NAV_ITEMS) {
    counts[item.href] = (clicks[item.href] ?? 0) + (pv[item.href] ?? 0);
  }
  const hasPv = Object.keys(pv).length > 0;
  const days = (popularity?.window?.days ?? 90) + (hasPv ? popularity.pageviews.window?.days ?? 0 : 0);
  return { counts, days, label: hasPv ? "검색 유입·방문" : "검색 유입" };
}

function rankItems(counts) {
  return NAV_ITEMS.map((item, order) => ({ ...item, score: counts[item.href] ?? 0, order }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((item, rank) => {
      let tier = "base";
      if (item.score > 0 && rank < HOT_COUNT) tier = "hot";
      else if (item.score > 0 && rank < HOT_COUNT + WARM_COUNT) tier = "warm";
      return { label: item.label, href: item.href, group: item.group, rank, tier };
    });
}

export default function SiteNav() {
  const source = pickSource();
  const items = rankItems(source.counts);
  const groups = GROUP_ORDER.map((name) => ({
    name,
    items: items.filter((item) => item.group === name),
  }));
  const days = source.days;
  const basis = `최근 ${days}일 ${source.label}`;

  return (
    <nav className="hidden border-b border-gray-100 bg-white md:block" aria-label="많이 찾는 메뉴">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 md:px-8">
        <span
          className="shrink-0 text-xs font-semibold text-gray-500"
          title={`${basis}이 많은 순서`}
        >
          많이 찾는 메뉴
        </span>
        <span className="h-3.5 w-px shrink-0 bg-gray-200" aria-hidden="true" />

        {/* 안전장치: 폭이 모자라면 버튼이 반쯤 잘리지 않고 통째로 둘째 줄(숨김)로 넘어간다.
            위아래 여백은 그라디언트 버튼 그림자가 잘리지 않게 둔 것. */}
        <ul className="-my-1.5 flex h-[42px] min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-6 overflow-hidden py-1.5">
          {items.map((item) => (
            <li key={item.href} className={visibilityClass(item.rank)}>
              <Link
                href={item.href}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${TIER_CLASS[item.tier]}`}
              >
                {item.tier === "hot" ? (
                  <>
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold leading-none"
                      aria-hidden="true"
                    >
                      {item.rank + 1}
                    </span>
                    <span className="sr-only">인기 {item.rank + 1}위:</span>
                  </>
                ) : null}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <SiteNavMore groups={groups} basis={basis} />
      </div>
    </nav>
  );
}
