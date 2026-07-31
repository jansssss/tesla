import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";
import CalcContent from "@/components/calc/CalcContent";
import { CALC_DATA_DATE } from "@/lib/calcExtra";
import { VEHICLE_DATA_VERIFIED_AT, getTrimById, getTrimsByModel } from "@/lib/vehicleData";

const _rwd = getTrimById("m3-rwd");
const _lr = getTrimById("m3-lr");
const _perf = getTrimById("m3-perf");
const _won = (v) => `${(v / 10000).toLocaleString()}만원`;

const M3_SECTIONS = [
  {
    heading: "세 트림 중 무엇을 고를 것인가",
    lead: "Model 3의 트림 선택은 사실상 '주행거리를 얼마나 살 것인가'의 문제입니다. 성능 차이는 대부분의 사용자에게 결정 요인이 되지 못합니다.",
    blocks: [
      {
        type: "table",
        headers: ["트림", "출고가", "주행거리", "0-100km/h", "핵심 선택 이유"],
        rows: [
          [_rwd.trim, _won(_rwd.priceKrw), `${_rwd.rangeKm}km`, `${_rwd.zeroToHundred}초`, "가장 낮은 진입 가격"],
          [_lr.trim, _won(_lr.priceKrw), `${_lr.rangeKm}km`, `${_lr.zeroToHundred}초`, "긴 주행거리 — 장거리·충전 불편 해소"],
          [_perf.trim, _won(_perf.priceKrw), `${_perf.rangeKm}km`, `${_perf.zeroToHundred}초`, "가속 성능과 AWD"],
        ],
        note: `테슬라 공식 홈페이지 기준, 확인일 ${VEHICLE_DATA_VERIFIED_AT}. 주행거리는 환경부 복합 인증 기준이며 실제 주행거리는 계절·속도·공조 사용에 따라 달라집니다.`,
      },
      {
        type: "text",
        paragraphs: [
          `${_rwd.trim}와 ${_lr.trim}의 가격 차이는 ${_won(_lr.priceKrw - _rwd.priceKrw)}이고, 그 대가로 주행거리가 ${_lr.rangeKm - _rwd.rangeKm}km 늘어납니다. 이 차이를 60개월로 나누면 월 20만원대이므로, 결코 작은 선택이 아닙니다.`,
          `${_perf.trim}는 0-100km/h ${_perf.zeroToHundred}초로 확연히 빠르지만 주행거리는 ${_perf.rangeKm}km로 ${_lr.trim}보다 짧습니다. 성능을 사면서 주행거리를 일부 내주는 구조입니다.`,
        ],
      },
    ],
  },
  {
    heading: "RWD로 충분한가, Long Range가 필요한가",
    lead: "가장 많이 갈리는 지점입니다. 판단 기준은 하나입니다 — 집에서 충전할 수 있는가.",
    blocks: [
      {
        type: "compare",
        columns: [
          {
            title: `${_rwd.trim}로 충분한 경우`,
            tone: "good",
            items: [
              "집이나 직장에서 밤새 완속 충전이 가능하다",
              "하루 주행거리가 100km 이내다",
              "장거리는 연 몇 회 수준이다",
              "월 부담을 낮추는 것이 우선이다",
            ],
          },
          {
            title: `${_lr.trim}가 필요한 경우`,
            tone: "bad",
            items: [
              "집 충전이 안 되어 충전 주기를 늘려야 한다",
              "왕복 200km 이상 장거리가 정기적으로 있다",
              "겨울철 주행거리 감소가 부담스럽다",
              "충전 계획을 신경 쓰고 싶지 않다",
            ],
          },
        ],
      },
      {
        type: "callout",
        title: "집 충전이 되면 주행거리의 의미가 달라집니다",
        text: `매일 밤 충전할 수 있다면 ${_rwd.rangeKm}km도 일상에서는 남습니다. 반대로 집 충전이 안 되면 주행거리는 곧 '충전소에 가는 빈도'가 되므로, 긴 쪽이 삶의 질을 크게 바꿉니다. 트림을 고르기 전에 충전 환경부터 확인하세요.`,
      },
      {
        type: "text",
        paragraphs: [
          "겨울철도 함께 고려해야 합니다. 저온에서는 배터리 효율이 떨어지고 난방에 전력을 쓰므로 실주행거리가 인증값보다 줄어듭니다. 여유 없이 딱 맞게 트림을 고르면 겨울에 불편이 커질 수 있습니다.",
        ],
      },
    ],
  },
  {
    heading: "출고가와 실구매가는 다르다",
    blocks: [
      {
        type: "text",
        paragraphs: [
          "이 페이지의 가격은 모두 보조금 적용 전 출고가입니다. 실제로 내는 금액은 국고보조금과 거주 지역의 지방보조금을 차감한 뒤 결정됩니다.",
          "국고보조금은 차량 가격과 효율 등을 기준으로 산정되므로 트림마다 금액이 다릅니다. 지방보조금은 지역별로 편차가 크고, 같은 광역시도 안에서도 시·군·구에 따라 달라지는 경우가 있습니다.",
          "따라서 '어느 트림이 얼마나 저렴한가'는 거주 지역을 넣어봐야 정확히 알 수 있습니다. 위 지역 버튼을 눌러 계산기로 이동하면 해당 지역 보조금이 자동 적용된 실구매가와 월납입금을 확인할 수 있습니다.",
        ],
      },
      {
        type: "list",
        title: "출고가 외에 추가로 드는 비용",
        items: [
          "옵션 — 기본 색상 외 페인트, 큰 휠, 실내 색상 변경 등은 별도 비용입니다.",
          "취득세·등록비 — 구매 시점에 발생하는 초기 비용입니다.",
          "탁송료·기타 수수료 — 인도 조건에 따라 발생할 수 있습니다.",
          "홈 충전기 — 개별 설치가 필요하다면 초기 비용이 추가됩니다.",
        ],
      },
    ],
  },
  {
    heading: "Model 3 구매 전 자주 확인하는 것들",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "인증 주행거리만큼 실제로 갈 수 있나요?",
            a: "표준 조건에서 측정한 값이므로 실제 주행에서는 이보다 짧게 나오는 것이 일반적입니다. 특히 고속도로 정속 주행과 겨울철 저온에서 감소 폭이 큽니다. 트림을 고를 때는 인증값에서 여유를 두고 판단하는 편이 안전합니다.",
          },
          {
            q: `${_lr.trim}는 왜 RWD인데 주행거리가 더 긴가요?`,
            a: `주행거리는 구동 방식이 아니라 배터리 용량과 효율로 정해집니다. ${_lr.trim}는 배터리 용량이 크면서 모터가 하나인 RWD 구성이라, 효율과 용량 양쪽에서 유리해 ${_lr.rangeKm}km라는 긴 주행거리가 나옵니다.`,
          },
          {
            q: "Model Y와 고민 중입니다.",
            a: "짐과 인원이 실제로 있는지가 기준입니다. 카시트를 두 개 이상 쓰거나 부피 큰 짐을 자주 싣는다면 Model Y, 그렇지 않다면 Model 3가 비용과 전비 양쪽에서 유리합니다. 자세한 비교는 Model 3 vs Model Y 페이지에서 확인하세요.",
          },
          {
            q: "월 납입금은 어떻게 계산하나요?",
            a: "실구매가에서 선수금을 뺀 금액에 금리와 할부 기간을 적용해 산출합니다. 다만 실제로 매달 나가는 돈에는 충전비·보험료·자동차세도 포함되므로, 월 실제 부담금 계산기로 함께 확인하는 것을 권합니다.",
          },
        ],
      },
    ],
  },
];

export const metadata = {
  title: "2026 테슬라 Model 3 트림별 가격·보조금·월납입금",
  description:
    "테슬라 Model 3 RWD·Long Range·Performance 트림 출고가, 지역별 보조금, 실구매가 및 할부 월납입금 계산. 2026년 최신 데이터.",
  openGraph: {
    title: "2026 테슬라 Model 3 트림별 가격·보조금·월납입금",
    description:
      "테슬라 Model 3 RWD·Long Range·Performance 트림 출고가, 지역별 보조금, 실구매가 및 할부 월납입금 계산.",
    url: "https://www.paytesla.kr/models/model-3",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/models/model-3" },
};

// 가격·주행거리·성능 모두 lib/vehicleData.js 단일 원본에서 파생한다.
const _vehicleTrims = getTrimsByModel("Model 3");
const _priceMap = Object.fromEntries(_vehicleTrims.map((t) => [t.id, t.priceKrw]));

const _SUBLABELS = {
  "m3-rwd": "후륜 구동",
  "m3-lr": "후륜 구동",
  "m3-perf": "사륜 구동",
};

const TRIMS = _vehicleTrims.map((t) => ({
  id: t.id,
  label: t.trimFull,
  sublabel: _SUBLABELS[t.id] ?? t.driveType,
  price: t.priceKrw,
  range: t.rangeKm == null ? null : `${t.rangeKm} km`,
  speed: t.topSpeedKph == null ? null : `${t.topSpeedKph} km/h`,
  accel: t.zeroToHundred == null ? null : `${t.zeroToHundred} 초`,
  highlight: t.highlight,
}));

function formatWon(amount) {
  return `₩${Number(amount).toLocaleString("ko-KR")}`;
}

export default function Model3Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-300 transition-colors">홈</Link>
            <span>/</span>
            <span className="text-white">Model 3</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            2026 테슬라 Model 3<br className="md:hidden" />
            <span className="md:ml-2">트림별 가격 · 보조금 · 월납입금</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            RWD · Long Range · Performance — 트림별 출고가, 지역 보조금, 실구매가 한눈에 비교
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10">

        {/* 트림 비교 */}
        <section>
          <h2 className="text-lg md:text-xl font-bold mb-4">트림별 스펙 · 출고가</h2>
          <div className="grid gap-4 sm:grid-cols-3">
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
                    <span className="font-medium">{trim.range}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">최고속도</span>
                    <span className="font-medium">{trim.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">0→100 km/h</span>
                    <span className="font-medium">{trim.accel}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-0.5">출고가</p>
                  <p className="text-base font-bold">{formatWon(trim.price)}</p>
                </div>
                <Link
                  href={`/?model=model3&trim=${trim.id}`}
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
                href={`/?model=model3&trim=m3-rwd&region=${r.representativeCode ?? ""}`}
                className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-400 rounded-full text-xs font-medium text-gray-700 transition-colors shadow-sm"
              >
                {r.shortName}
              </Link>
            ))}
          </div>
        </section>

        {/* SEO 텍스트 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
          <h2 className="text-base font-bold mb-3">Model 3 구매 가이드</h2>
          <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <p>
              테슬라 Model 3는 2026년 기준 <strong>RWD(4,699만원)</strong>, <strong>Long Range(5,999만원)</strong>, <strong>Performance(6,999만원)</strong> 세 가지 트림으로 판매됩니다.
            </p>
            <p>
              국고보조금과 지방보조금을 합산하면 지역에 따라 최대 수백만원의 보조금 혜택을 받을 수 있으며, 청년·다자녀·전기차 전환 혜택까지 적용하면 실구매가는 더욱 낮아집니다.
            </p>
            <p>
              일반적으로 선수금 1,000만원, 60개월 기준으로 월납입금은 지역·보조금에 따라 달라지므로 위 계산기에서 내 조건을 직접 입력해 확인하는 것을 권장합니다.
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
            <Link href="/models/model-y" className="px-3 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors">
              Model Y 상세
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
        sections={M3_SECTIONS}
        currentHref="/models/model-3"
        dataDate={CALC_DATA_DATE}
        dataNote={`가격·주행거리·가속 수치는 테슬라 공식 홈페이지 기준이며 마지막 확인일은 ${VEHICLE_DATA_VERIFIED_AT}입니다. 가격과 사양은 예고 없이 변경될 수 있으므로 계약 전 공식 홈페이지에서 다시 확인하세요.`}
        relatedHeading="트림을 정했다면 이어서 볼 계산기"
        sources={[
          {
            name: "테슬라 공식 — Model 3",
            url: "https://www.tesla.com/ko_kr/model3",
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
