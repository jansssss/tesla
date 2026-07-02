import { Suspense } from "react";
import Link from "next/link";
import QuoteWizard from "@/components/QuoteWizard";
import QuoteWizardSkeleton from "@/components/QuoteWizardSkeleton";
import { loadSubsidySnapshot } from "@/lib/subsidy";
import { CALC_DATA_DATE } from "@/lib/calcExtra";
import { METRO_REGIONS, METRO_BY_SLUG, calcMetroSubsidyStats } from "@/lib/regions";
import { monthlyPayment, formatWon } from "@/lib/quoteCalculations";

const SITE_URL = "https://www.paytesla.kr";
const PAGE_URL = `${SITE_URL}/calc/tesla-subsidy`;

export const metadata = {
  title: { absolute: "테슬라 보조금 계산기 2026 - Model 3·Model Y 실구매가 | 테슬라 얼마?" },
  description:
    "2026년 테슬라 Model 3·Model Y의 국고보조금·지자체 보조금을 자동 적용해 실구매가와 월 할부금을 계산하고, 취득세 감면 등 구매 시 고려할 항목을 함께 안내합니다.",
  openGraph: {
    title: "테슬라 보조금 계산기 2026 - Model 3·Model Y 실구매가",
    description:
      "2026년 테슬라 Model 3·Model Y의 국고·지자체 보조금 자동 적용 실구매가·월납입금 계산기.",
    url: PAGE_URL,
    siteName: "테슬라 얼마?",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: PAGE_URL },
};

// 화면(FAQ 섹션)과 FAQPage 구조화 데이터에 함께 사용
const FAQS = [
  {
    q: "테슬라 보조금은 어떻게 구성되나요?",
    a: "테슬라 보조금은 환경부가 전국 동일하게 지급하는 국고보조금과, 각 지자체가 예산으로 추가 지급하는 지자체 보조금으로 구성됩니다. 두 금액을 합산해 출고가에서 차감하면 실구매가가 정해지며, Model 3·Model Y 모두 보조금 대상입니다. 지역·모델·트림에 따라 금액이 다르므로 위 계산기에서 지역을 선택해 확인하세요.",
  },
  {
    q: "실구매가와 월납입금은 어떻게 계산하나요?",
    a: "출고가에서 국고·지자체 보조금(청년·다자녀 등 가산 포함)을 차감하면 실구매가가 됩니다. 여기에 선수금·금리·할부 개월 수를 입력하면 월납입금이 계산됩니다. 계산기에서 지역을 선택하면 해당 지방보조금이 자동 적용됩니다.",
  },
  {
    q: "전기차 취득세도 줄어드나요?",
    a: "전기차는 취득세 감면 혜택이 있습니다. 다만 감면 한도와 조건은 연도·정책에 따라 달라질 수 있으므로, 정확한 취득세와 감면액은 관할 지자체·차량 판매처에서 확인하는 것이 좋습니다. 이 계산기는 보조금 반영 실구매가와 월납입금을 중심으로 계산합니다.",
  },
  {
    q: "2026년 보조금은 어느 시점 기준인가요?",
    a: `계산기의 보조금 데이터는 ${CALC_DATA_DATE} 기준입니다. 보조금은 예산 소진·정책 변경으로 시기에 따라 달라질 수 있으므로, 신청 전 무공해차 통합누리집과 해당 지자체 공고에서 최신 금액을 확인하세요.`,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "테슬라 보조금 계산기",
      url: PAGE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "2026년 테슬라 Model 3·Model Y의 국고보조금·지자체 보조금을 자동 적용해 실구매가와 월납입금을 계산하는 무료 계산기.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "테슬라 보조금 계산기", item: PAGE_URL },
      ],
    },
  ],
};

// 검색 스니펫용 정적 요약표에 쓰는 예시 금융 조건 (선수금·금리·개월)
const SUMMARY_EXAMPLE_FINANCING = { downPayment: 10000000, rate: 3.6, months: 60 };

function buildSummaryRow(stat) {
  if (!stat) return null;
  const nationalWon = (stat.repRow?.national_subsidy_manwon ?? 0) * 10000;
  const localWon = (stat.repRow?.local_subsidy_manwon ?? 0) * 10000;
  const subsidyWon = (stat.max || 0) * 10000;
  const realPrice = Math.max(stat.price - subsidyWon, 0);
  const loanPrincipal = Math.max(realPrice - SUMMARY_EXAMPLE_FINANCING.downPayment, 0);
  const monthly = Math.round(
    monthlyPayment(loanPrincipal, SUMMARY_EXAMPLE_FINANCING.rate, SUMMARY_EXAMPLE_FINANCING.months)
  );
  return { label: stat.label, price: stat.price, nationalWon, localWon, subsidyWon, realPrice, monthly };
}

export default function TeslaSubsidyCalculatorPage() {
  const snapshot = loadSubsidySnapshot();
  const dataDate = snapshot.dataDate ?? CALC_DATA_DATE;

  const seoulStats = calcMetroSubsidyStats(snapshot.rows, METRO_BY_SLUG.seoul);
  const summaryRows = [
    buildSummaryRow(seoulStats.statsByModel.find((s) => s.trimId === "m3-rwd")),
    buildSummaryRow(seoulStats.statsByModel.find((s) => s.trimId === "my-rwd")),
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero / 인트로 */}
      <section className="border-b border-slate-100 bg-[linear-gradient(180deg,#f0f4ff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-700">홈</Link>
            <span>/</span>
            <span className="text-slate-700">테슬라 보조금 계산기</span>
          </nav>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            테슬라 보조금 계산기
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            2026년 테슬라 <strong>Model 3</strong>·<strong>Model Y</strong> 구매 시
            받을 수 있는 <strong>국고보조금</strong>과 <strong>지자체 보조금</strong>을
            지역별로 자동 적용해 <strong>실구매가</strong>와 <strong>월납입금</strong>을 계산합니다.
            청년·다자녀 가산까지 반영해 지역을 바꿔가며 비교할 수 있고,
            전기차 취득세 감면 같은 구매 시 고려 항목도 함께 안내합니다.
          </p>

          {/* 검색 스니펫용 정적 요약표 — 서울 기준 예시값 */}
          {summaryRows.length > 0 ? (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[560px] text-left text-xs md:text-sm">
                <caption className="sr-only">
                  서울 기준 테슬라 Model 3·Model Y 보조금 및 실구매가 예시 ({dataDate})
                </caption>
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                    <th scope="col" className="px-4 py-3 font-semibold">모델</th>
                    <th scope="col" className="px-4 py-3 font-semibold">차량가</th>
                    <th scope="col" className="px-4 py-3 font-semibold">국고보조금</th>
                    <th scope="col" className="px-4 py-3 font-semibold">지자체 보조금</th>
                    <th scope="col" className="px-4 py-3 font-semibold">예상 실구매가</th>
                    <th scope="col" className="px-4 py-3 font-semibold">월납입금(예시)</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row) => (
                    <tr key={row.label} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-3 font-bold text-slate-900">{row.label}</td>
                      <td className="px-4 py-3 text-slate-700">{formatWon(row.price)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatWon(row.nationalWon)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatWon(row.localWon)}</td>
                      <td className="px-4 py-3 font-bold text-blue-700">{formatWon(row.realPrice)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatWon(row.monthly)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 py-3 text-[11px] leading-relaxed text-slate-400">
                예시 기준: 서울 거주, 선수금 1,000만원·금리 3.6%·60개월 할부 (데이터 기준일 {dataDate}).
                실제 보조금·월납입금은 거주 지역과 입력 조건에 따라 달라지므로, 아래 계산기에서 직접 확인하세요.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* 계산기 */}
      <Suspense fallback={<QuoteWizardSkeleton />}>
        <QuoteWizard
          rows={snapshot.rows}
          regions={snapshot.regions}
          dataDate={snapshot.dataDate}
        />
      </Suspense>

      <div className="mx-auto max-w-4xl px-4 pb-16 md:px-8">
        {/* 계산 기준·데이터 출처 */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
          <h2 className="mb-3 text-sm font-bold text-slate-800">계산 기준 및 데이터 출처</h2>
          <dl className="space-y-1.5 text-xs md:text-sm text-slate-600">
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold text-slate-500">보조금 기준일</dt>
              <dd>{dataDate}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold text-slate-500">국고보조금</dt>
              <dd>환경부 무공해차 통합누리집 고시 기준</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold text-slate-500">지자체 보조금</dt>
              <dd>각 지자체 전기차 보급사업 공고 기준 (전국 17개 시·도)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold text-slate-500">차량 출고가</dt>
              <dd>테슬라 공식 홈페이지 기준 (데이터 기준일: {CALC_DATA_DATE})</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            계산 결과는 참고용 예상치이며, 최종 지급액은 예산 잔액·출고/등록일·자격요건에 따라 달라질 수 있습니다.
            신청 전 무공해차 통합누리집과 해당 지자체 공고에서 최신 금액을 확인하세요.
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

        {/* 지역별 테슬라 보조금 계산기 링크 */}
        <section className="mt-8">
          <h2 className="mb-3 text-base font-bold text-slate-900">지역별 테슬라 보조금 계산기</h2>
          <div className="flex flex-wrap gap-2">
            {METRO_REGIONS.filter((r) => r.type === "si").map((r) => (
              <Link
                key={r.slug}
                href={`/subsidy/${r.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700"
              >
                {r.shortName} 테슬라 보조금 계산기
              </Link>
            ))}
          </div>
        </section>

        {/* 관련 페이지 */}
        <section className="mt-8">
          <h2 className="mb-3 text-base font-bold text-slate-900">모델별 가격·비교</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/models/model-3" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">Model 3 가격·보조금</Link>
            <Link href="/models/model-y" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">Model Y 가격·보조금</Link>
            <Link href="/compare/model-3-vs-model-y" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">Model 3 vs Model Y</Link>
            <Link href="/calc/monthly-real-cost" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">월 실제 부담금 계산</Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-black text-slate-950">자주 묻는 질문</h2>
          <div className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer items-start justify-between gap-3 px-4 py-4 text-sm font-semibold text-slate-900 md:text-base">
                  <span className="leading-snug">{q}</span>
                  <span className="mt-0.5 shrink-0 text-lg text-slate-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="border-t border-slate-50 px-4 pb-4 pt-2 text-sm leading-relaxed text-slate-600">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
