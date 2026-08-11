import { Suspense } from "react";
import QuoteWizard from "@/components/QuoteWizard";
import QuoteWizardSkeleton from "@/components/QuoteWizardSkeleton";
import HomeCalcLinks from "@/components/HomeCalcLinks";
import { loadSubsidySnapshot } from "@/lib/subsidy";

/**
 * 보조금 확인(대표 계산기) 페이지.
 *
 * 홈(/)은 랜딩으로 역할을 바꾸고, 실제 계산 도구는 이 URL이 대표 페이지가 된다.
 * '보조금 확인' 메뉴(헤더·하단 탭바·전체 메뉴)가 모두 여기로 들어온다.
 * 과거 /calc/tesla-subsidy → / 로 보내던 301도 이 URL로 재지정했다.
 */
export const metadata = {
  title: "테슬라 보조금 계산기 2026 — Model 3·Model Y 실구매가·월납입금",
  description:
    "2026년 테슬라 Model 3·Model Y의 국고보조금·지자체 보조금을 자동 적용해 실구매가와 할부 월납입금을 계산합니다. 전국 17개 시·도 보조금 최신 반영.",
  openGraph: {
    title: "테슬라 보조금 계산기 2026 — Model 3·Model Y 실구매가·월납입금",
    description:
      "2026년 테슬라 Model 3·Model Y의 국고·지자체 보조금을 자동 적용해 실구매가와 할부 월납입금을 계산합니다.",
    url: "https://www.paytesla.kr/subsidy",
    siteName: "하우머치 테슬라",
    locale: "ko_KR",
    type: "website",
  },
  alternates: { canonical: "https://www.paytesla.kr/subsidy" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "테슬라 보조금 계산기",
      url: "https://www.paytesla.kr/subsidy",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "2026년 테슬라 Model 3·Model Y의 국고보조금·지자체 보조금을 자동 적용해 실구매가와 월납입금을 계산하는 무료 계산기.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: "https://www.paytesla.kr" },
        {
          "@type": "ListItem",
          position: 2,
          name: "보조금 확인",
          item: "https://www.paytesla.kr/subsidy",
        },
      ],
    },
  ],
};

export default function SubsidyCalculatorPage() {
  const snapshot = loadSubsidySnapshot();

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-[1400px] px-4 pt-5 md:px-8 md:pt-10">
        <div className="space-y-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#3457dc]">
            보조금 확인
          </p>
          <h1 className="text-2xl font-black tracking-tight text-[#171a20] md:text-4xl lg:text-5xl">
            테슬라 실구매가·보조금·월납입금 계산기
          </h1>
          <p className="mx-auto max-w-2xl text-xs leading-6 text-slate-500 md:text-sm">
            거주 지역과 트림을 고르면 국고·지자체 보조금을 자동으로 적용해 실구매가와 할부 월납입금을
            계산합니다. 기준 데이터 {snapshot.dataDate}.
          </p>
        </div>
      </div>
      <Suspense fallback={<QuoteWizardSkeleton />}>
        <QuoteWizard rows={snapshot.rows} regions={snapshot.regions} dataDate={snapshot.dataDate} />
      </Suspense>
      <div className="border-b border-slate-100" />
      <HomeCalcLinks />
    </main>
  );
}
