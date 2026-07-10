import SwitchToTeslaCalculator from "@/components/calc/SwitchToTeslaCalculator";
import { CALC_DATA_DATE } from "@/lib/calcExtra";

export const metadata = {
  title: "내연기관 → 테슬라 전환 비교 계산기 — 월 절감액·회수 기간",
  description:
    "현재 내연기관차의 월 유지비와 테슬라 전환 후 총비용을 비교합니다. 연료비·보험료·점검비·할부금을 입력해 월 절감액과 선수금 회수 기간을 즉시 계산.",
  openGraph: {
    title: "내연기관 → 테슬라 전환 비교 계산기",
    description: "내연기관 월 비용 vs 테슬라 월 비용 비교. 절감액·회수 기간 계산.",
    url: "https://www.paytesla.kr/calc/switch-to-tesla",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/switch-to-tesla" },
};

export default function SwitchToTeslaPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <header className="mb-8">
          <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            전환 비교 계산기
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            내연기관 → 테슬라 전환 비교
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
            현재 차량의 월 비용과 테슬라 전환 후 비용을 나란히 비교합니다.
            월 절감액과 선수금 회수 기간을 직접 확인하세요.
          </p>
        </header>
        <SwitchToTeslaCalculator dataDate={CALC_DATA_DATE} />
      </div>
    </main>
  );
}
