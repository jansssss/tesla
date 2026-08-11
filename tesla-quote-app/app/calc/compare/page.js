import CompareCalculator from "@/components/calc/CompareCalculator";
import CalcContent from "@/components/calc/CalcContent";
import PurchaseCrossLinks from "@/components/calc/PurchaseCrossLinks";
import { CALC_DATA_DATE } from "@/lib/calcExtra";
import { VEHICLE_TRIMS, VEHICLE_DATA_VERIFIED_AT } from "@/lib/vehicleData";

export const metadata = {
  title: "테슬라 Model 3 vs Model Y 비교 계산기 — 실구매가·월납입금·유지비·5년 총비용",
  description:
    "Model 3와 Model Y의 트림·보조금·금융 조건을 입력해 실구매가, 월납입금, 연 유지비, 5년 총비용을 한 표로 비교합니다. 트림별 가격·주행거리 비교표와 선택 기준까지 정리했습니다.",
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

const man = (won) => `${(won / 10000).toLocaleString()}만원`;

const TRIM_ROWS = VEHICLE_TRIMS.map((t) => [
  t.trimFull,
  man(t.priceKrw),
  t.rangeKm ? `${t.rangeKm}km` : "-",
  t.driveType,
  t.zeroToHundred ? `${t.zeroToHundred}초` : "-",
]);

const SECTIONS = [
  {
    heading: "가격표만 보면 두 모델의 차이가 300만원처럼 보인다",
    lead: "Model 3 RWD와 Model Y RWD의 출고가 차이는 300만원입니다. 그런데 실제로 지갑에서 나가는 차이는 이 숫자와 다릅니다. 보조금과 유지비가 각각 다르게 붙기 때문입니다.",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "국고보조금은 차량 가격과 효율 등에 따라 산정되므로 모델·트림마다 금액이 달라집니다. 지방보조금은 거주 지역에 따라 또 달라집니다. 그래서 출고가 차이가 300만원이어도 보조금 차감 후 실구매가 차이는 그보다 줄어들거나 늘어날 수 있습니다.",
          "여기에 유지비가 더해집니다. Model Y는 차체가 크고 무거워 전비가 Model 3보다 불리한 편이고, 그 차이가 5년간 누적되면 무시할 수 없는 금액이 됩니다.",
          "이 계산기가 실구매가·월납입금·연 유지비·5년 총비용 네 가지를 동시에 보여주는 이유입니다. 어느 한 지표만 보면 판단이 어긋납니다.",
        ],
      },
      {
        type: "formula",
        lines: [
          "실구매가 = 출고가 − 보조금",
          "월 납입금 = 원리금균등(실구매가 − 선수금, 금리, 개월)",
          "연 유지비 = 충전비 + 보험료 + 자동차세",
          "5년 총비용 = 실구매가 + (연 유지비 × 5)",
        ],
        note: "표에서 더 유리한(낮은) 값이 초록색으로 표시됩니다. 5년 총비용에는 잔존가치가 반영되지 않으므로, 감가까지 포함한 비교는 TCO 계산기에서 확인하세요.",
      },
    ],
  },
  {
    heading: "현재 판매 중인 트림 한눈에 보기",
    lead: `테슬라 공식 홈페이지 기준으로 정리한 트림별 가격과 주요 사양입니다. (확인일 ${VEHICLE_DATA_VERIFIED_AT}, 보조금 적용 전 출고가)`,
    blocks: [
      {
        type: "table",
        headers: ["트림", "출고가", "주행거리", "구동", "0-100km/h"],
        rows: TRIM_ROWS,
        note: "주행거리는 환경부 복합 인증 기준입니다. 실제 주행거리는 계절·주행 습관·타이어 사양에 따라 달라집니다. 가격은 변동될 수 있으므로 계약 전 공식 홈페이지에서 다시 확인하세요.",
      },
      {
        type: "text",
        paragraphs: [
          "표에서 눈에 띄는 것은 Model Y L AWD입니다. 주행거리가 가장 길지만 가격도 가장 높습니다. 3열 좌석이 필요한 가족 구성이 아니라면, 같은 예산으로 Model 3 Long Range를 선택해 주행거리를 확보하는 편이 총비용 면에서 유리할 수 있습니다.",
          "반대로 Model 3 RWD는 가장 저렴하지만 주행거리도 가장 짧습니다. 집 충전이 되는 환경이라면 일상에서 큰 불편이 없지만, 장거리가 잦다면 Long Range 계열을 고려하는 편이 스트레스가 적습니다.",
        ],
      },
    ],
  },
  {
    heading: "Model 3와 Model Y, 성격이 갈리는 지점",
    blocks: [
      {
        type: "compare",
        columns: [
          {
            title: "Model 3가 맞는 경우",
            tone: "good",
            items: [
              "출고가와 월 납입금을 낮추는 것이 우선이다",
              "주로 1~2인이 타고 짐이 많지 않다",
              "전비가 유리해 장기 유지비가 덜 든다",
              "차고가 낮아 주행 안정감을 선호한다",
            ],
          },
          {
            title: "Model Y가 맞는 경우",
            tone: "good",
            items: [
              "아이가 있거나 짐을 자주 싣는다",
              "해치백 구조의 넓은 적재 개구부가 필요하다",
              "높은 시트 포지션과 시야를 선호한다",
              "차값·유지비 차이를 감수할 여지가 있다",
            ],
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          "실용성 차이는 숫자로 환산되지 않습니다. 유모차를 매일 싣고 내려야 하는 사람에게 Model Y의 적재 구조는 5년간의 유지비 차이보다 큰 가치일 수 있습니다.",
          "반대로 짐을 실을 일이 거의 없는데 '넓은 게 낫겠지'라는 이유로 Model Y를 고르면, 매달 더 내는 할부금과 충전비만 남습니다. 계산기의 숫자는 이 판단을 돕는 근거일 뿐, 결론 그 자체는 아닙니다.",
        ],
      },
      {
        type: "callout",
        title: "판단 순서 제안",
        text: "먼저 실용성(적재·인원)으로 모델을 좁히고, 그다음 계산기로 트림을 고르는 순서를 권합니다. 반대로 하면 숫자에 끌려 실제 생활에 안 맞는 차를 고르기 쉽습니다.",
      },
    ],
  },
  {
    heading: "비교할 때 자주 어긋나는 부분",
    blocks: [
      {
        type: "list",
        items: [
          "보조금을 두 모델에 같은 값으로 넣는 경우 — 국고보조금은 모델·트림마다 다릅니다. 실구매가 계산기에서 각각의 값을 확인해 넣어야 비교가 성립합니다.",
          "전비를 같은 값으로 넣는 경우 — Model Y는 Model 3보다 전비가 불리한 편입니다. 같은 값을 넣으면 유지비 차이가 실제보다 작게 나옵니다.",
          "5년 총비용에 잔존가치를 기대하는 경우 — 이 표의 5년 총비용은 실구매가 + 5년 유지비입니다. 팔 때 받는 돈은 빠져 있습니다.",
          "옵션 가격을 빼고 비교하는 경우 — 페인트·휠·시트 옵션과 FSD 같은 소프트웨어 옵션은 출고가에 포함되지 않습니다.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "옵션은 생각보다 큽니다",
        text: "기본 색상 외의 페인트, 큰 휠, 실내 색상 변경 등을 더하면 출고가가 수백만원 올라갈 수 있습니다. 두 모델을 비교할 때는 '내가 실제로 고를 옵션'을 포함한 가격으로 비교해야 결과가 뒤집히지 않습니다.",
      },
    ],
  },
  {
    heading: "모델 비교에 대해 자주 묻는 것들",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "보조금이 모델마다 다른 이유는 무엇인가요?",
            a: "국고보조금은 차량 가격 구간과 효율 등 여러 기준에 따라 산정되어 모델·트림별로 금액이 달라집니다. 지방보조금은 거주 지역의 예산과 정책에 따라 또 달라집니다. 정확한 금액은 실구매가 계산기에서 지역과 트림을 선택해 확인한 뒤, 그 값을 이 비교 계산기에 넣으세요.",
          },
          {
            q: "5년 총비용에 감가상각은 포함되나요?",
            a: "포함되지 않습니다. 이 표의 5년 총비용은 실구매가에 5년치 유지비를 더한 값입니다. 5년 뒤 차를 팔 때 받는 잔존가치를 빼야 실제 부담한 비용이 나오는데, 그 계산은 총소유비용(TCO) 계산기에서 할 수 있습니다.",
          },
          {
            q: "Model Y L은 어떤 사람에게 맞나요?",
            a: `Model Y L AWD는 출고가 ${man(VEHICLE_TRIMS.find((t) => t.id === "my-l-awd").priceKrw)}으로 라인업에서 가장 높지만, 주행거리도 ${VEHICLE_TRIMS.find((t) => t.id === "my-l-awd").rangeKm}km로 가장 깁니다. 좌석과 적재 공간이 더 필요한 가족 단위 사용자에게 맞는 선택입니다. 다만 인원·짐 요구가 없다면 가격 대비 효용이 떨어지므로, 같은 예산으로 다른 트림을 검토하는 편이 나을 수 있습니다.`,
          },
          {
            q: "RWD와 AWD 중 무엇을 고르는 게 좋나요?",
            a: "AWD는 가속과 눈길 접지력에서 유리하지만 가격이 높고 전비는 다소 불리한 편입니다. 눈이 잦은 지역이거나 가속 성능을 중시한다면 AWD, 비용을 우선한다면 RWD가 합리적입니다. 두 구동 방식의 차이는 RWD vs AWD 비교 페이지에서 더 자세히 확인할 수 있습니다.",
          },
          {
            q: "지금 사는 게 좋을까요, 기다리는 게 좋을까요?",
            a: "가격과 보조금은 모두 변동 가능한 값이라 어느 쪽이 유리하다고 단정하기 어렵습니다. 다만 보조금은 연간 예산 소진 여부에 영향을 받으므로, 구매를 결정했다면 거주 지역의 잔여 예산과 접수 일정을 무공해차 통합누리집에서 확인해보는 것이 좋습니다.",
          },
        ],
      },
    ],
  },
];

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
            트림과 보조금, 금융 조건을 입력하면 두 모델의 실구매가·월납입금·유지비·5년 총비용을 한
            표로 비교합니다. 아래에는 전 트림 가격·주행거리 비교표를 함께 실었습니다.
          </p>
        </header>
        <CompareCalculator />
      </div>

      <PurchaseCrossLinks
        items={[
          {
            href: "/subsidy",
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

      <div className="mt-10">
        <CalcContent
          sections={SECTIONS}
          currentHref="/calc/compare"
          dataDate={CALC_DATA_DATE}
          dataNote={`차량 가격·주행거리는 테슬라 공식 홈페이지 기준이며 마지막 확인일은 ${VEHICLE_DATA_VERIFIED_AT}입니다. 가격은 예고 없이 변경될 수 있으므로 계약 전 공식 홈페이지에서 다시 확인하세요.`}
          relatedHeading="모델을 좁혔다면 이어서 볼 계산기"
          sources={[
            {
              name: "테슬라 공식 — 차량 가격·사양",
              url: "https://www.tesla.com/ko_kr",
              note: "출고가·주행거리 원본",
            },
            {
              name: "무공해차 통합누리집",
              url: "https://www.ev.or.kr",
              note: "국고·지방보조금 공식 정보",
            },
          ]}
        />
      </div>
    </main>
  );
}
