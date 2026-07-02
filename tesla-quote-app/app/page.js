import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import QuoteWizard from "@/components/QuoteWizard";
import QuoteWizardSkeleton from "@/components/QuoteWizardSkeleton";
import RecentGuides, { RecentGuidesSkeleton } from "@/components/RecentGuides";
import { loadSubsidySnapshot } from "@/lib/subsidy";

export const metadata = {
  title: "테슬라 보조금 계산기 2026 — Model 3·Model Y 실구매가·월납입금 | 테슬라 얼마?",
  description:
    "2026년 테슬라 Model 3·Model Y의 국고보조금·지자체 보조금을 자동 적용해 실구매가와 할부 월납입금을 계산합니다. 전국 17개 시·도 보조금 최신 반영.",
  openGraph: {
    title: "테슬라 보조금 계산기 2026 — Model 3·Model Y 실구매가·월납입금",
    description:
      "2026년 테슬라 Model 3·Model Y의 국고·지자체 보조금을 자동 적용해 실구매가와 할부 월납입금을 계산합니다.",
    url: "https://www.paytesla.kr",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr" },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "테슬라 보조금 계산기",
      url: "https://www.paytesla.kr",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "2026년 테슬라 Model 3·Model Y의 국고보조금·지자체 보조금을 자동 적용해 실구매가와 월납입금을 계산하는 무료 계산기.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://www.paytesla.kr" },
      ],
    },
  ],
};

export default function HomePage() {
  const snapshot = loadSubsidySnapshot();
  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Suspense fallback={<QuoteWizardSkeleton />}>
        <QuoteWizard rows={snapshot.rows} regions={snapshot.regions} dataDate={snapshot.dataDate} />
      </Suspense>
      <div className="border-b border-slate-100" />
      <Suspense fallback={<RecentGuidesSkeleton />}>
        <RecentGuides />
      </Suspense>
      <HomeContent />
    </main>
  );
}
