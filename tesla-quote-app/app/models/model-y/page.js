import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";

export const metadata = {
  title: "2026 테슬라 Model Y 트림별 가격·보조금·월납입금",
  description:
    "테슬라 Model Y RWD·Long Range 트림 출고가, 지역별 보조금, 실구매가 및 할부 월납입금 계산. 패밀리카 추천 모델 2026년 최신 데이터.",
  openGraph: {
    title: "2026 테슬라 Model Y 트림별 가격·보조금·월납입금",
    description:
      "테슬라 Model Y RWD·Long Range 트림 출고가, 지역별 보조금, 실구매가 및 할부 월납입금 계산.",
    url: "https://paytesla.kr/models/model-y",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://paytesla.kr/models/model-y" },
};

const TRIMS = [
  {
    id: "my-rwd",
    label: "Model Y RWD",
    sublabel: "후륜 구동 · Premium",
    price: 49990000,
    range: "400 km+",
    speed: "217 km/h",
    accel: "5.9 초",
    highlight: true,
  },
  {
    id: "my-lr",
    label: "Model Y Long Range",
    sublabel: "사륜 구동 · Premium",
    price: 59990000,
    range: "533 km",
    speed: "217 km/h",
    accel: "5.0 초",
    highlight: false,
  },
  {
    id: "my-l-awd",
    label: "Model Y L AWD",
    sublabel: "사륜 구동",
    price: 69990000,
    range: "543 km",
    speed: "201 km/h",
    accel: "5.0 초",
    highlight: false,
    subsidyPending: true,
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
            RWD · Long Range — 국내 최다 판매 전기 SUV, 지역 보조금 적용 실구매가 계산
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10">

        {/* 트림 비교 */}
        <section>
          <h2 className="text-lg md:text-xl font-bold mb-4">트림별 스펙 · 출고가</h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
                  <div className="flex justify-between">
                    <span className="text-gray-500">적재공간</span>
                    <span className="font-medium">1,925 L (최대)</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-0.5">출고가</p>
                  <p className="text-base font-bold">{formatWon(trim.price)}</p>
                  {trim.subsidyPending && (
                    <p className="text-xs text-amber-600 mt-1 font-medium">보조금 데이터 준비중</p>
                  )}
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
              테슬라 Model Y는 2026년 기준 <strong>RWD(4,999만원)</strong>와 <strong>Long Range AWD(5,999만원)</strong> 두 가지 트림으로 판매됩니다. 넉넉한 적재공간(최대 1,925L)과 높은 주행 안전성으로 패밀리카로 인기가 높습니다.
            </p>
            <p>
              지역별 보조금을 적용하면 RWD 기준 실구매가가 크게 낮아지며, 다자녀 가구는 추가 혜택도 받을 수 있습니다. 정확한 월납입금은 위 계산기에서 선수금과 할부 기간을 직접 입력해 확인하세요.
            </p>
            <p className="text-xs text-gray-400 pt-1">
              업데이트: 2026년 · 가격 및 보조금은 변경될 수 있습니다.
            </p>
          </div>
        </section>

        {/* 내부 링크 */}
        <section className="border-t border-gray-100 pt-8">
          <h2 className="text-base font-bold mb-3 text-gray-700">관련 페이지</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/models/model-3" className="px-3 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors">
              Model 3 상세
            </Link>
            <Link href="/compare/model-3-vs-model-y" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              Model 3 vs Model Y
            </Link>
            <Link href="/compare/rwd-vs-awd" className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
              RWD vs AWD 비교
            </Link>
            {["seoul", "gyeonggi", "busan", "incheon"].map((slug) => {
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
    </main>
  );
}
