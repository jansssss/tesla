import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";

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
  { label: "Model 3 해당 트림", rwd: "RWD, Long Range", awd: "Performance" },
  { label: "Model Y 해당 트림", rwd: "Premium RWD", awd: "Long Range" },
  { label: "Model 3 가격 차이", rwd: "4,199만 / 5,299만", awd: "5,999만 (Performance)" },
  { label: "Model Y 가격 차이", rwd: "4,999만", awd: "5,999만 (Long Range)" },
  { label: "주행거리 (Model 3)", rwd: "682 km (RWD)", awd: "528 km (Perf)" },
  { label: "주행거리 (Model Y)", rwd: "400 km+", awd: "533 km (LR)" },
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
    reason: "AWD 추천 — 눈길·빗길 접지력이 확연히 우수. 특히 경사진 도로나 미끄러운 노면에서 안전성 차이 큼.",
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

export default function RwdVsAwdPage() {
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
            <span className="text-white">RWD vs AWD</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            테슬라 RWD vs AWD
            <span className="block text-base md:text-xl font-normal text-gray-400 mt-2">
              후륜·사륜 구동방식 비교 — 가격·주행거리·보조금 (2026)
            </span>
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10">

        {/* 핵심 비교 */}
        <section>
          <h2 className="text-lg md:text-xl font-bold mb-4">RWD vs AWD 핵심 비교</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
              <div className="px-4 py-3 text-xs font-semibold text-gray-500">항목</div>
              <div className="px-4 py-3 text-xs font-semibold text-center">RWD (후륜)</div>
              <div className="px-4 py-3 text-xs font-semibold text-center">AWD (사륜)</div>
            </div>
            {COMPARE_DATA.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
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
          <h2 className="text-lg md:text-xl font-bold mb-4">상황별 추천</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SCENARIOS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{s.icon}</span>
                  <h3 className="font-semibold text-sm">{s.title}</h3>
                </div>
                <div className="mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    s.winner === "rwd" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {s.winner === "rwd" ? "RWD 추천" : "AWD 추천"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{s.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 직접 비교 CTA */}
        <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
          <h2 className="text-base md:text-lg font-bold mb-2">내 조건으로 직접 계산</h2>
          <p className="text-sm text-gray-400 mb-5">
            선수금, 할부 기간, 지역을 입력하면 RWD와 AWD의 정확한 월납입금 차이를 확인할 수 있습니다.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/?model=model3&trim=m3-rwd&months=60&downPayment=10000000"
              className="block text-center bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              Model 3 RWD 계산
            </Link>
            <Link
              href="/?model=model3&trim=m3-lr&months=60&downPayment=10000000"
              className="block text-center bg-red-500 text-white font-semibold py-3 rounded-xl text-sm hover:bg-red-600 transition-colors"
            >
              Model 3 LR 계산
            </Link>
          </div>
        </section>

        {/* 지역 링크 */}
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
            <Link href="/compare/model-3-vs-model-y" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">Model 3 vs Model Y</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
