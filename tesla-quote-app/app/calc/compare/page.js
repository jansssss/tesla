import CompareCalculator from "@/components/calc/CompareCalculator";
import CalcArticle from "@/components/calc/CalcArticle";
import PurchaseCrossLinks from "@/components/calc/PurchaseCrossLinks";
import { CALC_DATA_DATE } from "@/lib/calcExtra";

export const metadata = {
  title: "테슬라 Model 3 vs Model Y 비교 계산기 — 실구매가·월납입금·유지비·5년 총비용",
  description:
    "Model 3와 Model Y의 트림·보조금·금융 조건을 입력해 실구매가, 월납입금, 연 유지비, 5년 총비용을 한 표로 비교합니다.",
  openGraph: {
    title: "테슬라 모델 비교 계산기 — Model 3 vs Model Y",
    description: "실구매가·월납입금·유지비·5년 총비용을 동시에 비교합니다.",
    url: "https://www.paytesla.kr/calc/compare",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/compare" },
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <header className="mb-8">
          <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            모델 비교 계산기
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            Model 3 vs Model Y 비교 계산기
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
            트림과 보조금, 금융 조건을 입력하면 두 모델의 실구매가·월납입금·유지비·5년 총비용을 한 표로 비교합니다.
          </p>
        </header>
        <CompareCalculator />
      </div>

      <PurchaseCrossLinks
        items={[
          {
            href: "/",
            label: "테슬라 보조금 계산기",
            desc: "두 모델 각각에 적용되는 지역별 국고·지자체 보조금을 정확히 확인한 뒤 비교에 반영하세요.",
          },
          {
            href: "/calc/maintenance",
            label: "유지비 계산기",
            desc: "선택한 모델의 월·연 유지비(충전비·보험료·자동차세)를 따로 계산합니다.",
          },
          {
            href: "/calc/tco",
            label: "총소유비용(TCO) 계산기",
            desc: "감가상각까지 포함한 5년 총소유비용을 내연기관차와 비교합니다.",
          },
        ]}
      />

      <div className="mt-12">
        <CalcArticle
          currentHref="/calc/compare"
          intro={
            "Model 3와 Model Y는 가격대가 겹쳐 단순히 출고가만으로 고르기 어렵습니다. 보조금, 월 납입금, 유지비, 그리고 5년 뒤까지의 총비용을 함께 봐야 내 조건에 맞는 선택이 보입니다.\n\n이 비교 계산기는 두 모델의 트림을 고르고 동일한 금융·주행 조건을 적용해, 네 가지 핵심 지표를 나란히 비교합니다. 더 낮은(유리한) 값은 초록색으로 표시됩니다."
          }
          inputs={[
            { name: "Model 3 / Model Y 트림", desc: "비교할 트림을 각각 선택합니다. 선택 시 출고가가 자동 반영됩니다." },
            { name: "보조금(만원)", desc: "각 모델에 적용할 보조금입니다. 지역에 따라 다르므로 실구매가 계산기에서 확인한 값을 넣으면 정확합니다." },
            { name: "선수금·금리·할부(개월)", desc: "월 납입금 계산에 쓰이는 금융 조건입니다. 두 모델에 동일하게 적용됩니다." },
            { name: "연 주행거리(km)", desc: "연 유지비와 5년 총비용 계산에 사용됩니다." },
          ]}
          formula={[
            "실구매가 = 출고가 − 보조금",
            "월 납입금 = 원리금균등(실구매가 − 선수금, 금리, 개월)",
            "연 유지비 = 충전비 + 보험료 + 자동차세 (전비 Model 3 6.0 · Model Y 5.0 km/kWh)",
            "5년 총비용 = 실구매가 + (연 유지비 × 5)",
          ]}
          example={{
            lead: "Model 3 RWD(보조금 680만)와 Model Y RWD(보조금 700만), 선수금 1,000만·금리 3.6%·60개월·연 15,000km로 비교하면:",
            steps: [
              "Model 3 RWD 실구매가 = 4,699만 − 680만 = 4,019만원",
              "Model Y RWD 실구매가 = 4,999만 − 700만 = 4,299만원",
              "두 모델의 월 납입금·연 유지비·5년 총비용이 표로 나란히 계산됩니다.",
            ],
            result: "→ 보통 Model 3가 실구매가·월납입금에서 유리, Model Y는 적재공간·실용성에서 우위. 표의 초록색으로 유리한 항목을 확인하세요.",
          }}
          faqs={[
            { q: "보조금이 모델마다 다른 이유는?", a: "국고보조금은 차량 가격·효율에 따라, 지방보조금은 지역에 따라 달라집니다. 정확한 값은 실구매가·월납입금 계산기에서 지역을 선택해 확인하세요." },
            { q: "5년 총비용에 감가상각은 포함되나요?", a: "이 비교 표의 5년 총비용은 실구매가 + 5년 유지비입니다. 잔존가치(감가상각)까지 반영한 총소유비용은 TCO 계산기에서 확인할 수 있습니다." },
            { q: "전비는 어떤 값이 쓰이나요?", a: "Model 3는 6.0, Model Y는 5.0 km/kWh를 기본 가정값으로 사용합니다. 실제 전비는 계절·운전 습관에 따라 달라집니다." },
          ]}
          dataDate={CALC_DATA_DATE}
          sources={[
            { name: "테슬라 공식 — 차량 가격·사양", url: "https://www.tesla.com/ko_kr" },
            { name: "환경부 무공해차 통합누리집", url: "https://www.ev.or.kr" },
          ]}
        />
      </div>
    </main>
  );
}
