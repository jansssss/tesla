import SwitchToTeslaCalculator from "@/components/calc/SwitchToTeslaCalculator";
import CalcContent from "@/components/calc/CalcContent";
import PurchaseCrossLinks from "@/components/calc/PurchaseCrossLinks";
import { CALC_DATA_DATE, CALC_DEFAULTS } from "@/lib/calcExtra";
import { getTrimById } from "@/lib/vehicleData";

export const metadata = {
  title: "내연기관 → 테슬라 전환 비교 계산기 — 월 절감액·회수 기간",
  description:
    "지금 타는 내연기관차의 월 유지비와 테슬라 전환 후 총비용을 비교합니다. 연료비·보험료·정비비·할부금을 입력해 월 절감액과 선수금 회수 기간을 계산하고, 연 주행거리별 손익분기점을 확인하세요.",
  openGraph: {
    title: "내연기관 → 테슬라 전환 비교 계산기",
    description: "내연기관 월 비용 vs 테슬라 월 비용 비교. 월 절감액과 회수 기간을 계산합니다.",
    url: "https://www.paytesla.kr/calc/switch-to-tesla",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/switch-to-tesla" },
};

const m3rwd = getTrimById("m3-rwd");
const myrwd = getTrimById("my-rwd");

const SECTIONS = [
  {
    heading: "갈아탈 때 실제로 바뀌는 비용은 네 갈래다",
    lead: "'전기차는 유지비가 싸다'는 말은 맞지만, 그 문장 하나로 전환을 결정하면 대부분 실망합니다. 지금 차에서 테슬라로 넘어갈 때 돈의 흐름은 네 갈래로 갈라지고, 이 중 둘은 줄어들지만 나머지 둘은 오히려 늘어나기 때문입니다.",
    blocks: [
      {
        type: "table",
        headers: ["항목", "전환 후 변화", "체감 크기"],
        rows: [
          ["연료비 → 충전비", "크게 감소", "절감액의 대부분이 여기서 나옴"],
          ["엔진 정비·소모품", "감소", "엔진오일·타이밍벨트·미션오일 항목이 사라짐"],
          ["월 할부금", "증가", "차값 차이가 그대로 월 부담으로 옮겨옴"],
          ["보험료", "소폭 증가", "차량가액이 오르면 자차 보험료가 따라 오름"],
        ],
        note: "타이어는 예외입니다. 전기차는 차체가 무겁고 초기 토크가 커서 마모가 빠른 편이라, 정비 항목이 줄어드는 대신 타이어 교체 주기는 짧아질 수 있습니다.",
      },
      {
        type: "text",
        paragraphs: [
          "이 계산기가 하는 일은 단순합니다. 지금 차의 월 비용(연료비 + 정비비 + 보험료)과 테슬라 전환 후 월 비용(충전비 + 정비비 + 보험료 + 할부금)을 같은 기준으로 나란히 세워 차액을 보여주는 것입니다.",
          "중요한 건 결과 숫자 자체보다 그 숫자가 어떤 가정 위에 서 있는지 아는 것입니다. 아래 항목들을 본인 상황에 맞게 조정할수록 결과가 현실에 가까워집니다.",
        ],
      },
    ],
  },
  {
    heading: "월 절감액이 착시가 되는 세 지점",
    lead: "계산 결과에 '월 30만원 절약'이 떴다고 해서 통장에 매달 30만원이 남는 것은 아닙니다. 실제로 가장 많이 어긋나는 지점 세 가지입니다.",
    blocks: [
      {
        type: "list",
        title: "1. 할부금을 비용에서 빼고 계산하는 경우",
        items: [
          "지금 차는 할부가 끝났는데 테슬라는 새로 할부를 시작한다면, 월 지출은 오히려 늘어납니다.",
          "이 계산기는 테슬라 할부금을 비용에 포함합니다. '유지비만 비교'하는 다른 계산과 결과가 다르게 나오는 이유입니다.",
          "할부가 끝난 뒤까지 보고 싶다면 총소유비용(TCO) 계산기로 보유 기간 전체를 다시 보는 편이 정확합니다.",
        ],
      },
      {
        type: "list",
        title: "2. 완속 전제로 계산해놓고 실제로는 급속을 쓰는 경우",
        items: [
          `완속 단가를 ${CALC_DEFAULTS.slowPrice}원/kWh, 급속을 ${CALC_DEFAULTS.fastPrice}원/kWh로 가정하면 단가만 30% 이상 차이 납니다.`,
          "집·직장에 완속 충전기가 없어 급속 위주로 쓰면 충전비가 계산값보다 눈에 띄게 올라갑니다.",
          "전환 판단에서 가장 먼저 확인할 것은 차값이 아니라 '내가 완속을 쓸 수 있는 환경인가'입니다.",
        ],
      },
      {
        type: "list",
        title: "3. 지금 차의 잔존가치를 계산에 넣지 않는 경우",
        items: [
          "타던 차를 팔면 목돈이 들어오고, 그 돈은 선수금이 되어 할부 원금을 줄입니다.",
          "반대로 할부가 남은 차라면 잔여 원금과 중도상환수수료를 먼저 정리해야 합니다.",
          "이 계산기의 월 절감액은 '차를 판 뒤' 기준으로 봐야 의미가 있습니다.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "가장 흔한 오해",
        text: "'월 절감액 × 60개월'은 전환 이익이 아닙니다. 절감액은 운영비 차이일 뿐이고, 여기서 차값 차이(늘어난 할부 원금)를 빼야 진짜 손익이 나옵니다. 아래 회수 기간 계산이 그 역할을 합니다.",
      },
    ],
  },
  {
    heading: "회수 기간을 계산하는 방법",
    lead: "전환에 추가로 들어간 돈을 매달 아끼는 돈으로 언제 다 갚는가 — 이것이 회수 기간입니다.",
    blocks: [
      {
        type: "formula",
        lines: [
          "월 절감액 = 내연차 월 비용 − 테슬라 월 비용",
          "추가 투입금 = 테슬라 선수금 − 기존 차량 매각액",
          "회수 기간(개월) = 추가 투입금 ÷ 월 절감액",
        ],
        note: "월 절감액이 0 이하이면 회수 기간은 성립하지 않습니다. 이 경우 전환은 비용 절감이 아니라 다른 이유(주행 질감, 정숙성, 충전 편의 등)로 판단해야 합니다.",
      },
      {
        type: "steps",
        title: "직접 넣어볼 순서",
        items: [
          "지금 차의 최근 3개월 주유비를 합쳐 3으로 나눕니다. 체감보다 영수증이 정확합니다.",
          "연 정비비는 최근 1년간 정비소·엔진오일 비용을 모두 더해 넣습니다.",
          "테슬라 쪽 충전비는 완속 비율을 솔직하게 잡습니다. 아파트 지하주차장에 충전기가 있어도 자리 경쟁이 심하면 완속 비율을 낮춰야 합니다.",
          "기존 차 매각액은 중고차 시세 조회의 '딜러 매입가'(개인 판매가 아님) 기준으로 넣습니다.",
          "회수 기간이 예상 보유 기간보다 짧게 나오면, 비용 관점에서 전환이 유리하다는 뜻입니다.",
        ],
      },
    ],
  },
  {
    heading: "연 주행거리가 전환 손익을 가른다",
    lead: "전환의 이득은 거의 전부 연료비 차이에서 나옵니다. 그래서 많이 탈수록 유리하고, 적게 타면 차값 차이를 회수하지 못합니다.",
    blocks: [
      {
        type: "table",
        headers: ["연 주행거리", "연료비 차이(대략)", "전환 판단"],
        rows: [
          ["5,000km 이하", "연 40만원 내외", "비용만 보면 전환 이유가 약함"],
          ["10,000km", "연 80만원 내외", "차값 차이가 작을 때만 유리"],
          ["15,000km", "연 120만원 내외", "일반적인 손익분기 구간"],
          ["20,000km 이상", "연 160만원 이상", "비용 측면에서 효과가 뚜렷"],
        ],
        note: `가솔린 ${CALC_DEFAULTS.ice.fuelEfficiency}km/L·${CALC_DEFAULTS.ice.fuelPrice.toLocaleString()}원/L, 전기차 전비 ${CALC_DEFAULTS.efficiency}km/kWh·완속 ${CALC_DEFAULTS.slowPrice}원/kWh 가정으로 구한 개략치입니다. 실제 값은 계산기에 본인 조건을 넣어 확인하세요.`,
      },
      {
        type: "text",
        paragraphs: [
          "표에서 보듯 연 5,000km 수준으로 타는 사람에게 전환은 비용 논리로 설명되지 않습니다. 절감액보다 차값 상승분이 훨씬 크기 때문에, 전환하더라도 '돈을 아끼려고'가 아니라 '차를 바꾸고 싶어서'라고 정리하는 편이 정직합니다.",
          "반대로 출퇴근이 왕복 60km 이상이거나 영업·출장이 잦아 연 2만km를 넘긴다면, 연료비 차이만으로 몇 년 안에 차값 차이의 상당 부분을 회수할 수 있습니다.",
        ],
      },
    ],
  },
  {
    heading: "지금 차를 파는 시점 판단",
    blocks: [
      {
        type: "compare",
        columns: [
          {
            title: "지금 파는 게 유리한 신호",
            tone: "good",
            items: [
              "보증 기간이 곧 끝나고 큰 정비가 예정돼 있다",
              "주행거리가 10만km에 가까워지고 있다 (시세 하락 구간)",
              "할부가 이미 끝났거나 잔여 원금이 적다",
              "타이어·브레이크 등 목돈 지출이 임박했다",
            ],
          },
          {
            title: "미루는 게 나은 신호",
            tone: "bad",
            items: [
              "할부 잔여 기간이 길고 중도상환수수료가 크다",
              "최근 큰 정비를 마쳐 당분간 추가 지출이 없다",
              "연 주행거리가 5,000km 이하다",
              "집·직장 어느 쪽에도 완속 충전 환경이 없다",
            ],
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "특히 마지막 항목은 비용 계산보다 앞섭니다. 완속 충전 환경 없이 전환하면 충전비가 계산값보다 올라가고, 무엇보다 매주 급속 충전소를 찾아다니는 시간이 듭니다. 이 계산기가 숫자로 보여주지 못하는 비용입니다.",
        ],
      },
    ],
  },
  {
    heading: "전환을 검토할 때 자주 나오는 질문",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "지금 차 할부가 남았는데 갈아탈 수 있나요?",
            a: "가능합니다. 다만 차를 팔 때 잔여 할부 원금을 먼저 상환해야 하고, 계약에 따라 중도상환수수료가 붙습니다. 매각액에서 잔여 원금과 수수료를 뺀 금액이 실제로 손에 쥐는 돈이며, 그 금액을 계산기의 기존 차량 매각액 자리에 넣어야 결과가 맞습니다.",
          },
          {
            q: "보험료는 얼마나 오르나요?",
            a: "자차 보험료는 차량가액에 연동되므로 차값이 오르면 함께 오릅니다. 다만 인상 폭은 운전 경력·사고 이력·연령에 따라 편차가 커서 일률적으로 말하기 어렵습니다. 가입 중인 보험사에서 해당 차종으로 가견적을 받아 그 숫자를 직접 넣는 것이 가장 정확합니다.",
          },
          {
            q: "테슬라는 정비비가 정말 안 드나요?",
            a: "엔진오일·점화플러그·타이밍벨트·미션오일 같은 내연기관 고유 소모품이 없어 정기 정비 항목 자체가 줄어드는 것은 사실입니다. 다만 타이어는 마모가 빠른 편이고 와이퍼·에어컨 필터·브레이크액 등은 동일하게 교체가 필요합니다. 정비비가 0이 되는 것이 아니라 항목이 줄어드는 것으로 보는 편이 정확합니다.",
          },
          {
            q: "보조금은 이 계산에 어떻게 반영되나요?",
            a: "이 계산기는 전환 전후의 월 비용 비교에 집중합니다. 보조금이 반영된 실구매가와 그에 따른 정확한 할부 월납입금은 지역별 보조금이 자동 적용되는 실구매가 계산기에서 먼저 구한 뒤, 그 값을 이 계산기의 테슬라 할부금 자리에 넣으면 두 계산이 맞물립니다.",
          },
          {
            q: "어떤 모델로 갈아타는 게 비용상 유리한가요?",
            a: `보조금 적용 전 출고가 기준으로 ${m3rwd.trimFull}가 ${(m3rwd.priceKrw / 10000).toLocaleString()}만원, ${myrwd.trimFull}가 ${(myrwd.priceKrw / 10000).toLocaleString()}만원입니다. 차값이 낮을수록 할부 부담이 줄어 회수 기간이 짧아지므로, 순수 비용 관점에서는 RWD 트림이 유리합니다. 적재 공간이나 가족 구성 때문에 Model Y가 필요하다면 모델 비교 계산기에서 두 모델의 5년 총비용 차이를 먼저 확인해보세요.`,
          },
        ],
      },
    ],
  },
];

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
            지금 타는 차의 월 비용과 테슬라 전환 후 비용을 나란히 비교합니다. 월 절감액과 선수금
            회수 기간을 확인하고, 아래 해설에서 그 숫자를 어떻게 읽어야 하는지 함께 보세요.
          </p>
        </header>
        <SwitchToTeslaCalculator dataDate={CALC_DATA_DATE} />
      </div>

      <PurchaseCrossLinks
        items={[
          {
            href: "/subsidy",
            label: "테슬라 실구매가·월납입금 계산기",
            desc: "전환 비교의 출발점입니다. 지역별 보조금이 적용된 실구매가와 정확한 할부 월납입금을 먼저 구하세요.",
          },
          {
            href: "/calc/tco",
            label: "총소유비용(TCO) 계산기",
            desc: "할부가 끝난 뒤까지 포함해 감가상각과 운영비를 합산한 장기 손익을 확인합니다.",
          },
          {
            href: "/calc/charging",
            label: "충전비 계산기",
            desc: "전환 손익의 핵심 변수인 월 충전비를 완속·급속 비율에 따라 정확히 구합니다.",
          },
        ]}
      />

      <div className="mt-10">
        <CalcContent
          sections={SECTIONS}
          currentHref="/calc/switch-to-tesla"
          dataDate={CALC_DATA_DATE}
          dataNote="연료비·정비비·보험료 기본값은 공개 자료를 바탕으로 한 가정값입니다. 전환 손익은 주행 습관과 충전 환경에 따라 크게 달라지므로 반드시 본인 조건으로 바꿔 계산하세요."
          relatedHeading="전환을 결정하기 전에 함께 볼 계산기"
          sources={[
            {
              name: "오피넷 — 전국 평균 유가",
              url: "https://www.opinet.co.kr",
              note: "휘발유 단가 가정 근거",
            },
            {
              name: "무공해차 통합누리집",
              url: "https://ev.or.kr",
              note: "보조금·충전 인프라 공식 정보",
            },
            {
              name: "테슬라 공식 홈페이지",
              url: "https://www.tesla.com/ko_kr",
              note: "차량 가격·주행거리",
            },
          ]}
        />
      </div>
    </main>
  );
}
