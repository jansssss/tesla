import TcoCalculator from "@/components/calc/TcoCalculator";
import CalcArticle from "@/components/calc/CalcArticle";
import { CALC_DATA_DATE } from "@/lib/calcExtra";

export const metadata = {
  title: "테슬라 총소유비용(TCO) 계산기 — 내연기관 대비 차이",
  description:
    "차량 가격·보조금·감가상각·보험료·충전비·보유기간으로 테슬라 총소유비용(TCO)을 계산하고, 동급 내연기관차와 비교합니다.",
  openGraph: {
    title: "테슬라 총소유비용(TCO) 계산기",
    description: "감가상각·운영비를 합산한 총소유비용과 내연기관 대비 차이를 계산합니다.",
    url: "https://paytesla.kr/calc/tco",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://paytesla.kr/calc/tco" },
};

export default function TcoPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_22%,#ffffff_100%)] py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <header className="mb-8">
          <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            총소유비용 계산기
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            테슬라 총소유비용(TCO) 계산기
          </h1>
          <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
            구매가뿐 아니라 감가상각과 운영비까지 합산한 실제 소유 비용을 계산하고, 동급 내연기관차와 비교합니다.
          </p>
        </header>
        <TcoCalculator />
      </div>

      <div className="mt-12">
        <CalcArticle
          currentHref="/calc/tco"
          intro={
            "총소유비용(TCO, Total Cost of Ownership)은 '차를 사서 일정 기간 타고 팔 때까지' 실제로 부담하는 전체 비용입니다. 출고가나 월 납입금만 보면 놓치기 쉬운 감가상각과 운영비를 함께 봐야 진짜 비용이 보입니다.\n\n이 계산기는 초기 실구매가에서 보유 후 잔존가치를 빼 실제 가치 손실(감가상각비)을 구하고, 여기에 보험료·충전비 같은 운영비를 더해 총비용을 산출합니다. 동급 내연기관차와 비교해 전기차가 실제로 더 저렴한지도 확인할 수 있습니다."
          }
          inputs={[
            { name: "차량 가격(원)", desc: "보조금 적용 전 출고가입니다." },
            { name: "보조금(원)", desc: "국고+지방 보조금 합계입니다. 정확한 지역별 보조금은 실구매가 계산기에서 확인할 수 있습니다." },
            { name: "연 감가상각률(%)", desc: "매년 차량 가치가 줄어드는 비율입니다. 잔존가치 = 차량가 × (1−율)^보유연수로 계산합니다. 테슬라는 일반적으로 연 10~15% 수준으로 가정합니다." },
            { name: "연 보험료·연 충전비(원)", desc: "매년 지출하는 운영비입니다. 충전비는 충전비 계산기로 구한 연 충전비를 넣으면 정확합니다." },
            { name: "보유기간(년)", desc: "차량을 보유할 예정 기간입니다. 보통 3~5년을 많이 사용합니다." },
            { name: "비교 내연차 가격(원)", desc: "동급 가솔린차의 출고가입니다. 연비 12km/L·휘발유 1,700원/L·정비비 연 60만원 가정으로 내연 총비용을 계산해 비교합니다." },
          ]}
          formula={[
            "잔존가치 = 차량가 × (1 − 감가상각률)^보유연수",
            "감가상각비 = (차량가 − 보조금) − 잔존가치",
            "운영비 = (연 보험료 + 연 충전비) × 보유연수",
            "총비용 = 감가상각비 + 운영비",
            "월 평균 = 총비용 ÷ (보유연수 × 12)",
          ]}
          example={{
            lead: "차량가 4,999만원, 보조금 700만원, 감가율 12%, 보험 120만원, 충전비 72만원, 5년 보유로 가정하면:",
            steps: [
              "잔존가치 = 49,990,000 × (0.88)^5 ≈ 26,400,000원",
              "감가상각비 = (49,990,000 − 7,000,000) − 26,400,000 ≈ 16,590,000원",
              "운영비 = (1,200,000 + 720,000) × 5 = 9,600,000원",
              "총비용 ≈ 26,190,000원, 월 평균 ≈ 436,000원",
            ],
            result: "→ 5년 총소유비용 약 2,619만원, 월 평균 약 43.6만원 (내연차 비교는 계산기에서 확인)",
          }}
          faqs={[
            { q: "감가상각비를 왜 비용에 넣나요?", a: "차를 타는 동안 줄어든 차량 가치는 실제로 손실된 돈입니다. 5년 뒤 되팔 때 받는 금액(잔존가치)을 빼야 진짜 부담한 비용이 나옵니다." },
            { q: "내연기관 대비 차이는 어떻게 계산되나요?", a: "비교 내연차도 같은 방식으로 감가상각비와 운영비(연료비+정비비+보험료)를 계산한 뒤 전기차 총비용과의 차이를 보여줍니다. 연료비·정비비 가정값은 페이지 하단 출처를 참고하세요." },
            { q: "할부 이자는 포함되나요?", a: "이 계산기는 현금 기준 총소유비용을 봅니다. 할부 이자까지 포함한 월 납입금은 실구매가·월납입금 계산기에서 확인하세요." },
          ]}
          dataDate={CALC_DATA_DATE}
          sources={[
            { name: "오피넷 — 전국 평균 유가", url: "https://www.opinet.co.kr" },
            { name: "테슬라 공식 — 차량 가격", url: "https://www.tesla.com/ko_kr" },
          ]}
        />
      </div>
    </main>
  );
}
