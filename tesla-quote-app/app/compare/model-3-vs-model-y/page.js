import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";
import { CALC_DATA_DATE, CALC_DEFAULTS } from "@/lib/calcExtra";
import CalcContent from "@/components/calc/CalcContent";
import { getTrimById, VEHICLE_DATA_VERIFIED_AT } from "@/lib/vehicleData";
import { getNationalSubsidyManwon } from "@/lib/subsidy";

const _m3rwd = getTrimById("m3-rwd");
const _m3lr = getTrimById("m3-lr");
const _m3perf = getTrimById("m3-perf");
const _myrwd = getTrimById("my-rwd");
const _myl = getTrimById("my-l-awd");
const _man = (won) => `${(won / 10000).toLocaleString()}만원`;
const _nationalSubsidy = (csvModel) => {
  const manwon = getNationalSubsidyManwon(csvModel);
  return manwon == null ? "-" : `${manwon.toLocaleString()}만원`;
};

const CHOICE_SECTIONS = [
  {
    heading: "스펙표에 나오지 않는 차이가 만족도를 가른다",
    lead: "가격과 주행거리는 표로 비교할 수 있습니다. 그런데 실제로 매일 타면서 체감하는 차이는 표에 없는 곳에 있습니다.",
    blocks: [
      {
        type: "table",
        headers: ["일상 상황", "Model 3 (세단)", "Model Y (SUV)"],
        rows: [
          ["짐 싣고 내리기", "트렁크 개구부가 낮고 좁음", "해치백 구조로 크고 넓게 열림"],
          ["아이 카시트 태우기", "차고가 낮아 허리를 숙여야 함", "시트 높이가 높아 수월함"],
          ["좁은 골목 주차", "차폭·전장이 작아 유리", "다소 부담"],
          ["운전 시야", "낮은 착좌 — 시야 제한", "높은 착좌 — 시야 확보"],
          ["고속 주행 안정감", "무게 중심이 낮아 유리", "차고가 높아 상대적으로 불리"],
          ["기계식 주차장", "대체로 진입 가능", "크기·중량 제한 확인 필요"],
        ],
        note: "차량 크기·중량은 트림과 옵션에 따라 달라질 수 있습니다. 기계식 주차장을 상시 이용한다면 계약 전 해당 주차장의 제한 규격을 반드시 확인하세요.",
      },
      {
        type: "text",
        paragraphs: [
          "이 표에서 자기 생활에 해당하는 줄이 몇 개인지 세어보는 것이 스펙 비교보다 빠른 판단 방법입니다. 카시트를 매일 다루는 사람에게 '시트 높이'는 5년치 유지비 차이보다 큰 가치일 수 있습니다.",
          "반대로 좁은 골목에 주차하고 기계식 주차장을 자주 쓰는 사람에게 Model Y의 크기는 매일 겪는 스트레스가 됩니다. 이런 항목은 숫자로 환산되지 않지만 만족도에는 결정적입니다.",
        ],
      },
    ],
  },
  {
    heading: "적재 공간 숫자는 측정 기준이 다르다",
    lead: "카탈로그의 적재 용량을 두 차 사이에서 그대로 비교하면 오해가 생깁니다. 같은 조건에서 잰 값이 아니기 때문입니다. 위 비교표에 리터 수치를 넣지 않은 것도 같은 이유입니다.",
    blocks: [
      {
        type: "list",
        items: [
          "세단의 트렁크 용량은 보통 '뒷좌석을 세운 상태의 트렁크 공간'입니다.",
          "SUV의 최대 적재 용량은 대개 '뒷좌석을 접고 천장까지 채운 상태'를 기준으로 합니다.",
          "따라서 두 숫자를 단순 비교하면 SUV 쪽이 실제보다 훨씬 크게 느껴집니다.",
          "일상적인 상황(뒷좌석에 사람이 탄 상태)에서의 차이는 숫자만큼 크지 않을 수 있습니다.",
        ],
      },
      {
        type: "callout",
        title: "실용적인 확인법",
        text: "숫자보다 '내가 자주 싣는 물건이 들어가는가'가 중요합니다. 유모차, 골프백, 캠핑 박스처럼 부피가 큰 물건이 있다면 전시장에서 직접 실어보는 것이 가장 확실합니다. 개구부의 높이와 폭이 용량 숫자보다 중요한 경우가 많습니다.",
      },
      {
        type: "text",
        paragraphs: [
          "또 하나 자주 간과되는 것이 앞 트렁크입니다. 두 모델 모두 엔진이 없는 자리에 별도의 적재 공간이 있어, 실제 활용도가 카탈로그 숫자보다 높습니다.",
          `숫자가 좌석 구성에 따라 얼마나 달라지는지는 Model Y L의 예가 분명합니다. 최대 ${_myl.cargoLiters.toLocaleString()}L로 표기되지만 그 값은 2명만 타고 2·3열을 접었을 때이고, 3열까지 모두 쓰면 뒤 공간은 ${_myl.cargo.configs[0].rearL.toLocaleString()}L로 줄어듭니다. 구성별 수치는 Model Y L 상세 페이지에 정리해 두었습니다.`,
        ],
      },
    ],
  },
  {
    heading: "전비 차이가 5년간 만드는 금액",
    lead: "Model Y는 차체가 크고 무거워 같은 거리를 달릴 때 전력을 더 씁니다. 한 번의 충전에서는 티가 안 나지만 5년이면 금액이 쌓입니다.",
    blocks: [
      {
        type: "text",
        paragraphs: [
          `연 15,000km를 달리고 충전 단가를 ${CALC_DEFAULTS.slowPrice}원/kWh로 가정할 때, 전비가 0.5km/kWh 차이 나면 연 충전비 차이는 대략 7만원 안팎입니다. 5년이면 35만원 정도입니다.`,
          "금액 자체는 차값 차이에 비하면 크지 않습니다. 다만 여기에 보험료 차이(차량가액 연동)와 타이어 비용 차이가 더해지면 무시하기 어려운 수준이 됩니다.",
          "정확한 금액은 충전비 계산기에서 전비를 각각 다르게 넣어 비교하거나, 모델 비교 계산기에서 두 모델의 5년 총비용을 한 표로 확인할 수 있습니다.",
        ],
      },
      {
        type: "table",
        headers: ["비교 축", "Model 3", "Model Y"],
        rows: [
          ["시작 출고가", _man(_m3rwd.priceKrw), _man(_myrwd.priceKrw)],
          ["최장 주행거리 트림", `${_m3lr.trim} ${_m3lr.rangeKm}km`, `${_myl.trim} ${_myl.rangeKm}km`],
          ["전비", "유리 — 공기저항·중량에서 앞섬", "상대적으로 불리"],
          ["보험료", "차량가액이 낮아 유리한 편", "차량가액에 비례해 상승"],
        ],
        note: `출고가·주행거리는 테슬라 공식 홈페이지 기준이며 확인일은 ${VEHICLE_DATA_VERIFIED_AT}입니다. 전비·보험료는 일반적인 경향에 대한 설명이며 실제 값은 조건에 따라 달라집니다.`,
      },
    ],
  },
  {
    heading: "가족 구성으로 좁히는 방법",
    blocks: [
      {
        type: "steps",
        items: [
          "정기적으로 함께 타는 인원을 셉니다. 4명 이하이고 카시트가 없다면 Model 3로 충분한 경우가 많습니다.",
          "카시트를 장착할 계획이 있는지 확인합니다. 두 개 이상이면 Model Y 쪽이 편합니다.",
          "월 1회 이상 부피 큰 짐을 싣는지 봅니다. 없다면 SUV의 적재 공간은 활용되지 않는 비용입니다.",
          "주차 환경을 확인합니다. 기계식 주차장이나 좁은 골목이 일상이면 Model 3가 유리합니다.",
          "여기까지로 모델을 좁힌 뒤, 계산기에서 트림별 실구매가와 월납입금을 비교해 최종 결정합니다.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "'나중에 필요할지도'는 대체로 비용만 남습니다",
        text: "1년에 몇 번 있는 상황을 위해 큰 차를 고르는 선택은 매달 더 내는 할부금과 충전비로 돌아옵니다. 연 몇 회 수준이라면 그때만 다른 수단을 쓰는 편이 총비용 면에서 유리한 경우가 많습니다.",
      },
    ],
  },
  {
    heading: "두 모델을 두고 자주 묻는 것들",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "가격 차이가 크지 않은데 그냥 Model Y가 낫지 않나요?",
            a: `시작 출고가 차이는 ${_man(_myrwd.priceKrw - _m3rwd.priceKrw)}이지만, 여기에 5년치 충전비·보험료 차이가 더해집니다. 그리고 적재 공간을 실제로 쓰지 않는다면 그 비용은 아무 값어치를 하지 않습니다. 짐과 인원이 실제로 있는지가 판단 기준이어야 합니다.`,
          },
          {
            q: "장거리를 자주 다니는데 어느 쪽이 나은가요?",
            a: `주행거리만 보면 ${_m3lr.trimFull}(${_m3lr.rangeKm}km)가 세단 쪽 최장이고, ${_myl.trimFull}(${_myl.rangeKm}km)가 전체 최장입니다. 다만 고속도로에서는 공기저항이 커지므로 차체가 낮은 세단이 전비에서 유리한 편입니다. 혼자 또는 둘이 장거리를 다닌다면 Model 3 Long Range가 균형이 좋습니다.`,
          },
          {
            q: "보조금은 어느 쪽이 더 많나요?",
            a: "국고보조금은 차량 가격과 효율 등을 기준으로 산정되므로 트림별로 달라지고, 지방보조금은 거주 지역에 따라 달라집니다. 이 페이지의 보조금 수치는 특정 시점 기준이므로, 최신 금액은 실구매가 계산기에서 지역과 트림을 선택해 확인하거나 무공해차 통합누리집에서 직접 확인하세요.",
          },
          {
            q: "중고로 팔 때는 어느 쪽이 유리한가요?",
            a: "국내 시장에서 SUV 수요가 높은 편이지만, 중고 시세는 트림·색상·주행거리·사고 이력·시장 상황에 따라 크게 달라져 단정하기 어렵습니다. 총소유비용 계산기에서 감가상각률을 여러 값으로 넣어보고 그 범위 안에서 판단하는 편이 현실적입니다.",
          },
          {
            q: "Model Y L도 같이 고려해야 하나요?",
            a: `탑승 인원이 정기적으로 5명을 넘거나 3열 좌석이 필요한 경우에만 검토 대상입니다. 출고가가 ${_man(_myl.priceKrw)}로 라인업에서 가장 높기 때문에, 공간 요구가 분명하지 않다면 비용만 늘어납니다. 자세한 비교는 Model Y L 상세 페이지에서 확인하세요.`,
          },
        ],
      },
    ],
  },
];

export const metadata = {
  title: "테슬라 Model 3 vs Model Y 비교 — 가격·보조금·월납입금 2026",
  description:
    "테슬라 Model 3와 Model Y를 가격, 주행거리, 보조금, 월납입금 기준으로 비교. 내 상황에 맞는 모델을 계산기로 직접 확인하세요.",
  openGraph: {
    title: "테슬라 Model 3 vs Model Y 비교 — 2026",
    description: "테슬라 Model 3와 Model Y 가격·보조금·월납입금 비교.",
    url: "https://www.paytesla.kr/compare/model-3-vs-model-y",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/compare/model-3-vs-model-y" },
};

// 표의 모든 수치는 단일 원본(lib/vehicleData.js)과 보조금 CSV에서 파생한다.
// 하드코딩하면 두 원본이 갱신돼도 이 페이지만 옛 값으로 남기 때문이다.
const COMPARE_DATA = [
  { label: "차종", model3: "세단", modelY: "SUV (크로스오버)" },
  { label: "트림 구성", model3: "RWD · LR · Performance", modelY: "RWD · Long Range · L AWD" },
  {
    label: "시작 출고가",
    model3: `${_man(_m3rwd.priceKrw)} (RWD)`,
    modelY: `${_man(_myrwd.priceKrw)} (RWD)`,
  },
  {
    label: "상위 트림 출고가",
    model3: `${_man(_m3perf.priceKrw)} (Performance)`,
    modelY: `${_man(_myl.priceKrw)} (L AWD)`,
  },
  {
    label: "주행거리 (RWD)",
    model3: `${_m3rwd.rangeKm} km`,
    modelY: `${_myrwd.rangeKm} km`,
  },
  {
    label: "최장 주행거리",
    model3: `${_m3lr.rangeKm} km (LR)`,
    modelY: `${_myl.rangeKm} km (L AWD)`,
  },
  {
    label: "0→100 km/h (RWD)",
    model3: `${_m3rwd.zeroToHundred} 초`,
    modelY: `${_myrwd.zeroToHundred} 초`,
  },
  { label: "적재 구조", model3: "세단 트렁크 (개구부 낮음)", modelY: "해치백 (개구부 넓음)" },
  {
    label: "국고보조금 (RWD)",
    model3: _nationalSubsidy(_m3rwd.csvModel),
    modelY: _nationalSubsidy(_myrwd.csvModel),
  },
  {
    label: "최대 좌석 수",
    model3: `${_m3rwd.seats}인승`,
    modelY: `${_myl.seats}인승 (L AWD · 3열)`,
  },
];

const SCENARIOS = [
  {
    title: "출퇴근 위주 1~2인 가구",
    icon: "🚗",
    winner: "model3",
    reason: "Model 3 추천 — 더 낮은 출고가, 긴 주행거리로 충전 빈도 ↓. 세단 특유의 낮은 공기저항으로 효율 우수.",
  },
  {
    title: "패밀리카 · 짐 많은 활동",
    icon: "👨‍👩‍👧",
    winner: "modelY",
    reason: `Model Y 추천 — 해치백 구조라 짐을 싣고 내리기 쉽고, 착좌가 높아 카시트를 다루기 수월합니다. 3열이 상시 필요하다면 L AWD(${_myl.seats}인승, ${_man(_myl.priceKrw)})도 고려하세요. 다자녀 혜택 적용 시 실구매가 차이는 줄어듭니다.`,
  },
  {
    title: "장거리 출장 · 고속도로 위주",
    icon: "🛣️",
    winner: "model3",
    reason: "Model 3 LR 추천 — 긴 주행가능거리(약 538km)가 장거리에서 충전 부담을 줄일 수 있습니다. 다만 실제 충전 횟수는 계절·속도·공조 사용·출발 배터리·도로 상황에 따라 달라집니다.",
  },
  {
    title: "월납입금 최소화",
    icon: "💰",
    winner: "model3",
    reason: "Model 3 RWD 추천 — 출고가가 낮아 동일 선수금·할부 조건에서 월납입금도 낮아집니다. 실제 차이는 지역 보조금·할부 조건에 따라 달라지므로 아래 계산기에서 직접 확인하세요.",
  },
];

const CTA_BUTTONS = [
  {
    label: "Model 3 RWD",
    sub: "4,699만원~",
    href: "/?model=model3&trim=m3-rwd&months=60&downPayment=10000000",
    style: "bg-white text-slate-950 hover:bg-blue-50",
  },
  {
    label: "Model 3 LR",
    sub: "5,999만원~",
    href: "/?model=model3&trim=m3-lr&months=60&downPayment=10000000",
    style: "bg-white/10 text-white border border-white/20 hover:bg-white/20",
  },
  {
    label: "Model Y RWD",
    sub: "4,999만원~",
    href: "/?model=modely&trim=my-rwd&months=60&downPayment=10000000",
    style: "bg-blue-500 text-white hover:bg-blue-400",
  },
  {
    label: "Model Y LR",
    sub: "6,699만원~",
    href: "/?model=modely&trim=my-lr&months=60&downPayment=10000000",
    style: "bg-blue-500/30 text-white border border-blue-400/30 hover:bg-blue-500/50",
  },
  {
    label: "Model Y L AWD",
    sub: "7,299만원~",
    href: "/?model=modely&trim=my-l-awd&months=60&downPayment=10000000",
    style: "bg-blue-700/40 text-white border border-blue-300/30 hover:bg-blue-700/60",
  },
];

export default function Model3VsModelYPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_50%,#1d4ed8_100%)] text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="mb-4">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
              모델 비교
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black mb-3 leading-tight">
            테슬라 Model 3 vs Model Y
            <span className="block text-base md:text-xl font-normal text-blue-200 mt-2">
              가격 · 보조금 · 월납입금 · 상황별 추천 (2026)
            </span>
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">

        {/* 핵심 차이 요약 */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              핵심 비교
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black mb-4">핵심 차이 한눈에</h2>
          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(15,23,42,0.08)] border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-gray-100">
              <div className="px-2.5 py-3 text-[11px] font-semibold text-gray-500 md:px-4 md:text-xs">항목</div>
              <div className="px-2.5 py-3 text-[11px] font-semibold text-center text-slate-700 md:px-4 md:text-xs">Model 3</div>
              <div className="px-2.5 py-3 text-[11px] font-semibold text-center text-blue-600 md:px-4 md:text-xs">Model Y</div>
            </div>
            {COMPARE_DATA.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors"
              >
                <div className="px-2.5 py-3 text-[11px] text-gray-500 break-keep md:px-4 md:text-xs">{row.label}</div>
                <div className="px-2.5 py-3 text-[11px] text-center font-medium break-keep md:px-4 md:text-xs">{row.model3}</div>
                <div className="px-2.5 py-3 text-[11px] text-center font-medium break-keep md:px-4 md:text-xs">{row.modelY}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            * 가격·보조금·주행거리는 테슬라 공식 홈페이지 기준이며 변동될 수 있습니다. 데이터 기준일: {CALC_DATA_DATE}. 실구매가는 지역 보조금·할부 조건에 따라 달라집니다.
          </p>
        </section>

        {/* 상황별 추천 */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              상황별 선택
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black mb-4">상황별 추천</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SCENARIOS.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(15,23,42,0.08)] border border-gray-100 p-5 md:p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{s.icon}</span>
                  <h3 className="font-black text-sm">{s.title}</h3>
                </div>
                <div className="mb-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    s.winner === "model3"
                      ? "bg-slate-950 text-white"
                      : "bg-blue-600 text-white"
                  }`}>
                    {s.winner === "model3" ? "Model 3 추천" : "Model Y 추천"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{s.reason}</p>
                <Link
                  href={`/?model=${s.winner === "model3" ? "model3&trim=m3-rwd" : "modely&trim=my-rwd"}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  {s.winner === "model3" ? "Model 3" : "Model Y"} 월납입금 계산하기
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 내 조건으로 직접 비교 CTA */}
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] p-8 md:p-10 text-white">
          <div className="mb-4">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
              직접 계산
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black mb-2">내 조건으로 직접 비교</h2>
          <p className="text-sm text-blue-100/70 mb-6">
            지역, 선수금, 할부 기간을 직접 입력하면 두 모델의 월납입금 차이를 바로 확인할 수 있습니다.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CTA_BUTTONS.map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className={`flex flex-col items-center justify-center rounded-2xl px-4 py-4 text-sm font-bold transition-colors ${btn.style}`}
              >
                <span>{btn.label}</span>
                <span className="mt-0.5 text-[11px] font-normal opacity-70">{btn.sub}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 지역별 보조금 링크 */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              지역 보조금
            </span>
          </div>
          <h2 className="text-base font-black mb-4 text-gray-800">지역별 보조금 확인</h2>
          <div className="flex flex-wrap gap-2">
            {METRO_REGIONS.slice(0, 10).map((r) => (
              <Link
                key={r.slug}
                href={`/subsidy/${r.slug}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-full text-xs font-medium transition-colors"
              >
                {r.shortName} 보조금
              </Link>
            ))}
          </div>
        </section>

        {/* 내부 링크 */}
        <section className="rounded-[24px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 mb-4">관련 페이지</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-xl bg-white text-slate-950 px-4 py-2 text-xs font-bold hover:bg-blue-50 transition-colors">
              테슬라 보조금 계산기
            </Link>
            <Link href="/models/model-3" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              Model 3 상세
            </Link>
            <Link href="/models/model-y" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              Model Y 상세
            </Link>
            <Link href="/compare/rwd-vs-awd" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              RWD vs AWD 비교
            </Link>
            <Link href="/models/model-y-l" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              Model Y L 상세
            </Link>
          </div>
        </section>

      </div>

      <CalcContent
        sections={CHOICE_SECTIONS}
        currentHref="/compare/model-3-vs-model-y"
        dataDate={CALC_DATA_DATE}
        dataNote={`가격·주행거리는 테슬라 공식 홈페이지 기준이며 마지막 확인일은 ${VEHICLE_DATA_VERIFIED_AT}입니다. 적재 용량과 보조금 수치는 특정 시점 기준이므로, 계약 전 공식 홈페이지와 무공해차 통합누리집에서 최신 값을 다시 확인하세요.`}
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
    </main>
  );
}
