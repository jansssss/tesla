import MaintenanceCalculator from "@/components/calc/MaintenanceCalculator";
import CalcArticle from "@/components/calc/CalcArticle";
import PurchaseCrossLinks from "@/components/calc/PurchaseCrossLinks";
import { CALC_DATA_DATE } from "@/lib/calcExtra";

export const metadata = {
  title: "테슬라 유지비 계산기 — 월·연·5년 유지비",
  description:
    "테슬라 연간 주행거리·충전 단가·전비·보험료·자동차세를 입력해 월·연·5년 유지비를 자동 계산합니다. 충전비와 고정비를 분리해 한눈에 확인하세요.",
  openGraph: {
    title: "테슬라 유지비 계산기 — 월·연·5년 유지비",
    description: "충전비·보험료·자동차세로 테슬라 유지비를 월·연·5년 단위로 계산합니다.",
    url: "https://www.paytesla.kr/calc/maintenance",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/maintenance" },
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <header className="mb-8">
          <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            유지비 계산기
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            테슬라 유지비 계산기
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
            연간 주행거리와 충전 단가, 보험료·자동차세를 입력하면 월·연·5년 유지비를 바로 계산합니다.
          </p>
        </header>
        <MaintenanceCalculator />
      </div>

      <PurchaseCrossLinks
        items={[
          {
            href: "/",
            label: "테슬라 보조금 계산기",
            desc: "유지비 이전에 구매가를 결정하는 국고·지자체 보조금을 지역별로 확인하고 실구매가를 계산하세요.",
          },
          {
            href: "/calc/charging",
            label: "충전비 계산기",
            desc: "급속·완속 비율에 따른 월·연 충전비만 따로 정밀하게 계산합니다.",
          },
          {
            href: "/calc/tco",
            label: "총소유비용(TCO) 계산기",
            desc: "유지비에 감가상각까지 더한 5년 총비용을 내연기관차와 비교합니다.",
          },
        ]}
      />

      <div className="mt-12">
        <CalcArticle
          currentHref="/calc/maintenance"
          intro={
            "테슬라 유지비 계산기는 전기차를 보유할 때 매달·매년 실제로 빠져나가는 비용을 추정하는 도구입니다. 차량 가격이나 보조금과 달리, 유지비는 주행 습관과 충전 환경에 따라 사람마다 크게 달라집니다.\n\n이 계산기는 변동비(충전비)와 고정비(보험료·자동차세)를 함께 합산해, 한 달에 얼마를 준비해야 하는지 현실적인 감을 잡을 수 있도록 돕습니다. 기본값은 가정값이므로 본인 조건에 맞게 조정해 사용하세요."
          }
          inputs={[
            { name: "연간 주행거리(km)", desc: "1년 동안 운행하는 총 거리입니다. 출퇴근·주말 운행을 합산해 입력하세요. 국내 승용차 평균은 약 1.3만~1.5만 km입니다." },
            { name: "충전 단가(원/kWh)", desc: "주로 사용하는 충전 단가입니다. 가정용 완속은 보통 100~300원대, 공공 급속은 300~400원대입니다." },
            { name: "전비(km/kWh)", desc: "1kWh로 주행하는 거리입니다. Model 3는 약 6.0, Model Y는 약 5.0 km/kWh 수준이며 계절·운전 습관에 따라 달라집니다." },
            { name: "연 보험료(원)", desc: "자동차보험 연간 납입액입니다. 운전 경력·할인할증·차량 가액에 따라 달라집니다." },
            { name: "연 자동차세(원)", desc: "전기차 자동차세는 비영업용 기준 지방교육세 포함 약 13만원으로 고정에 가깝습니다." },
          ]}
          formula={[
            "연 충전비 = (연간 주행거리 ÷ 전비) × 충전 단가",
            "연 유지비 = 연 충전비 + 연 보험료 + 연 자동차세",
            "월 유지비 = 연 유지비 ÷ 12",
            "5년 유지비 = 연 유지비 × 5",
          ]}
          example={{
            lead: "연 15,000km 주행, 충전 단가 300원/kWh, 전비 5.5km/kWh, 보험료 120만원, 자동차세 13만원으로 가정하면:",
            steps: [
              "연 충전비 = (15,000 ÷ 5.5) × 300 ≈ 818,000원",
              "연 유지비 = 818,000 + 1,200,000 + 130,000 = 2,148,000원",
              "월 유지비 = 2,148,000 ÷ 12 ≈ 179,000원",
            ],
            result: "→ 월 약 17.9만원, 연 약 215만원, 5년 약 1,074만원",
          }}
          faqs={[
            { q: "유지비에 감가상각은 포함되나요?", a: "이 계산기는 충전비·보험료·자동차세 등 매년 실제로 지출하는 운영비만 계산합니다. 차량 가치 하락(감가상각)까지 포함한 총소유비용은 TCO 계산기에서 확인하세요." },
            { q: "충전 단가는 무엇을 넣어야 하나요?", a: "평소 가장 많이 이용하는 충전 방식의 단가를 넣으면 됩니다. 완속·급속을 섞어 쓴다면 충전비 계산기에서 비율을 반영해 가중 평균 단가를 구한 뒤 입력하면 더 정확합니다." },
            { q: "전기차 자동차세가 13만원으로 고정인가요?", a: "전기차는 배기량이 없어 비영업용 기준 정액(지방교육세 포함 약 13만원)이 적용됩니다. 정책 변동 가능성이 있으므로 최신 기준을 함께 확인하세요." },
          ]}
          dataDate={CALC_DATA_DATE}
          sources={[
            { name: "테슬라 공식 — 차량 사양", url: "https://www.tesla.com/ko_kr" },
            { name: "자동차세 — 위택스/지방세 안내", url: "https://www.wetax.go.kr" },
          ]}
        />
      </div>
    </main>
  );
}
