import { Suspense } from "react";
import QuoteWizard from "@/components/QuoteWizard";
import { loadSubsidySnapshot } from "@/lib/subsidy";

export default function HomePage() {
  const snapshot = loadSubsidySnapshot();
  return (
    <main className="page">
      <Suspense fallback={<div>Loading...</div>}>
        <QuoteWizard rows={snapshot.rows} regions={snapshot.regions} />
      </Suspense>
    </main>
  );
}
