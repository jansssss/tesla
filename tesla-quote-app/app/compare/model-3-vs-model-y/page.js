import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";

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

export default function Model3VsModelYPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-300 transition-colors">홈</Link>
            <span>/</span>
            <span className="text-gray-400">모델 비교</span>
            <span>/</span>
            <span className="text-white">Model 3 vs Model Y</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            테슬라 Model 3 vs Model Y
            <span className="block text-base md:text-xl font-normal text-gray-400 mt-2">
              가격 · 보조금 · 월납입금 · 상황별 추천 (2026)
            </span>
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10">

        {/* 핵심 차이 요약 */}
        <section>
          <h2 className="text-lg md:text-xl font-bold mb-4">핵심 차이 한눈에</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
              <div className="px-4 py-3 text-xs font-semibold text-gray-500">항목</div>
              <div className="px-4 py-3 text-xs font-semibold text-center">Model 3</div>
              <div className="px-4 py-3 text-xs font-semibold text-center">Model Y</div>
            </div>
            {COMPARE_DATA.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
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
          <h2 className="text-lg md:text-xl font-bold mb-4">상황별 추천</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SCENARIOS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{s.icon}</span>
                  <h3 className="font-semibold text-sm">{s.title}</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{s.reason}</p>
                <Link
                  href={`/?model=${s.winner === "model3" ? "model3&trim=m3-rwd" : "modely&trim=my-rwd"}`}
                  className="mt-3 inline-block text-xs text-red-500 font-semibold hover:text-red-700"
                >
                  {s.winner === "model3" ? "Model 3" : "Model Y"} 계산기로 →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 내 조건으로 직접 비교 CTA */}
        <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
          <h2 className="text-base md:text-lg font-bold mb-2">내 조건으로 직접 비교</h2>
          <p className="text-sm text-gray-400 mb-5">
            지역, 선수금, 할부 기간을 직접 입력하면 두 모델의 월납입금 차이를 바로 확인할 수 있습니다.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/?model=model3&trim=m3-rwd&months=60&downPayment=10000000"
              className="block text-center bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              Model 3 계산하기
            </Link>
            <Link
              href="/?model=modely&trim=my-rwd&months=60&downPayment=10000000"
              className="block text-center bg-red-500 text-white font-semibold py-3 rounded-xl text-sm hover:bg-red-600 transition-colors"
            >
              Model Y 계산하기
            </Link>
          </div>
        </section>

        {/* 지역별 보조금 링크 */}
        <section>
          <h2 className="text-base font-bold mb-3 text-gray-700">지역별 보조금 확인</h2>
          <div className="flex flex-wrap gap-2">
            {METRO_REGIONS.slice(0, 10).map((r) => (
              <Link
                key={r.slug}
                href={`/subsidy/${r.slug}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium transition-colors"
              >
                {r.shortName} 보조금
              </Link>
            ))}
          </div>
        </section>

        {/* 내부 링크 */}
        <section className="border-t border-gray-100 pt-6">
          <div className="flex flex-wrap gap-2">
            <Link href="/models/model-3" className="px-3 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors">Model 3 상세</Link>
            <Link href="/models/model-y" className="px-3 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors">Model Y 상세</Link>
            <Link href="/compare/rwd-vs-awd" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">RWD vs AWD 비교</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
