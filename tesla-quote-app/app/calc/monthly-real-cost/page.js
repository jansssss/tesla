import MonthlyRealCostCalculator from "@/components/calc/MonthlyRealCostCalculator";
import PurchaseCrossLinks from "@/components/calc/PurchaseCrossLinks";
import { CALC_DATA_DATE } from "@/lib/calcExtra";

export const metadata = {
  title: "테슬라 월 실제 부담금 계산기 — 할부+충전비+보험 합산",
  description:
    "할부 월납입금에 충전비·보험료·자동차세를 합산한 월 실제 부담금을 계산합니다. 보조금·선수금·금리·주행거리를 입력하면 즉시 확인.",
  openGraph: {
    title: "테슬라 월 실제 부담금 계산기",
    description: "월납입금 + 충전비 + 보험료 + 자동차세 = 월 실제 부담금 계산.",
    url: "https://www.paytesla.kr/calc/monthly-real-cost",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/monthly-real-cost" },
};

export default function MonthlyRealCostPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <header className="mb-8">
          <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            월 실제 부담 계산기
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            테슬라 월 실제 부담금 계산기
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
            할부금만이 아닌 충전비·보험료·자동차세까지 합산한{" "}
            <strong>실제 월 지출액</strong>을 계산합니다.
          </p>
        </header>
        <MonthlyRealCostCalculator dataDate={CALC_DATA_DATE} />
      </div>

      <PurchaseCrossLinks
        items={[
          {
            href: "/calc/tesla-subsidy",
            label: "테슬라 월납입금 계산기",
            desc: "할부 월납입금의 기준이 되는 지역별 보조금·실구매가를 먼저 정확히 계산하세요.",
          },
          {
            href: "/calc/maintenance",
            label: "유지비 계산기",
            desc: "충전비·보험료·자동차세로 구성된 유지비를 월·연 단위로 따로 확인합니다.",
          },
          {
            href: "/calc/tco",
            label: "총소유비용(TCO) 계산기",
            desc: "감가상각까지 반영한 5년 보유 총비용을 내연기관차와 비교합니다.",
          },
        ]}
      />
    </main>
  );
}
