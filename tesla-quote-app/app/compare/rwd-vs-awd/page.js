import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";
import CalcContent from "@/components/calc/CalcContent";
import { CALC_DATA_DATE, CALC_DEFAULTS } from "@/lib/calcExtra";
import { getTrimById, VEHICLE_DATA_VERIFIED_AT } from "@/lib/vehicleData";

const _m3rwd = getTrimById("m3-rwd");
const _m3lr = getTrimById("m3-lr");
const _m3perf = getTrimById("m3-perf");
const _myrwd = getTrimById("my-rwd");
const _mylr = getTrimById("my-lr");

const _man = (won) => `${(won / 10000).toLocaleString()}만원`;

const DRIVETRAIN_SECTIONS = [
  {
    heading: "구동 방식이 실제로 바꾸는 것은 세 가지뿐이다",
    lead: "RWD와 AWD의 차이를 '성능 차이'로 뭉뚱그리면 판단이 어려워집니다. 실제로 달라지는 것은 접지력, 가속, 효율 세 가지이고 나머지는 대체로 같습니다.",
    blocks: [
      {
        type: "table",
        headers: ["항목", "RWD (후륜)", "AWD (사륜)"],
        rows: [
          ["구동 모터", "뒤쪽 1개", "앞뒤 2개"],
          ["미끄러운 노면 접지력", "보통", "유리 — 구동력이 네 바퀴에 분산"],
          ["가속", "충분한 수준", "빠름 — 같은 모델 기준 우위"],
          ["전비", "유리 — 모터가 하나", "다소 불리 — 중량과 구동 손실 증가"],
          ["가격", "낮음", "높음"],
        ],
        note: "실내 공간, 적재 용량, 인포테인먼트, 안전 장비 등은 구동 방식과 무관하게 동일한 경우가 대부분입니다. 정확한 트림별 사양은 공식 홈페이지에서 확인하세요.",
      },
      {
        type: "text",
        paragraphs: [
          "정리하면 AWD는 '눈길과 가속에 돈을 더 쓰는 선택'입니다. 그 두 가지가 본인에게 얼마나 자주 필요한지가 판단의 기준이 됩니다.",
          "많은 사람이 '안전을 위해 AWD'라고 생각하지만, 안전에서 구동 방식이 기여하는 부분은 생각보다 좁습니다. 다음 항목에서 그 범위를 정확히 짚습니다.",
        ],
      },
    ],
  },
  {
    heading: "겨울철에 AWD가 유리한 지점과 그 한계",
    lead: "눈길에서 AWD가 도움이 되는 것은 사실입니다. 다만 어느 국면에서 도움이 되는지를 알아야 과신하지 않습니다.",
    blocks: [
      {
        type: "compare",
        columns: [
          {
            title: "AWD가 실제로 도와주는 것",
            tone: "good",
            items: [
              "눈길·빙판에서 출발할 때 바퀴가 헛도는 현상이 줄어든다",
              "경사로에서 미끄러운 노면을 올라갈 때 유리하다",
              "가속 시 구동력이 네 바퀴에 분산되어 안정적이다",
              "후륜 구동 특유의 저속 미끄러짐이 덜하다",
            ],
          },
          {
            title: "AWD가 도와주지 않는 것",
            tone: "bad",
            items: [
              "제동 거리 — 브레이크는 네 바퀴 모두 작동하므로 차이가 없다",
              "코너링 한계 — 결국 타이어 접지력이 결정한다",
              "빙판에서의 조향 — 구동 방식과 직접 관련이 없다",
              "겨울 안전은 타이어가 구동 방식보다 큰 변수다",
            ],
          },
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "가장 중요한 한 가지",
        text: "겨울 주행 안전에서 가장 큰 변수는 구동 방식이 아니라 타이어입니다. 눈이 잦은 지역이라면 RWD에 겨울용 타이어를 끼우는 편이, AWD에 사계절 타이어를 끼우는 것보다 나은 경우가 많습니다. AWD를 골랐다고 겨울 타이어가 불필요해지는 것은 아닙니다.",
      },
      {
        type: "text",
        paragraphs: [
          "이 관점에서 보면 '눈길 때문에 AWD'라는 결정은 한 번 더 따져볼 여지가 있습니다. 차값 차이로 겨울 타이어를 몇 번이나 살 수 있는지 계산해보면 판단이 달라지기도 합니다.",
          "다만 강원 산간이나 경사로가 많은 지역처럼 출발 자체가 어려운 환경이라면, 타이어만으로 해결되지 않는 국면이 있어 AWD의 값어치가 분명해집니다.",
        ],
      },
    ],
  },
  {
    heading: "AWD를 선택하면 비용은 얼마나 늘어나나",
    lead: "차값 차이만 보면 판단이 반쪽입니다. 전비가 불리해지므로 유지비도 함께 늘어납니다.",
    blocks: [
      {
        type: "table",
        headers: ["비교", "RWD", "AWD", "차이"],
        rows: [
          [
            "Model 3",
            `${_m3rwd.trim} ${_man(_m3rwd.priceKrw)}`,
            `${_m3perf.trim} ${_man(_m3perf.priceKrw)}`,
            `+${_man(_m3perf.priceKrw - _m3rwd.priceKrw)}`,
          ],
          [
            "Model Y",
            `${_myrwd.trim} ${_man(_myrwd.priceKrw)}`,
            `${_mylr.trim} ${_man(_mylr.priceKrw)}`,
            `+${_man(_mylr.priceKrw - _myrwd.priceKrw)}`,
          ],
        ],
        note: `테슬라 공식 홈페이지 기준 출고가, 확인일 ${VEHICLE_DATA_VERIFIED_AT}. Model 3의 AWD 트림은 Performance이므로 성능 차이가 함께 반영된 가격입니다. 보조금 적용 후 실구매가 차이는 트림별 보조금 금액에 따라 달라집니다.`,
      },
      {
        type: "list",
        title: "차값 외에 늘어나는 비용",
        items: [
          "충전비 — 전비가 불리한 만큼 같은 거리를 달릴 때 전력을 더 씁니다. 연 단위로 누적되면 무시하기 어렵습니다.",
          "보험료 — 차량가액이 오르면 자차 보험료가 함께 오릅니다.",
          "타이어 — 상위 트림일수록 큰 휠·고성능 타이어가 적용되는 경우가 있어 교체 비용이 올라갈 수 있습니다.",
        ],
      },
      {
        type: "text",
        paragraphs: [
          `충전비 차이는 충전비 계산기에서 전비를 각각 다르게 넣어 비교하면 바로 확인할 수 있습니다. 기본 가정값은 ${CALC_DEFAULTS.efficiency}km/kWh이므로, AWD는 이보다 낮춘 값으로 계산해보세요.`,
          "차값 차이에 5년치 충전비·보험료 차이를 더한 금액이 AWD를 선택하는 실제 비용입니다. 총소유비용 계산기에서 두 조건을 각각 계산해 비교하는 것을 권합니다.",
        ],
      },
    ],
  },
  {
    heading: "그래서 어느 쪽을 고를 것인가",
    blocks: [
      {
        type: "compare",
        columns: [
          {
            title: "RWD로 충분한 경우",
            tone: "good",
            items: [
              "도심 출퇴근이 주 용도다",
              "눈이 거의 오지 않는 지역에 산다",
              "월 부담을 낮추는 것이 우선이다",
              "전비와 유지비를 중시한다",
              "겨울에는 겨울용 타이어를 낄 생각이 있다",
            ],
          },
          {
            title: "AWD가 값어치를 하는 경우",
            tone: "bad",
            items: [
              "눈·빙판이 잦은 지역이나 경사로가 많은 곳에 산다",
              "겨울 장거리 이동이 정기적으로 있다",
              "가속 성능 자체를 중요하게 본다",
              `${_mylr.trimFull}처럼 긴 주행거리가 함께 필요하다`,
              "차값·유지비 차이를 감수할 여지가 있다",
            ],
          },
        ],
      },
      {
        type: "text",
        paragraphs: [
          `주행거리 관점에서는 조합이 조금 복잡합니다. ${_m3lr.trimFull}는 RWD인데도 ${_m3lr.rangeKm}km로 라인업에서 긴 편이고, ${_mylr.trimFull}는 AWD이면서 ${_mylr.rangeKm}km입니다. '긴 주행거리 = AWD'가 아니라는 뜻입니다.`,
          "따라서 구동 방식과 주행거리를 별개의 축으로 놓고, 두 조건을 동시에 만족하는 트림이 무엇인지 찾는 방식이 실용적입니다.",
        ],
      },
    ],
  },
  {
    heading: "구동 방식 선택에 대해 자주 묻는 것들",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "눈 오는 지역인데 RWD를 사면 위험한가요?",
            a: "위험하다고 단정할 수는 없습니다. 겨울용 타이어를 장착하면 RWD로도 대부분의 겨울 도로 상황에 대응할 수 있습니다. 다만 경사가 급한 언덕에서 눈길 출발이 반복되는 환경이라면 AWD가 확실히 편합니다. 거주지 도로 환경을 기준으로 판단하세요.",
          },
          {
            q: "AWD가 주행거리도 더 긴 것 아닌가요?",
            a: `트림에 따라 다릅니다. ${_mylr.trimFull}(AWD)는 ${_mylr.rangeKm}km로 ${_myrwd.trimFull}의 ${_myrwd.rangeKm}km보다 길지만, 이는 배터리 용량 차이 때문이지 구동 방식 때문이 아닙니다. 같은 배터리라면 모터가 하나인 RWD가 전비에서 유리합니다.`,
          },
          {
            q: "보조금은 구동 방식에 따라 다른가요?",
            a: "구동 방식 자체가 아니라 차량 가격과 효율 등을 기준으로 국고보조금이 산정되므로, 결과적으로 트림별 금액이 달라집니다. AWD 트림은 가격이 높아 보조금 산정 구간이 달라질 수 있습니다. 정확한 금액은 실구매가 계산기에서 지역과 트림을 선택해 확인하세요.",
          },
          {
            q: "중고로 팔 때 AWD가 유리한가요?",
            a: "중고 시세는 트림·색상·주행거리·사고 이력·시장 상황 등 여러 요인에 좌우되므로 구동 방식만으로 단정하기 어렵습니다. 총소유비용 계산기에서 감가상각률을 낙관적인 값과 보수적인 값으로 각각 넣어보고, 그 범위 안에서 판단하는 편이 현실적입니다.",
          },
        ],
      },
    ],
  },
];

export const metadata = {
  title: "테슬라 RWD vs AWD 비교 — 가격·주행거리·보조금 2026",
  description:
    "테슬라 후륜(RWD)과 사륜(AWD) 트림을 가격, 주행거리, 보조금, 월납입금 기준으로 비교. 내 상황에 맞는 구동 방식을 선택하세요.",
  openGraph: {
    title: "테슬라 RWD vs AWD 비교 — 2026",
    description: "테슬라 후륜(RWD)과 사륜(AWD) 가격·주행거리·보조금·월납입금 비교.",
    url: "https://www.paytesla.kr/compare/rwd-vs-awd",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/compare/rwd-vs-awd" },
};

const COMPARE_DATA = [
  { label: "구동방식", rwd: "후륜 구동 (RWD)", awd: "사륜 구동 (AWD)" },
  { label: "Model 3 해당 트림", rwd: "RWD · Long Range", awd: "Performance" },
  { label: "Model Y 해당 트림", rwd: "Premium RWD", awd: "Long Range · L AWD" },
  { label: "Model 3 가격", rwd: "4,699만 / 5,999만", awd: "6,999만 (Performance)" },
  { label: "Model Y 가격", rwd: "4,999만", awd: "6,699만 (LR) / 7,299만 (L AWD)" },
  { label: "주행거리 (Model 3)", rwd: "382 km (RWD)", awd: "450 km (Perf)" },
  { label: "주행거리 (Model Y)", rwd: "400 km", awd: "505 km (LR) · 543 km (L AWD)" },
  { label: "0→100 km/h", rwd: "5.2~6.2 초", awd: "3.1~5.0 초" },
  { label: "겨울철 접지력", rwd: "보통", awd: "우수" },
  { label: "에너지 효율", rwd: "높음", awd: "약간 낮음" },
];

const SCENARIOS = [
  {
    title: "일반 도심 출퇴근",
    icon: "🏙️",
    winner: "rwd",
    reason: "RWD 추천 — 가격이 수백~천만원 낮고, 도심 주행에서 AWD 특유의 장점이 크지 않음. 연간 유지비 절감 효과.",
  },
  {
    title: "강원·경북 등 눈길 많은 지역",
    icon: "❄️",
    winner: "awd",
    reason: "AWD 추천 — 눈길·빗길 접지력이 확연히 우수. 특히 경사진 도로나 미끄러운 노면에서 안전성 차이 큼. Model Y L AWD는 대가족 눈길 장거리에도 최적.",
  },
  {
    title: "고속도로 장거리 위주",
    icon: "🛣️",
    winner: "rwd",
    reason: "Model 3 LR(RWD) 추천 — 538 km로 최장 주행거리. 고속도로에서 RWD의 효율이 AWD보다 높아 실질 주행거리 유리.",
  },
  {
    title: "퍼포먼스·스포츠 드라이빙",
    icon: "🏎️",
    winner: "awd",
    reason: "AWD Performance 추천 — 0→100km/h 3.1초, 최고속도 261km/h. 순수 성능 추구라면 AWD가 압도적.",
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

export default function RwdVsAwdPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_50%,#1d4ed8_100%)] text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="mb-4">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
              구동방식 비교
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black mb-3 leading-tight">
            테슬라 RWD vs AWD
            <span className="block text-base md:text-xl font-normal text-blue-200 mt-2">
              후륜·사륜 구동방식 비교 — 가격·주행거리·보조금 (2026)
            </span>
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">

        {/* 핵심 비교 */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              핵심 비교
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black mb-4">RWD vs AWD 핵심 비교</h2>
          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(15,23,42,0.08)] border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-gray-100">
              <div className="px-2.5 py-3 text-[11px] font-semibold text-gray-500 md:px-4 md:text-xs">항목</div>
              <div className="px-2.5 py-3 text-[11px] font-semibold text-center text-blue-600 md:px-4 md:text-xs">RWD (후륜)</div>
              <div className="px-2.5 py-3 text-[11px] font-semibold text-center text-orange-600 md:px-4 md:text-xs">AWD (사륜)</div>
            </div>
            {COMPARE_DATA.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors"
              >
                <div className="px-2.5 py-3 text-[11px] text-gray-500 break-keep md:px-4 md:text-xs">{row.label}</div>
                <div className="px-2.5 py-3 text-[11px] text-center font-medium break-keep md:px-4 md:text-xs">{row.rwd}</div>
                <div className="px-2.5 py-3 text-[11px] text-center font-medium break-keep md:px-4 md:text-xs">{row.awd}</div>
              </div>
            ))}
          </div>
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
                    s.winner === "rwd"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {s.winner === "rwd" ? "RWD 추천" : "AWD 추천"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{s.reason}</p>
                <Link
                  href={s.winner === "rwd"
                    ? "/?model=model3&trim=m3-rwd&months=60&downPayment=10000000"
                    : "/?model=model3&trim=m3-perf&months=60&downPayment=10000000"
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  {s.winner === "rwd" ? "RWD" : "AWD"} 월납입금 계산하기
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 내 조건으로 직접 계산 CTA */}
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] p-8 md:p-10 text-white">
          <div className="mb-4">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
              직접 계산
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black mb-2">내 조건으로 직접 계산</h2>
          <p className="text-sm text-blue-100/70 mb-6">
            선수금, 할부 기간, 지역을 입력하면 RWD와 AWD의 정확한 월납입금 차이를 확인할 수 있습니다.
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
            <Link href="/models/model-3" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              Model 3 상세
            </Link>
            <Link href="/models/model-y" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              Model Y 상세
            </Link>
            <Link href="/compare/model-3-vs-model-y" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              Model 3 vs Model Y
            </Link>
          </div>
        </section>

      </div>

      <CalcContent
        sections={DRIVETRAIN_SECTIONS}
        currentHref="/compare/rwd-vs-awd"
        dataDate={CALC_DATA_DATE}
        dataNote={`가격·주행거리·가속 수치는 테슬라 공식 홈페이지 기준이며 마지막 확인일은 ${VEHICLE_DATA_VERIFIED_AT}입니다. 접지력·효율에 대한 서술은 구동 방식의 일반적인 특성을 설명한 것으로, 실제 체감은 타이어·노면·운전 습관에 따라 달라집니다.`}
        relatedHeading="구동 방식을 정했다면 이어서 볼 계산기"
        sources={[
          {
            name: "테슬라 공식 — 차량 사양",
            url: "https://www.tesla.com/ko_kr",
            note: "가격·주행거리·가속 원본",
          },
          {
            name: "무공해차 통합누리집",
            url: "https://www.ev.or.kr",
            note: "보조금 공식 정보",
          },
        ]}
      />
    </main>
  );
}
