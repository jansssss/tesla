import ChargingCalculator from "@/components/calc/ChargingCalculator";
import CalcArticle from "@/components/calc/CalcArticle";
import { CALC_DATA_DATE } from "@/lib/calcExtra";

export const metadata = {
  title: "테슬라 충전비 계산기 — 월·연 충전 비용",
  description:
    "월 주행거리·전비·급속/완속 비율과 단가를 입력해 테슬라 월·연 충전비를 계산합니다. 급속·완속 비중에 따른 비용 차이를 확인하세요.",
  openGraph: {
    title: "테슬라 충전비 계산기 — 월·연 충전 비용",
    description: "주행거리·전비·급속/완속 비율로 테슬라 충전비를 계산합니다.",
    url: "https://www.paytesla.kr/calc/charging",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/charging" },
};

export default function ChargingPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <header className="mb-8">
          <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            충전비 계산기
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            테슬라 충전비 계산기
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
            월 주행거리와 전비, 급속·완속 충전 비율을 입력하면 월·연 충전비를 바로 계산합니다.
          </p>
        </header>
        <ChargingCalculator />
      </div>

      <div className="mt-12">
        <CalcArticle
          currentHref="/calc/charging"
          intro={
            "테슬라 충전비 계산기는 한 달에 충전으로 얼마를 쓰는지 추정하는 도구입니다. 전기차 충전비는 주행거리뿐 아니라 '어디서 충전하느냐'에 따라 크게 달라집니다.\n\n집·직장에서 완속으로 충전하면 단가가 낮고, 슈퍼차저나 공공 급속을 자주 쓰면 단가가 올라갑니다. 이 계산기는 급속·완속 비율을 가중 평균해 현실적인 충전비를 보여줍니다."
          }
          inputs={[
            { name: "월 주행거리(km)", desc: "한 달 동안 운행하는 총 거리입니다. 연 주행거리를 12로 나눠 입력해도 됩니다." },
            { name: "전비(km/kWh)", desc: "1kWh로 주행하는 거리입니다. 값이 클수록 같은 거리에 전력을 적게 씁니다." },
            { name: "급속/완속 비율(%)", desc: "전체 충전량 중 급속·완속이 차지하는 비중입니다. 합계를 100%로 맞추면 가장 정확합니다." },
            { name: "급속/완속 단가(원/kWh)", desc: "각 충전 방식의 단가입니다. 완속이 보통 더 저렴해, 완속 비중이 높을수록 충전비가 줄어듭니다." },
          ]}
          formula={[
            "월 충전량(kWh) = 월 주행거리 ÷ 전비",
            "가중 평균 단가 = (급속% × 급속단가 + 완속% × 완속단가) ÷ 100",
            "월 충전비 = 월 충전량 × 가중 평균 단가",
            "연 충전비 = 월 충전비 × 12",
          ]}
          example={{
            lead: "월 1,250km 주행, 전비 5.5km/kWh, 급속 30%(400원)·완속 70%(300원)로 가정하면:",
            steps: [
              "월 충전량 = 1,250 ÷ 5.5 ≈ 227 kWh",
              "가중 평균 단가 = (30×400 + 70×300) ÷ 100 = 330원/kWh",
              "월 충전비 = 227 × 330 ≈ 74,900원",
            ],
            result: "→ 월 약 7.5만원, 연 약 90만원",
          }}
          faqs={[
            { q: "완속과 급속 단가는 보통 얼마인가요?", a: "가정용·공용 완속은 100~300원대, 공공 급속은 300~400원대, 슈퍼차저는 시점에 따라 400원 이상인 경우가 많습니다. 멤버십·할인에 따라 달라지므로 최신 단가를 확인하세요." },
            { q: "비율 합계가 100%가 아니어도 되나요?", a: "비율대로 가중 평균해 계산하지만, 합계를 100%로 맞추면 의미가 더 명확합니다. 예: 급속 30% + 완속 70%." },
            { q: "유지비와 충전비는 어떻게 다른가요?", a: "충전비는 유지비의 일부(변동비)입니다. 보험료·자동차세까지 포함한 전체 유지비는 유지비 계산기에서 확인하세요." },
          ]}
          dataDate={CALC_DATA_DATE}
          sources={[
            { name: "환경부 무공해차 통합누리집 — 충전 안내", url: "https://www.ev.or.kr" },
            { name: "테슬라 공식 — 슈퍼차저", url: "https://www.tesla.com/ko_kr/supercharger" },
          ]}
        />
      </div>
    </main>
  );
}
