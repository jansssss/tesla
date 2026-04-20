import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import QuoteWizard from "@/components/QuoteWizard";
import QuoteWizardSkeleton from "@/components/QuoteWizardSkeleton";
import RecentGuides, { RecentGuidesSkeleton } from "@/components/RecentGuides";
import { loadSubsidySnapshot } from "@/lib/subsidy";

export const metadata = {
  title: "테슬라 실구매가·월납입금 계산기 — 지역별 보조금 자동 적용 | 테슬라 얼마?",
  description:
    "테슬라 Model 3·Model Y 트림별 출고가에 국고·지방 보조금을 자동 적용해 실구매가와 할부 월납입금을 계산합니다. 전국 17개 시·도 보조금 최신 반영.",
  openGraph: {
    title: "테슬라 실구매가·월납입금 계산기 — 지역별 보조금 자동 적용",
    description:
      "테슬라 Model 3·Model Y 트림별 출고가에 국고·지방 보조금을 자동 적용해 실구매가와 할부 월납입금을 계산합니다.",
    url: "https://paytesla.kr",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://paytesla.kr" },
};

export default function HomePage() {
  const snapshot = loadSubsidySnapshot();
  return (
    <main className="page">
      <Suspense fallback={<QuoteWizardSkeleton />}>
        <QuoteWizard rows={snapshot.rows} regions={snapshot.regions} />
      </Suspense>
      <div className="border-b border-slate-100" />
      <Suspense fallback={<RecentGuidesSkeleton />}>
        <RecentGuides />
      </Suspense>
      <HomeContent />
    </main>
  );
}
