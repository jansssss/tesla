import Link from "next/link";
import { METRO_REGIONS } from "@/lib/regions";
import { CALC_DATA_DATE } from "@/lib/calcExtra";
import { getTrimsByModel } from "@/lib/vehicleData";

export const metadata = {
  title: "2026 테슬라 Model 3 트림별 가격·보조금·월납입금",
  description:
    "테슬라 Model 3 RWD·Long Range·Performance 트림 출고가, 지역별 보조금, 실구매가 및 할부 월납입금 계산. 2026년 최신 데이터.",
  openGraph: {
    title: "2026 테슬라 Model 3 트림별 가격·보조금·월납입금",
    description:
      "테슬라 Model 3 RWD·Long Range·Performance 트림 출고가, 지역별 보조금, 실구매가 및 할부 월납입금 계산.",
    url: "https://paytesla.kr/models/model-3",
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://paytesla.kr/models/model-3" },
};

// 가격은 lib/vehicleData.js 단일 원본에서 가져옴.
// 주행거리·성능 수치는 파일 간 충돌이 있어 별도 확인 필요 (docs/vehicle-data-verification-todo.md).
const _vehicleTrims = getTrimsByModel("Model 3");
const _priceMap = Object.fromEntries(_vehicleTrims.map((t) => [t.id, t.priceKrw]));

const TRIMS = [
  {
    id: "m3-rwd",
    label: "Model 3 RWD",
    sublabel: "후륜 구동",
    price: _priceMap["m3-rwd"],
    range: "382 km",
    speed: "201 km/h",
    accel: "6.2 초",
    highlight: false,
  },
  {
    id: "m3-lr",
    label: "Model 3 Long Range",
    sublabel: "후륜 구동",
    price: _priceMap["m3-lr"],
    range: "538 km",
    speed: "201 km/h",
    accel: "5.2 초",
    highlight: true,
  },
  {
    id: "m3-perf",
    label: "Model 3 Performance",
    sublabel: "사륜 구동",
    price: _priceMap["m3-perf"],
    range: "450 km",
    speed: "261 km/h",
    accel: "3.1 초",
    highlight: false,
  },
];

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
              테슬라 Model 3는 2026년 기준 <strong>RWD(4,199만원)</strong>, <strong>Long Range(5,299만원)</strong>, <strong>Performance(5,999만원)</strong> 세 가지 트림으로 판매됩니다.
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
