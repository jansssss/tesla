import { Suspense } from "react";
import QuoteWizard from "@/components/QuoteWizard";
import QuoteWizardSkeleton from "@/components/QuoteWizardSkeleton";
import { loadSubsidySnapshot } from "@/lib/subsidy";

export default function HomePage() {
  const snapshot = loadSubsidySnapshot();
  return (
    <main className="page">
      <Suspense fallback={<QuoteWizardSkeleton />}>
        <QuoteWizard rows={snapshot.rows} regions={snapshot.regions} />
      </Suspense>
    </main>
  );
}
