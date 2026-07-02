import { notFound } from "next/navigation";
import { loadSubsidySnapshot } from "@/lib/subsidy";
import { METRO_BY_SLUG, ALL_SLUGS, calcMetroSubsidyStats } from "@/lib/regions";
import { CALC_DATA_DATE } from "@/lib/calcExtra";
import RegionHero from "@/components/seo/RegionHero";
import RegionSubsidyTable from "@/components/seo/RegionSubsidyTable";
import RegionPresetButtons from "@/components/seo/RegionPresetButtons";
import RegionFAQ from "@/components/seo/RegionFAQ";
import RegionInternalLinks from "@/components/seo/RegionInternalLinks";
import Link from "next/link";

export async function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ region: slug }));
}

export const revalidate = 604800; // 7일 ISR

export async function generateMetadata({ params }) {
  const { region } = await params;
  const metro = METRO_BY_SLUG[region];
  if (!metro) return {};

  const title = `2026 ${metro.name} 테슬라 보조금 실구매가 계산`;
  const description = `${metro.name} 테슬라 Model 3·Model Y 보조금 총액, 실구매가 및 월납입금 자동 계산. 국고보조금+${metro.shortName} 지방보조금 합산 2026년 최신 데이터.`;

  // 비공개(noindex) 기준:
  //  - '도(do)': 단일 보조금 수치 없이 시/군/구로 위임하는 얇은 템플릿
  //  - 보조금 수치 데이터가 없는(출처·확인값 부재) 지역 → draft 취급(공개 유지 안 함)
  const snapshot = loadSubsidySnapshot();
  const stats = calcMetroSubsidyStats(snapshot.rows, metro);
  const hasData = stats.statsByModel.some((s) => (s.max || 0) > 0);
  const noindex = metro.type === "do" || !hasData;

  return {
    title,
    description,
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      url: `https://www.paytesla.kr/subsidy/${region}`,
      siteName: "테슬라 얼마?",
      locale: "ko_KR",
      type: "website",
    },
    alternates: {
      canonical: `https://www.paytesla.kr/subsidy/${region}`,
    },
  };
}

export default async function RegionSubsidyPage({ params }) {
  const { region } = await params;
  const metro = METRO_BY_SLUG[region];
  if (!metro) notFound();

  const snapshot = loadSubsidySnapshot();
  const stats = calcMetroSubsidyStats(snapshot.rows, metro);

  const m3rwd = stats.statsByModel.find((s) => s.trimId === "m3-rwd");
  const m3lr = stats.statsByModel.find((s) => s.trimId === "m3-lr");
  const myRwd = stats.statsByModel.find((s) => s.trimId === "my-rwd");

  // 대표 코드: si → representativeCode, do → 가장 보조금 높은 기초자치단체
  const repCode =
    metro.representativeCode ?? m3rwd?.repCode ?? stats.districts[0]?.code ?? "";

  const presets = [
    {
      label: "Model 3 RWD · 기본 조건",
      sublabel: `보조금 최대 ${m3rwd?.max ?? 0}만원 적용`,
      url: `/?model=model3&trim=m3-rwd&region=${repCode}&downPayment=10000000&months=60&rate=3.6`,
    },
    {
      label: "Model 3 Long Range · 60개월",
      sublabel: `보조금 최대 ${m3lr?.max ?? 0}만원 적용`,
      url: `/?model=model3&trim=m3-lr&region=${repCode}&downPayment=10000000&months=60&rate=3.6`,
    },
    {
      label: "Model Y RWD · 선수금 1,500만",
      sublabel: `보조금 최대 ${myRwd?.max ?? 0}만원 적용`,
      url: `/?model=modely&trim=my-rwd&region=${repCode}&downPayment=15000000&months=60&rate=3.6`,
    },
  ];

  // JSON-LD BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://www.paytesla.kr" },
      { "@type": "ListItem", position: 2, name: "지역별 보조금", item: "https://www.paytesla.kr/subsidy" },
      { "@type": "ListItem", position: 3, name: metro.name, item: `https://www.paytesla.kr/subsidy/${region}` },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <RegionHero metro={metro} stats={stats} />

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
        {/* 보조금 현황 테이블 */}
        <RegionSubsidyTable stats={stats} metro={metro} />

        {/* 데이터 출처·확인 신뢰 박스 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-3">데이터 출처 및 확인 안내</h2>
          <dl className="space-y-1.5 text-xs md:text-sm text-slate-600">
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold text-slate-500">데이터 기준일</dt>
              <dd>{snapshot.dataDate ?? CALC_DATA_DATE}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold text-slate-500">국고보조금 출처</dt>
              <dd>환경부 무공해차 통합누리집</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold text-slate-500">지방보조금 출처</dt>
              <dd>{metro.name} 전기차 보급사업 공고</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold text-slate-500">마지막 확인일</dt>
              <dd>{snapshot.dataDate ?? CALC_DATA_DATE}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            최종 지급액은 예산 잔액, 출고·등록일, 자격요건에 따라 달라질 수 있습니다.
          </p>
          <a
            href="https://ev.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
          >
            무공해차 통합누리집에서 공식 공고 확인 →
          </a>
        </section>

        {/* 계산기 프리셋 버튼 */}
        <RegionPresetButtons presets={presets} metro={metro} />

        {/* SEO 텍스트 요약 블록 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
          <h2 className="text-base font-bold mb-3 text-gray-800">
            {metro.name} 테슬라 구매 요약
          </h2>
          <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <p>
              {metro.name} 기준 2026년 테슬라 Model 3 RWD 예상 실구매가는{" "}
              <strong>
                {m3rwd?.max
                  ? `약 ${Math.round((46990000 - m3rwd.max * 10000) / 10000).toLocaleString()}만원`
                  : "보조금 적용 후 계산기 확인"}
              </strong>
              입니다 (보조금 최대 {m3rwd?.max ?? 0}만원 반영).
            </p>
            <p>
              Model Y RWD는{" "}
              <strong>
                {myRwd?.max
                  ? `약 ${Math.round((49990000 - myRwd.max * 10000) / 10000).toLocaleString()}만원`
                  : "보조금 적용 후 계산기 확인"}
              </strong>{" "}
              수준입니다 (보조금 최대 {myRwd?.max ?? 0}만원 반영).
            </p>
            {metro.type === "do" && (
              <p>
                {metro.name}은 시/군/구별로 지방보조금이 다르게 책정됩니다.
                정확한 보조금은 위 시/군/구 선택 후 계산기에서 확인하세요.
              </p>
            )}
            <p className="text-xs text-gray-400 pt-1">
              업데이트: 2026년 · 보조금은 예산 소진 및 정책 변경으로 달라질 수 있습니다.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <RegionFAQ metro={metro} stats={stats} />

        {/* 계산기 CTA */}
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] px-8 py-10 md:px-12 md:py-12 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
                지역별 계산기
              </span>
              <h2 className="mt-3 text-xl md:text-2xl font-black leading-tight">
                내 조건으로 정확하게<br />
                월 납입금을 계산해보세요
              </h2>
              <p className="mt-2 text-sm text-blue-100/70">
                {metro.shortName} 보조금이 자동 적용됩니다. 선수금·할부 기간도 직접 설정 가능.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href={`/?region=${repCode}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
              >
                {metro.shortName} 계산기 바로가기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* 내부 링크 */}
        <RegionInternalLinks currentSlug={region} />
      </div>
    </main>
  );
}
