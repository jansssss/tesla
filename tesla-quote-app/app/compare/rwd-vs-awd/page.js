import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";
import ContextualShopCTA from "@/components/ContextualShopCTA";

export const metadata = {
  title: "테슬라 RWD vs AWD 비교 — 가격·주행거리·보조금 2026",
  description:
    "테슬라 후륜(RWD)과 사륜(AWD) 트림을 가격, 주행거리, 보조금, 월납입금 기준으로 비교. 내 상황에 맞는 구동 방식을 선택하세요.",
  openGraph: {
    title: "테슬라 RWD vs AWD 비교 — 2026",
    description: "테슬라 후륜(RWD)과 사륜(AWD) 가격·주행거리·보조금·월납입금 비교.",
    url: "https://paytesla.kr/compare/rwd-vs-awd",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://paytesla.kr/compare/rwd-vs-awd" },
};

const COMPARE_DATA = [
  { label: "구동방식", rwd: "후륜 구동 (RWD)", awd: "사륜 구동 (AWD)" },
  { label: "Model 3 해당 트림", rwd: "RWD · Long Range", awd: "Performance" },
  { label: "Model Y 해당 트림", rwd: "Premium RWD", awd: "Long Range · L AWD" },
  { label: "Model 3 가격", rwd: "4,199만 / 5,299만", awd: "5,999만 (Performance)" },
  { label: "Model Y 가격", rwd: "4,999만", awd: "5,999만 (LR) / 6,999만 (L AWD)" },
  { label: "주행거리 (Model 3)", rwd: "682 km (RWD)", awd: "528 km (Perf)" },
  { label: "주행거리 (Model Y)", rwd: "400 km+", awd: "533 km (LR) · 543 km (L AWD)" },
  { label: "0→100 km/h", rwd: "5.3~6.2 초", awd: "3.1~5.0 초" },
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
    reason: "Model 3 LR(RWD) 추천 — 713 km로 최장 주행거리. 고속도로에서 RWD의 효율이 AWD보다 높아 실질 주행거리 유리.",
  },
  {
    title: "퍼포먼스·스포츠 드라이빙",
    icon: "🏎️",
    winner: "awd",
    reason: "AWD Performance 추천 — 0→100km/h 3.1초, 최고속도 262km/h. 순수 성능 추구라면 AWD가 압도적.",
  },
];

const CTA_BUTTONS = [
  {
    label: "Model 3 RWD",
    sub: "4,199만원~",
    href: "/?model=model3&trim=m3-rwd&months=60&downPayment=10000000",
    style: "bg-white text-slate-950 hover:bg-blue-50",
  },
  {
    label: "Model 3 LR",
    sub: "5,299만원~",
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
    sub: "5,999만원~",
    href: "/?model=modely&trim=my-lr&months=60&downPayment=10000000",
    style: "bg-blue-500/30 text-white border border-blue-400/30 hover:bg-blue-500/50",
  },
  {
    label: "Model Y L AWD",
    sub: "6,999만원~",
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
              <div className="px-4 py-3 text-xs font-semibold text-gray-500">항목</div>
              <div className="px-4 py-3 text-xs font-semibold text-center text-blue-600">RWD (후륜)</div>
              <div className="px-4 py-3 text-xs font-semibold text-center text-orange-600">AWD (사륜)</div>
            </div>
            {COMPARE_DATA.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors"
              >
                <div className="px-4 py-3 text-xs text-gray-500">{row.label}</div>
                <div className="px-4 py-3 text-xs text-center font-medium">{row.rwd}</div>
                <div className="px-4 py-3 text-xs text-center font-medium">{row.awd}</div>
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

        {/* 맥락 액세서리 CTA */}
        <ContextualShopCTA keywords={["AWD", "RWD", "Performance", "차종·트림", "휠", "익스테리어"]} />

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
    </main>
  );
}
