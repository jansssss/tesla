import ChargingCalculator from "@/components/calc/ChargingCalculator";
import CalcContent from "@/components/calc/CalcContent";
import PurchaseCrossLinks from "@/components/calc/PurchaseCrossLinks";
import { CALC_DATA_DATE, CALC_DEFAULTS } from "@/lib/calcExtra";
import { getTrimById } from "@/lib/vehicleData";

export const metadata = {
  title: "테슬라 충전비 계산기 — 월·연 충전 비용",
  description:
    "월 주행거리·전비·급속/완속 비율과 단가를 입력해 테슬라 월·연 충전비를 계산합니다. 완속과 급속의 단가 차이, 슈퍼차저 비용, 겨울철 전비 하락까지 감안한 실제 충전비를 확인하세요.",
  openGraph: {
    title: "테슬라 충전비 계산기 — 월·연 충전 비용",
    description: "주행거리·전비·급속/완속 비율로 테슬라 충전비를 계산합니다.",
    url: "https://www.paytesla.kr/calc/charging",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/calc/charging" },
};

const m3rwd = getTrimById("m3-rwd");

const SECTIONS = [
  {
    heading: "충전비를 결정하는 건 주행거리가 아니라 충전 장소다",
    lead: "같은 거리를 달려도 어디서 충전했느냐에 따라 월 비용이 두 배 가까이 벌어집니다. 전기차 충전비 계산에서 가장 자주 빠뜨리는 변수입니다.",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "충전비는 '얼마나 달렸는가'와 '1kWh를 얼마에 샀는가'의 곱입니다. 앞의 값은 주행거리와 전비로 정해지지만, 뒤의 값은 전적으로 충전 장소에 달려 있습니다.",
          "집이나 직장의 완속 충전기를 주로 쓰는 사람과, 공공 급속·슈퍼차저에 의존하는 사람은 같은 차로 같은 거리를 달려도 전혀 다른 금액을 냅니다. 이 계산기가 급속·완속 비율을 따로 받는 이유입니다.",
        ],
      },
      {
        type: "formula",
        lines: [
          "월 충전량(kWh) = 월 주행거리 ÷ 전비",
          "가중 평균 단가 = (급속% × 급속단가 + 완속% × 완속단가) ÷ 100",
          "월 충전비 = 월 충전량 × 가중 평균 단가",
          "연 충전비 = 월 충전비 × 12",
        ],
        note: "비율 합계가 100%가 아니어도 가중 평균으로 계산되지만, 합계를 100%로 맞추면 결과 해석이 명확해집니다.",
      },
    ],
  },
  {
    heading: "충전 방식별 단가와 성격",
    lead: "단가는 사업자·요금제·시간대에 따라 달라지므로 아래는 대략적인 범위입니다. 실제 이용하는 사업자의 최신 요금표를 확인해 계산기에 직접 넣는 것이 가장 정확합니다.",
    blocks: [
      {
        type: "table",
        headers: ["충전 방식", "대략적인 단가 범위", "주 용도"],
        rows: [
          ["가정용 완속(개별 설치)", "100원대~", "밤새 충전, 가장 저렴한 편"],
          ["공용 완속(아파트·직장)", "200~300원대", "일상 충전의 주력"],
          ["공공 급속", "300~400원대", "이동 중 보급"],
          ["슈퍼차저", "400원대~", "장거리 이동 중 고속 보급"],
        ],
        note: "멤버십 가입, 카드 할인, 시간대별 요금제에 따라 실제 부담 단가는 위 범위에서 벗어날 수 있습니다. 기본값은 완속 " + CALC_DEFAULTS.slowPrice + "원/kWh, 급속 " + CALC_DEFAULTS.fastPrice + "원/kWh 가정입니다.",
      },
      {
        type: "text",
        paragraphs: [
          "표에서 눈여겨볼 것은 완속과 급속의 단가 차이입니다. 완속 비중을 10%포인트 올릴 때마다 가중 평균 단가가 내려가고, 그 효과가 매달 반복됩니다.",
          "슈퍼차저는 단가가 높지만 장거리 이동에서의 시간 가치를 생각하면 합리적인 선택일 수 있습니다. 문제는 이것을 일상 충전으로 쓰는 경우입니다. 그러면 전기차의 연료비 이점이 상당 부분 사라집니다.",
        ],
      },
      {
        type: "callout",
        title: "완속 비율 70%가 기준선",
        text: "일반적으로 완속 70% / 급속 30% 정도면 전기차의 연료비 이점을 충분히 누린다고 볼 수 있습니다. 완속 비율이 50% 아래로 내려간다면 충전 환경을 다시 점검해볼 필요가 있습니다.",
      },
    ],
  },
  {
    heading: "전비는 계절과 주행 습관에 따라 움직인다",
    lead: "계산기에 넣는 전비 값이 현실과 다르면 결과 전체가 어긋납니다. 인증 전비를 그대로 넣지 말고, 실제 조건을 반영하세요.",
    blocks: [
      {
        type: "list",
        title: "전비를 떨어뜨리는 요인",
        items: [
          "겨울철 저온 — 배터리 효율이 떨어지고 실내 난방에 전력을 씁니다. 전기차 공통 특성입니다.",
          "고속 정속 주행 — 속도가 높을수록 공기 저항이 커져 도심 주행보다 전비가 나빠지는 경우가 많습니다.",
          "급가속이 잦은 운전 습관 — 토크가 큰 만큼 전력 소모도 큽니다.",
          "에어컨·히터 상시 사용 — 특히 히터는 여름 에어컨보다 전력 소모가 큰 편입니다.",
        ],
      },
      {
        type: "list",
        title: "전비를 지키는 방법",
        items: [
          "출발 전 프리컨디셔닝으로 배터리와 실내를 미리 데워두면 주행 중 손실을 줄일 수 있습니다.",
          "회생 제동을 적극적으로 쓰면 감속 시 에너지를 일부 회수할 수 있습니다.",
          "타이어 공기압을 규정치로 유지하면 구름 저항이 줄어듭니다.",
          "겨울에는 좌석 열선이 실내 히터보다 전력 효율이 좋은 편입니다.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "겨울 충전비를 따로 계산해보세요",
        text: `연평균 전비로 한 번 계산한 뒤, 전비를 20~30% 낮춘 값으로 다시 계산해보면 겨울철 월 충전비의 상한선을 가늠할 수 있습니다. 예산을 잡을 때는 이 상한선을 기준으로 두는 편이 안전합니다.`,
      },
    ],
  },
  {
    heading: "월 주행거리별 충전비 감각 잡기",
    lead: `${m3rwd.trimFull} 기준(전비 ${CALC_DEFAULTS.efficiency}km/kWh, 완속 70%·급속 30% 가정)으로 대략적인 월 충전비를 정리했습니다.`,
    blocks: [
      {
        type: "table",
        headers: ["월 주행거리", "월 충전량(대략)", "월 충전비(대략)"],
        rows: [
          ["500km", "약 91 kWh", "약 3.0만원"],
          ["1,000km", "약 182 kWh", "약 6.0만원"],
          ["1,250km (연 1.5만km)", "약 227 kWh", "약 7.5만원"],
          ["2,000km", "약 364 kWh", "약 12.0만원"],
        ],
        note: `가중 평균 단가 330원/kWh(완속 ${CALC_DEFAULTS.slowPrice}원 70% + 급속 ${CALC_DEFAULTS.fastPrice}원 30%) 가정으로 계산한 개략치입니다. 실제 값은 위 계산기에 본인 조건을 넣어 확인하세요.`,
      },
      {
        type: "text",
        paragraphs: [
          "동급 가솔린차(연비 " + CALC_DEFAULTS.ice.fuelEfficiency + "km/L, 휘발유 " + CALC_DEFAULTS.ice.fuelPrice.toLocaleString() + "원/L 가정)로 같은 1,250km를 달리면 연료비는 약 17.7만원입니다. 위 표의 7.5만원과 비교하면 월 10만원 안팎의 차이가 납니다.",
          "이 차이가 전기차 전환의 경제적 근거 대부분을 차지합니다. 그래서 주행거리가 많을수록 전기차가 유리하고, 적게 타면 차값 차이를 회수하기 어려워집니다.",
        ],
      },
    ],
  },
  {
    heading: "충전비에 대해 자주 묻는 것들",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "완속과 급속 단가는 보통 얼마인가요?",
            a: "가정용·공용 완속은 100~300원대, 공공 급속은 300~400원대, 슈퍼차저는 400원대 이상인 경우가 많습니다. 다만 충전사업자와 요금제, 멤버십 할인, 시간대에 따라 편차가 크므로 실제 이용하는 사업자의 최신 요금표를 확인해 계산기에 직접 입력하는 것이 정확합니다.",
          },
          {
            q: "비율 합계가 100%가 아니어도 되나요?",
            a: "가중 평균 방식이라 합계가 100%가 아니어도 비율대로 계산됩니다. 다만 합계를 100%로 맞추면 '내 충전의 몇 %가 완속인가'가 명확해져 결과를 해석하기 쉽습니다.",
          },
          {
            q: "인증 전비를 그대로 넣어도 되나요?",
            a: "권하지 않습니다. 인증 전비는 표준 조건에서 측정한 값이라 실제 주행에서는 이보다 낮게 나오는 경우가 일반적입니다. 차량 화면에 표시되는 최근 평균 전비를 넣거나, 인증값보다 다소 낮춘 값을 쓰는 편이 현실적입니다.",
          },
          {
            q: "충전비와 유지비는 어떻게 다른가요?",
            a: "충전비는 유지비의 일부입니다. 유지비는 여기에 보험료와 자동차세 같은 고정비까지 더한 개념입니다. 전체 유지비를 보려면 유지비 계산기로, 감가상각까지 포함한 소유 비용 전체를 보려면 총소유비용(TCO) 계산기로 이어서 확인하세요.",
          },
          {
            q: "집에 충전기를 설치하면 얼마나 절약되나요?",
            a: "완속 비율이 올라가는 만큼 가중 평균 단가가 내려갑니다. 계산기에서 완속 비율을 현재 값과 설치 후 예상값으로 각각 넣어 비교해보면 월 절감액을 직접 확인할 수 있습니다. 다만 설치비와 공동주택 동의 절차 등 초기 비용·절차가 별도로 필요합니다.",
          },
        ],
      },
    ],
  },
];

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
            아래 해설에서 충전 방식별 단가와 계절에 따른 전비 변화도 함께 확인하세요.
          </p>
        </header>
        <ChargingCalculator />
      </div>

      <PurchaseCrossLinks
        items={[
          {
            href: "/",
            label: "테슬라 보조금 계산기",
            desc: "충전비만큼 구매가에 큰 영향을 주는 국고·지자체 보조금을 지역별로 확인하고 실구매가를 계산하세요.",
          },
          {
            href: "/calc/maintenance",
            label: "유지비 계산기",
            desc: "충전비에 보험료·자동차세까지 더한 전체 유지비를 월·연 단위로 확인합니다.",
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
          currentHref="/calc/charging"
          dataDate={CALC_DATA_DATE}
          dataNote="충전 단가는 사업자·요금제·시간대에 따라 수시로 달라집니다. 본문의 단가 범위는 대략적인 참고치이며, 정확한 계산을 위해서는 실제 이용 중인 충전 사업자의 최신 요금을 확인해 입력하세요."
          relatedHeading="충전비를 확인했다면 이어서 볼 계산기"
          sources={[
            {
              name: "무공해차 통합누리집 — 충전 안내",
              url: "https://www.ev.or.kr",
              note: "충전 인프라·요금 공식 정보",
            },
            {
              name: "테슬라 공식 — 슈퍼차저",
              url: "https://www.tesla.com/ko_kr/supercharger",
              note: "슈퍼차저 요금·위치",
            },
            {
              name: "오피넷 — 전국 평균 유가",
              url: "https://www.opinet.co.kr",
              note: "내연기관 연료비 비교 근거",
            },
          ]}
        />
      </div>
    </main>
  );
}
