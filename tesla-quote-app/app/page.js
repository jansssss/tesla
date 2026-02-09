import QuoteWizard from "@/components/QuoteWizard";
import { loadSubsidySnapshot } from "@/lib/subsidy";

export default function HomePage() {
  const snapshot = loadSubsidySnapshot();
  return (
    <main className="page">
      <QuoteWizard rows={snapshot.rows} regions={snapshot.regions} />
    </main>
  );
}
