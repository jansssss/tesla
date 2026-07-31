import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";
import { CALC_DATA_DATE } from "@/lib/calcExtra";
import { getTrimsByModel, getTrimById, VEHICLE_DATA_VERIFIED_AT } from "@/lib/vehicleData";
import CalcContent from "@/components/calc/CalcContent";

const _yRwd = getTrimById("my-rwd");
const _yLr = getTrimById("my-lr");
const _yL = getTrimById("my-l-awd");
const _m3Rwd = getTrimById("m3-rwd");
const _won = (v) => `${(v / 10000).toLocaleString()}만원`;

const MY_SECTIONS = [
  {
    heading: "세 트림은 각각 다른 문제를 해결한다",
    lead: "Model Y의 트림은 '좋음-더 좋음-가장 좋음'의 서열이 아닙니다. 가격, 주행거리, 공간이라는 서로 다른 요구에 각각 대응합니다.",
    blocks: [
      {
        type: "table",
        headers: ["트림", "출고가", "주행거리", "구동", "해결하는 문제"],
        rows: [
          [
            _yRwd.trim,
            _won(_yRwd.priceKrw),
            `${_yRwd.rangeKm}km`,
            _yRwd.driveType,
            "SUV를 가장 낮은 가격으로",
          ],
          [
            _yLr.trim,
            _won(_yLr.priceKrw),
            `${_yLr.rangeKm}km`,
            _yLr.driveType,
            "주행거리와 사륜 구동",
          ],
          [
            _yL.trim,
            _won(_yL.priceKrw),
            `${_yL.rangeKm}km`,
            _yL.driveType,
            "더 넓은 실내 공간",
          ],
        ],
        note: `테슬라 공식 홈페이지 기준, 확인일 ${VEHICLE_DATA_VERIFIED_AT}. 주행거리는 환경부 복합 인증 기준입니다. 좌석 구성 등 세부 사양은 공식 홈페이지에서 확인하세요.`,
      },
      {
        type: "text",
        paragraphs: [
          `${_yRwd.trim}에서 ${_yLr.trim}로 올라가면 ${_won(_yLr.priceKrw - _yRwd.priceKrw)}을 더 내고 주행거리 ${_yLr.rangeKm - _yRwd.rangeKm}km와 사륜 구동을 얻습니다. 두 가지가 묶여 있어서, 둘 중 하나만 필요한 경우에도 함께 값을 치러야 합니다.`,
          `${_yL.trim}는 여기서 다시 ${_won(_yL.priceKrw - _yLr.priceKrw)}이 더해집니다. 이 금액은 거의 전적으로 공간에 대한 값이므로, 공간이 필요 없다면 지불할 이유가 없습니다.`,
        ],
      },
    ],
  },
  {
    heading: "Model Y RWD가 가장 합리적인 선택인 경우",
    lead: "판매량이 가장 많은 트림이고, 실제로 대부분의 구매자에게 균형이 맞는 선택입니다.",
    blocks: [
      {
        type: "list",
        items: [
          "SUV의 적재 공간과 시야는 필요하지만 사륜 구동은 필요 없는 경우 — 도심 거주자 다수가 여기 해당합니다.",
          "집·직장에서 완속 충전이 가능한 경우 — 주행거리가 충분히 여유롭습니다.",
          `월 부담을 낮추는 것이 중요한 경우 — 상위 트림 대비 ${_won(_yLr.priceKrw - _yRwd.priceKrw)} 이상 차이가 그대로 할부금에 반영됩니다.`,
          "전비를 중시하는 경우 — 모터가 하나인 RWD가 사륜 구동보다 유리합니다.",
        ],
      },
      {
        type: "callout",
        title: "상위 트림을 검토해야 하는 신호",
        text: "집 충전이 불가능하거나, 왕복 250km 이상 장거리가 정기적으로 있거나, 눈이 잦은 지역에 산다면 Long Range 쪽을 진지하게 봐야 합니다. 이 세 가지에 해당하지 않는다면 RWD로 시작하는 편이 대체로 만족스럽습니다.",
      },
    ],
  },
  {
    heading: "패밀리카로 볼 때 실제로 중요한 것",
    lead: "Model Y가 패밀리카로 자주 추천되는 이유는 스펙이 아니라 구조에 있습니다.",
    blocks: [
      {
        type: "list",
        items: [
          "해치백 구조의 넓은 개구부 — 유모차나 부피 큰 짐을 넣고 빼기가 세단보다 수월합니다.",
          "높은 시트 포지션 — 카시트에 아이를 태우고 내릴 때 허리 부담이 적습니다.",
          "앞 트렁크 — 엔진이 없는 자리를 적재 공간으로 쓸 수 있어 활용도가 높습니다.",
          "평평해지는 뒷좌석 — 접었을 때 바닥이 고르게 이어져 큰 짐을 싣기 좋습니다.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          "반대로 패밀리카를 고를 때 자주 간과되는 것이 주차 환경입니다. 아파트 지하주차장의 좁은 구획이나 기계식 주차장을 상시 이용해야 한다면, 차폭과 전장을 미리 확인해야 합니다. 특히 기계식 주차장은 중량 제한이 있어 전기차가 들어가지 못하는 경우가 있습니다.",
          "또 하나, 카시트를 두 개 이상 장착할 계획이라면 전시장에서 실제 카시트를 가져가 장착해보는 것이 가장 확실합니다. 카탈로그의 실내 치수만으로는 판단하기 어렵습니다.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "계약 전 반드시 실측",
        text: "기계식 주차장을 이용한다면 해당 주차장의 전장·전폭·전고·중량 제한을 확인하고 차량 제원과 대조하세요. 인수 후에 알게 되면 되돌리기 어렵습니다.",
      },
    ],
  },
  {
    heading: "Model Y 구매 전 자주 확인하는 것들",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Model 3와 가격 차이가 크지 않은데 어떻게 고르나요?",
            a: `시작 출고가 차이는 ${_won(_yRwd.priceKrw - _m3Rwd.priceKrw)}입니다. 여기에 전비 차이로 인한 충전비와 차량가액에 연동되는 보험료 차이가 5년간 누적됩니다. 짐과 인원이 실제로 있다면 그 값을 치를 만하고, 없다면 Model 3가 비용 면에서 유리합니다.`,
          },
          {
            q: "Long Range와 L AWD 중에는요?",
            a: `주행거리 차이는 ${_yL.rangeKm - _yLr.rangeKm}km로 크지 않은 반면 가격은 ${_won(_yL.priceKrw - _yLr.priceKrw)} 차이가 납니다. 즉 L AWD는 주행거리를 사는 트림이 아니라 공간을 사는 트림입니다. 3열 좌석이나 더 넓은 실내가 필요한 경우에만 검토하세요.`,
          },
          {
            q: "보조금은 트림마다 다른가요?",
            a: "국고보조금은 차량 가격과 효율 등을 기준으로 산정되므로 트림별 금액이 달라집니다. 지방보조금은 거주 지역에 따라 달라지고요. 위 지역 버튼으로 계산기에 이동하면 해당 지역과 트림의 보조금이 자동 적용된 실구매가를 확인할 수 있습니다.",
          },
          {
            q: "인증 주행거리만큼 실제로 가나요?",
            a: "표준 조건 기준이라 실제로는 이보다 짧게 나오는 것이 일반적입니다. 특히 고속도로 정속 주행과 겨울철 저온에서 감소 폭이 큽니다. Model Y는 차고가 높아 고속에서 공기저항이 커지므로, 장거리가 잦다면 여유를 두고 트림을 고르는 편이 좋습니다.",
          },
          {
            q: "유지비는 Model 3보다 얼마나 더 드나요?",
            a: "차체가 크고 무거워 전비가 불리한 만큼 충전비가 더 나오고, 차량가액이 높아 보험료도 올라갑니다. 정확한 금액은 조건에 따라 다르므로 유지비 계산기에서 전비와 보험료를 각각 넣어 비교해보세요.",
          },
        ],
      },
    ],
  },
];

export const metadata = {
  title: "2026 테슬라 Model Y 트림별 가격·보조금·월납입금 (RWD·LR·L AWD)",
  description:
    "테슬라 Model Y RWD·Long Range·L AWD 트림 출고가, 지역별 보조금, 실구매가 및 할부 월납입금 계산. 패밀리카 추천 모델 2026년 최신 데이터.",
  openGraph: {
    title: "2026 테슬라 Model Y 트림별 가격·보조금·월납입금",
    description:
      "테슬라 Model Y RWD·Long Range·L AWD 트림 출고가, 지역별 보조금, 실구매가 및 할부 월납입금 계산.",
    url: "https://www.paytesla.kr/models/model-y",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/models/model-y" },
};

// 가격은 lib/vehicleData.js 단일 원본에서 가져옴.
// 주행거리·성능 수치 중 파일 간 충돌 항목은 docs/vehicle-data-verification-todo.md 참고.
const _vehicleTrims = getTrimsByModel("Model Y");
const _priceMap = Object.fromEntries(_vehicleTrims.map((t) => [t.id, t.priceKrw]));

const TRIMS = [
  {
    id: "my-rwd",
    label: "Model Y RWD",
    sublabel: "후륜 구동 · Premium",
    price: _priceMap["my-rwd"],
    range: "400 km",
    speed: "201 km/h",
    accel: "5.9 초",
    cargo: null,
    highlight: true,
  },
  {
    id: "my-lr",
    label: "Model Y Long Range",
    sublabel: "사륜 구동 · Premium",
    price: _priceMap["my-lr"],
    range: "505 km",
    speed: "201 km/h",
    accel: "4.8 초",
    cargo: null,
    highlight: false,
  },
  {
    id: "my-l-awd",
    label: "Model Y L AWD",
    sublabel: "사륜 구동",
    price: _priceMap["my-l-awd"],
    range: "543 km",
    speed: "201 km/h",
    accel: "5.0 초",
    cargo: "1,925 L (최대)",  // L AWD 전용 수치
    highlight: false,
  },
];

function formatWon(amount) {
  return `₩${Number(amount).toLocaleString("ko-KR")}`;
}

export default function ModelYPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-300 transition-colors">홈</Link>
            <span>/</span>
            <span className="text-white">Model Y</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            2026 테슬라 Model Y<br className="md:hidden" />
            <span className="md:ml-2">트림별 가격 · 보조금 · 월납입금</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            RWD · Long Range · L AWD — 국내 최다 판매 전기 SUV, 지역 보조금 적용 실구매가 계산
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10">

        {/* 트림 비교 */}
        <section>
          <h2 className="text-lg md:text-xl font-bold mb-4">트림별 스펙 · 출고가</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRIMS.map((trim) => (
              <div
                key={trim.id}
                className={`bg-white rounded-2xl shadow-sm border p-5 ${
                  trim.highlight ? "border-red-400 ring-1 ring-red-400" : "border-gray-100"
                }`}
              >
                {trim.highlight && (
                  <span className="inline-block text-xs bg-red-500 text-white font-semibold px-2 py-0.5 rounded-full mb-2">
                    인기
                  </span>
                )}
                <h3 className="font-bold text-base mb-0.5">{trim.label}</h3>
                <p className="text-xs text-gray-500 mb-4">{trim.sublabel}</p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">주행거리</span>
                    <span className={`font-medium ${!trim.range ? "text-gray-400 italic" : ""}`}>
                      {trim.range ?? "공식 확인 중"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">최고속도</span>
                    <span className="font-medium">{trim.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">0→100 km/h</span>
                    <span className={`font-medium ${!trim.accel ? "text-gray-400 italic" : ""}`}>
                      {trim.accel ?? "확인 중"}
                    </span>
                  </div>
                  {trim.cargo && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">적재공간</span>
                      <span className="font-medium">{trim.cargo}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-0.5">출고가</p>
                  <p className="text-base font-bold">{formatWon(trim.price)}</p>
                </div>
                <Link
                  href={`/?model=modely&trim=${trim.id}`}
                  className="mt-3 block text-center text-xs bg-black hover:bg-gray-800 text-white py-2 rounded-lg transition-colors"
                >
                  이 트림으로 계산 →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 지역별 계산기 바로가기 */}
        <section>
          <h2 className="text-lg md:text-xl font-bold mb-2">지역 선택 후 계산기로 이동</h2>
          <p className="text-sm text-gray-500 mb-4">
            거주 지역을 선택하면 해당 지방보조금이 자동 적용된 계산기로 이동합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {METRO_REGIONS.map((r) => (
              <Link
                key={r.slug}
                href={`/?model=modely&trim=my-rwd&region=${r.representativeCode ?? ""}`}
                className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-400 rounded-full text-xs font-medium text-gray-700 transition-colors shadow-sm"
              >
                {r.shortName}
              </Link>
            ))}
          </div>
        </section>

        {/* SEO 텍스트 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
          <h2 className="text-base font-bold mb-3">Model Y 구매 가이드</h2>
          <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <p>
              테슬라 Model Y는 2026년 기준 <strong>RWD(4,999만원)</strong>, <strong>Long Range AWD(6,699만원)</strong>, <strong>Model Y L AWD(7,299만원)</strong> 세 가지 트림으로 판매됩니다. 넉넉한 적재공간(최대 1,925L)과 높은 주행 안전성으로 패밀리카로 인기가 높습니다.
            </p>
            <p>
              Model Y L AWD는 기존 Model Y보다 더 넓은 실내 공간과 543km 주행거리를 제공하는 대형 7인승 SUV 트림입니다. 지역별 보조금을 적용하면 RWD 기준 실구매가가 크게 낮아지며, 다자녀 가구는 추가 혜택도 받을 수 있습니다. 정확한 월납입금은 위 계산기에서 선수금과 할부 기간을 직접 입력해 확인하세요.
            </p>
            <p className="text-xs text-gray-400 pt-1">
              * 가격·주행거리·보조금은 테슬라 공식 홈페이지 기준이며 변동될 수 있습니다. 데이터 기준일: {CALC_DATA_DATE}.
            </p>
          </div>
        </section>

        {/* 내부 링크 */}
        <section className="border-t border-gray-100 pt-8">
          <h2 className="text-base font-bold mb-3 text-gray-700">관련 페이지</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-500 transition-colors">
              테슬라 보조금 계산기
            </Link>
            <Link href="/models/model-3" className="px-3 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors">
              Model 3 상세
            </Link>
            <Link href="/compare/model-3-vs-model-y" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              Model 3 vs Model Y
            </Link>
            <Link href="/compare/rwd-vs-awd" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              RWD vs AWD 비교
            </Link>
            <Link href="/calc/monthly-real-cost" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              월 실제 부담 계산
            </Link>
            <Link href="/calc/tco" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              TCO 계산기
            </Link>
            <Link href="/models/model-y-l" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              Model Y L 상세
            </Link>
            {["seoul", "daegu", "busan", "incheon"].map((slug) => {
              const region = METRO_REGIONS.find((r) => r.slug === slug);
              return (
                <Link key={slug} href={`/subsidy/${slug}`} className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
                  {region?.shortName} 보조금
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <CalcContent
        sections={MY_SECTIONS}
        currentHref="/models/model-y"
        dataDate={CALC_DATA_DATE}
        dataNote={`가격·주행거리·가속 수치는 테슬라 공식 홈페이지 기준이며 마지막 확인일은 ${VEHICLE_DATA_VERIFIED_AT}입니다. 좌석 구성·적재 용량 등 세부 사양과 최신 가격은 계약 전 공식 홈페이지에서 다시 확인하세요.`}
        relatedHeading="트림을 정했다면 이어서 볼 계산기"
        sources={[
          {
            name: "테슬라 공식 — Model Y",
            url: "https://www.tesla.com/ko_kr/modely",
            note: "가격·사양 원본",
          },
          {
            name: "무공해차 통합누리집",
            url: "https://www.ev.or.kr",
            note: "국고·지방보조금 공식 정보",
          },
        ]}
      />
    </main>
  );
}
