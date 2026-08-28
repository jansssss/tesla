import HomeHero from "@/components/home/HomeHero";
import HomeContent from "@/components/HomeContent";
import RecentGuides from "@/components/RecentGuides";
import { loadSubsidySnapshot } from "@/lib/subsidy";
import { METRO_REGIONS, calcMetroSubsidyStats } from "@/lib/regions";

export const metadata = {
  // 대표 계산기 키워드는 /subsidy가 가져간다. 홈은 플랫폼 전체를 대표하는 제목으로 분리해
  // 두 페이지가 같은 질의로 경쟁하지 않게 한다.
  title: {
    absolute: "하우머치 테슬라 — 테슬라 실구매가·보조금·유지비 계산 플랫폼",
  },
  description:
    "테슬라 Model 3·Model Y를 살 때 드는 돈을 지역별 보조금부터 월납입금·유지비까지 한 곳에서 계산합니다. 계산기와 구매 질문, 대표 가이드 30편으로 구매 판단 순서를 확인합니다.",
  openGraph: {
    title: "하우머치 테슬라 — 테슬라 실구매가·보조금·유지비 계산 플랫폼",
    description:
      "지역별 보조금 자동 반영 실구매가 계산기와 구매 질문 30편. 테슬라 구매 판단에 필요한 숫자를 한 곳에서.",
    url: "https://www.paytesla.kr",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr" },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "하우머치 테슬라",
      url: "https://www.paytesla.kr",
      description:
        "테슬라 구매 비용을 지역별 보조금·월납입금·유지비까지 계산하는 독립 계산 플랫폼.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://www.paytesla.kr" },
      ],
    },
  ],
};

/** 히어로 프리뷰용 대표 트림 — 문의·검색량이 가장 많은 구성 */
const PREVIEW_TRIM_ID = "my-rwd";

/**
 * 광역시·특별시별 대표 트림 보조금을 모아 히어로 카드용 데이터를 만든다.
 * 지역 간 편차를 보여주는 것이 목적이므로 값이 0인(미공고) 지역은 제외한다.
 */
function buildHeroPreview(snapshot) {
  const rows = METRO_REGIONS.filter((r) => r.type === "si")
    .map((region) => {
      const { statsByModel } = calcMetroSubsidyStats(snapshot.rows, region);
      const stat = statsByModel.find((s) => s.trimId === PREVIEW_TRIM_ID);
      if (!stat || !stat.max) return null;
      return {
        name: region.shortName,
        label: stat.label,
        price: stat.price,
        subsidyManwon: stat.max,
        netPrice: stat.price - stat.max * 10000,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.subsidyManwon - a.subsidyManwon);

  if (rows.length === 0) return null;

  const best = rows[0];
  const worst = rows[rows.length - 1];

  // 카드에 적는 '지역 간 차이' 문구를 눈으로 검증할 수 있도록
  // 2위·중앙값·최저 지역을 함께 보여준다(중복은 제거).
  const others = [rows[1], rows[Math.floor(rows.length / 2)], worst]
    .filter(Boolean)
    .filter((r, i, arr) => arr.findIndex((x) => x.name === r.name) === i);

  return {
    trimLabel: best.label,
    price: best.price,
    best,
    others,
    spreadManwon: best.subsidyManwon - worst.subsidyManwon,
    dataDate: snapshot.dataDate,
  };
}

export default function HomePage() {
  const snapshot = loadSubsidySnapshot();
  const preview = buildHeroPreview(snapshot);

  return (
    <main className="page bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {preview ? <HomeHero preview={preview} /> : null}
      <RecentGuides />
      <HomeContent />
    </main>
  );
}
