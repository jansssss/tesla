import { Suspense } from "react";
import HomeContent from "@/components/HomeContent";
import QuoteWizard from "@/components/QuoteWizard";
import QuoteWizardSkeleton from "@/components/QuoteWizardSkeleton";
import RecentGuides, { RecentGuidesSkeleton } from "@/components/RecentGuides";
import { loadSubsidySnapshot } from "@/lib/subsidy";

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
