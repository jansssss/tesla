import EvPurchaseReadinessCalculator from "@/components/calc/EvPurchaseReadinessCalculator";

export const metadata = {
  title: "테슬라 구매 준비도 체크 — 전기차 전환 적합도 5문항",
  description:
    "충전 환경·주행거리·예산·장거리 빈도 등 5가지 항목으로 전기차(테슬라) 구매 준비도를 점수화합니다. 내 상황에 맞는 다음 단계를 안내해드립니다.",
  openGraph: {
    title: "테슬라 구매 준비도 체크",
    description: "5문항으로 전기차 구매 준비도를 점수화하고 맞춤 조언을 확인하세요.",
    url: "https://www.paytesla.kr/calc/ev-purchase-readiness",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/ev-purchase-readiness" },
};

export default function EvPurchaseReadinessPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <header className="mb-8">
          <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            구매 준비도 체크
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            테슬라 구매 준비도 체크
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
            5가지 질문에 답하면 내 상황에서 전기차 구매가 얼마나 적합한지 점수로 확인할 수 있습니다.
          </p>
        </header>
        <EvPurchaseReadinessCalculator />
      </div>
    </main>
  );
}
