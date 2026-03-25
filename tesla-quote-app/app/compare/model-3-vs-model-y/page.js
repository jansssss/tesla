import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";
import ContextualShopCTA from "@/components/ContextualShopCTA";

export const metadata = {
  title: "테슬라 Model 3 vs Model Y 비교 — 가격·보조금·월납입금 2026",
  description:
    "테슬라 Model 3와 Model Y를 가격, 주행거리, 보조금, 월납입금 기준으로 비교. 내 상황에 맞는 모델을 계산기로 직접 확인하세요.",
  openGraph: {
    title: "테슬라 Model 3 vs Model Y 비교 — 2026",
    description: "테슬라 Model 3와 Model Y 가격·보조금·월납입금 비교.",
    url: "https://paytesla.kr/compare/model-3-vs-model-y",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://paytesla.kr/compare/model-3-vs-model-y" },
};

function formatWon(amount) {
  return `₩${Number(amount).toLocaleString("ko-KR")}`;
}

const COMPARE_DATA = [
  { label: "차종", model3: "세단", modelY: "SUV (크로스오버)" },
  { label: "최저 출고가", model3: "4,199만원 (RWD)", modelY: "4,999만원 (RWD)" },
  { label: "주행거리 (RWD)", model3: "682 km", modelY: "400 km+" },
  { label: "0→100 km/h (RWD)", model3: "6.2 초", modelY: "5.9 초" },
  { label: "최고속도", model3: "201 km/h", modelY: "217 km/h" },
  { label: "적재공간", model3: "594 L (트렁크)", modelY: "1,925 L (최대)" },
  { label: "국고보조금 (RWD)", model3: "168만원", modelY: "170만원" },
  { label: "7인승 옵션", model3: "없음", modelY: "없음" },
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
    reason: "Model Y 추천 — SUV 적재공간(최대 1,925L), 높은 시야, 안전성. 다자녀 혜택 적용 시 실구매가 차이 축소.",
  },
  {
    title: "장거리 출장 · 고속도로 위주",
    icon: "🛣️",
    winner: "model3",
    reason: "Model 3 LR 추천 — 713 km 주행거리로 서울-부산 왕복도 충전 없이 가능. 고속 주행 효율 우수.",
  },
  {
    title: "월납입금 최소화",
    icon: "💰",
    winner: "model3",
    reason: "Model 3 RWD 추천 — 출고가가 800만원 낮아 동일 조건에서 월납입금이 약 13,000~15,000원 낮음.",
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
              <div className="px-4 py-3 text-xs font-semibold text-gray-500">항목</div>
              <div className="px-4 py-3 text-xs font-semibold text-center text-slate-700">Model 3</div>
              <div className="px-4 py-3 text-xs font-semibold text-center text-blue-600">Model Y</div>
            </div>
            {COMPARE_DATA.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors"
              >
                <div className="px-4 py-3 text-xs text-gray-500">{row.label}</div>
                <div className="px-4 py-3 text-xs text-center font-medium">{row.model3}</div>
                <div className="px-4 py-3 text-xs text-center font-medium">{row.modelY}</div>
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
          <div className="grid grid-cols-2 gap-3">
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
        <ContextualShopCTA keywords={["Model 3", "Model Y", "트렁크", "인테리어", "구매"]} />

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
            <Link href="/compare/rwd-vs-awd" className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              RWD vs AWD 비교
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
