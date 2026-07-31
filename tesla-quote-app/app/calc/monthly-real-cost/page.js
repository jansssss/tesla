import MonthlyRealCostCalculator from "@/components/calc/MonthlyRealCostCalculator";
import CalcContent from "@/components/calc/CalcContent";
import PurchaseCrossLinks from "@/components/calc/PurchaseCrossLinks";
import { CALC_DATA_DATE, CALC_DEFAULTS } from "@/lib/calcExtra";

export const metadata = {
  title: "테슬라 월 실제 부담금 계산기 — 할부+충전비+보험 합산",
  description:
    "할부 월납입금에 충전비·보험료·자동차세를 합산한 월 실제 부담금을 계산합니다. 선수금과 할부 기간이 월 부담에 어떻게 작용하는지, 소득 대비 적정선은 어디인지까지 함께 확인하세요.",
  openGraph: {
    title: "테슬라 월 실제 부담금 계산기",
    description: "월납입금 + 충전비 + 보험료 + 자동차세 = 월 실제 부담금 계산.",
    url: "https://www.paytesla.kr/calc/monthly-real-cost",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/monthly-real-cost" },
};

const SECTIONS = [
  {
    heading: "'월 얼마'라는 질문에 할부금만 답하면 절반이 빠진다",
    lead: "차를 알아볼 때 가장 먼저 떠올리는 숫자는 할부 월납입금입니다. 그런데 실제로 매달 통장에서 빠져나가는 돈은 그보다 큽니다. 차를 굴리는 데 드는 고정비가 따로 붙기 때문입니다.",
    blocks: [
      {
        type: "formula",
        lines: [
          "월 실제 부담금",
          "  = 할부 월납입금",
          "  + 월 충전비",
          "  + 월 보험료  (연 보험료 ÷ 12)",
          "  + 월 자동차세 (연 자동차세 ÷ 12)",
        ],
        note: "보험료와 자동차세는 실제로는 연 단위나 분기 단위로 납부하지만, 월 부담을 가늠하려면 12로 나눠 매달의 비용으로 환산해 보는 것이 현실적입니다.",
      },
      {
        type: "text",
        paragraphs: [
          "많은 사람이 할부금 기준으로 예산을 잡았다가, 인수 후 첫 1년에 '생각보다 돈이 더 나간다'고 느낍니다. 빠져 있던 항목이 위의 세 가지입니다.",
          "이 계산기는 그 네 가지를 한 화면에서 합산합니다. 결과로 나오는 숫자가 실제 월 생활비에서 차가 가져가는 몫이라고 보면 됩니다.",
        ],
      },
    ],
  },
  {
    heading: "네 항목이 각각 어떻게 움직이는가",
    blocks: [
      {
        type: "table",
        headers: ["항목", "무엇에 따라 달라지나", "조정 여지"],
        rows: [
          ["할부금", "실구매가·선수금·금리·할부 기간", "큼 — 선수금과 기간으로 조절 가능"],
          ["충전비", "주행거리·전비·완속/급속 비율", "중간 — 충전 습관으로 조절 가능"],
          ["보험료", "차량가액·운전 경력·사고 이력·연령", "작음 — 특약·자기부담금으로 소폭"],
          ["자동차세", "전기차는 배기량이 없어 정액 부과", "없음 — 고정"],
        ],
        note: `기본값은 전비 ${CALC_DEFAULTS.efficiency}km/kWh, 연 보험료 ${(CALC_DEFAULTS.insurancePerYear / 10000).toLocaleString()}만원, 연 자동차세 ${(CALC_DEFAULTS.taxPerYear / 10000).toLocaleString()}만원 가정입니다. 보험료는 개인 편차가 가장 큰 항목이므로 가견적을 받아 직접 넣는 것을 권합니다.`,
      },
      {
        type: "text",
        paragraphs: [
          "표에서 보듯 월 부담을 실제로 줄일 수 있는 지렛대는 사실상 할부금 하나입니다. 충전비는 습관으로 어느 정도 조절되지만 절대액이 크지 않고, 자동차세는 손댈 수 없습니다.",
          "그래서 '월 부담을 낮추고 싶다'는 요구는 대부분 '선수금을 얼마나 넣고 할부를 몇 개월로 할 것인가'의 문제로 수렴합니다.",
        ],
      },
    ],
  },
  {
    heading: "선수금과 할부 기간, 어느 쪽을 건드릴 것인가",
    lead: "월 납입금을 줄이는 방법은 두 가지입니다. 목돈을 더 넣거나(선수금), 기간을 늘리거나(할부 개월). 둘의 성격은 완전히 다릅니다.",
    blocks: [
      {
        type: "compare",
        columns: [
          {
            title: "선수금을 늘리면",
            tone: "good",
            items: [
              "할부 원금이 줄어 총 이자도 함께 줄어든다",
              "월 납입금이 내려가고 총 지불액도 내려간다",
              "단점: 당장 목돈이 묶여 유동성이 줄어든다",
              "비상 자금까지 털어 넣는 것은 권하지 않는다",
            ],
          },
          {
            title: "할부 기간을 늘리면",
            tone: "bad",
            items: [
              "월 납입금은 내려가지만 총 이자는 늘어난다",
              "60개월 → 72개월로 늘리면 월 부담은 줄지만 총 지불액은 증가",
              "차의 감가 속도보다 상환 속도가 느려질 수 있다",
              "중고로 팔 때 잔여 원금이 시세보다 높아지는 상황이 생긴다",
            ],
          },
        ],
      },
      {
        type: "callout",
        title: "실무적인 기준",
        text: "여유 자금이 있다면 선수금을 늘리는 쪽이 거의 항상 유리합니다. 기간 연장은 월 현금 흐름이 정말 빠듯할 때만 쓰는 카드로 두는 편이 좋습니다. 계산기에서 두 값을 번갈아 바꿔보면 총 지불액이 어떻게 달라지는지 바로 보입니다.",
      },
    ],
  },
  {
    heading: "소득 대비 적정선은 어디인가",
    lead: "정해진 규칙은 없지만, 가계 재무에서 통용되는 대략적인 기준선은 있습니다. 절대적인 기준이 아니라 자기 점검용 눈금으로 쓰세요.",
    blocks: [
      {
        type: "table",
        headers: ["월 실제 부담금 / 월 실수령액", "해석"],
        rows: [
          ["10% 이하", "여유 있는 구간"],
          ["10~15%", "일반적으로 무리 없는 구간"],
          ["15~20%", "다른 고정지출이 적어야 유지 가능"],
          ["20% 초과", "주거비·대출이 겹치면 부담이 커지는 구간"],
        ],
        note: "월 실수령액(세후) 기준입니다. 주택담보대출·전세자금대출 등 다른 고정 상환이 있다면 그 합계까지 함께 봐야 합니다.",
      },
      {
        type: "text",
        paragraphs: [
          "이 비율에 정답은 없습니다. 대중교통 접근성이 나빠 차가 필수인 지역과, 차가 없어도 생활이 되는 지역은 같은 20%라도 의미가 다릅니다.",
          "다만 계산 결과가 20%를 크게 넘는다면 트림을 한 단계 낮추거나, 선수금을 더 모은 뒤 구매 시점을 미루는 선택지를 함께 놓고 보는 것이 좋습니다.",
        ],
      },
    ],
  },
  {
    heading: "이 계산에 포함되지 않은 비용",
    lead: "월 부담금이라는 이름으로 매달 나가는 돈만 담았습니다. 실제 소유에는 아래 항목들이 추가로 듭니다.",
    blocks: [
      {
        type: "list",
        items: [
          "취득세·등록비 — 구매 시점에 한 번 발생하는 초기 비용입니다.",
          "타이어 교체 — 전기차는 마모가 빠른 편이라 몇 년에 한 번 목돈이 나갑니다.",
          "홈 충전기 설치비 — 단독주택이나 개별 설치가 필요한 경우 초기 비용이 발생합니다.",
          "감가상각 — 매달 현금이 나가지는 않지만 실제로는 가장 큰 비용입니다.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "감가상각을 빠뜨리지 마세요",
        text: "월 부담금이 아무리 낮아도, 5년 뒤 차값이 절반이 됐다면 그 손실은 실제 비용입니다. 감가까지 포함한 진짜 소유 비용은 총소유비용(TCO) 계산기에서 확인할 수 있습니다.",
      },
    ],
  },
  {
    heading: "월 부담금에 대해 자주 묻는 것들",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "여기 나온 할부금과 실제 캐피탈 견적이 다릅니다.",
            a: "이 계산기는 원리금균등 방식으로 순수 이자만 반영합니다. 실제 캐피탈 상품에는 취급수수료, 보증보험료, 인지대 등이 붙을 수 있고 신용등급에 따라 적용 금리도 달라집니다. 견적서를 받았다면 그 월납입금을 계산기에 직접 입력해 나머지 항목과 합산하는 편이 정확합니다.",
          },
          {
            q: "전기차 자동차세는 왜 배기량과 무관한가요?",
            a: "자동차세는 배기량을 기준으로 부과하는데 전기차는 배기량이 없어 별도의 정액 기준이 적용됩니다. 그래서 같은 가격대의 내연기관차보다 자동차세 부담이 낮은 편입니다. 지방교육세가 함께 부과되므로 실제 납부액은 본세보다 조금 큽니다.",
          },
          {
            q: "보조금은 월 부담금을 얼마나 낮추나요?",
            a: "보조금은 차값에서 직접 차감되어 할부 원금을 줄이므로, 월 납입금도 그만큼 내려갑니다. 다만 보조금 액수는 거주 지역과 트림에 따라 크게 다릅니다. 정확한 지역별 보조금과 그것이 반영된 월납입금은 실구매가 계산기에서 확인하세요.",
          },
          {
            q: "충전비를 더 낮출 방법이 있나요?",
            a: "가장 큰 변수는 완속 충전 비율입니다. 급속 대신 완속을 쓸수록 kWh당 단가가 내려갑니다. 심야 시간대 요금제를 적용받을 수 있는 환경이라면 추가로 절감 여지가 있습니다. 완속·급속 비율에 따른 차이는 충전비 계산기에서 비율을 조정해가며 확인할 수 있습니다.",
          },
        ],
      },
    ],
  },
];

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
            할부금만이 아닌 충전비·보험료·자동차세까지 합산한 <strong>실제 월 지출액</strong>을
            계산합니다. 아래 해설에서 선수금·할부 기간을 어떻게 조합해야 하는지도 함께 확인하세요.
          </p>
        </header>
        <MonthlyRealCostCalculator dataDate={CALC_DATA_DATE} />
      </div>

      <PurchaseCrossLinks
        items={[
          {
            href: "/",
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

      <div className="mt-10">
        <CalcContent
          sections={SECTIONS}
          currentHref="/calc/monthly-real-cost"
          dataDate={CALC_DATA_DATE}
          dataNote="보험료·자동차세·전비 기본값은 공개 자료를 바탕으로 한 가정값이며 실제 금액과 다를 수 있습니다. 특히 보험료는 개인별 편차가 가장 큰 항목이므로 가견적 금액으로 바꿔 계산하세요."
          relatedHeading="월 부담을 정확히 잡으려면 함께 볼 계산기"
          sources={[
            {
              name: "테슬라 공식 홈페이지",
              url: "https://www.tesla.com/ko_kr",
              note: "차량 가격 기준",
            },
            {
              name: "무공해차 통합누리집",
              url: "https://ev.or.kr",
              note: "보조금 및 충전 요금 정보",
            },
          ]}
        />
      </div>
    </main>
  );
}
