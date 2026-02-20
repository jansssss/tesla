export default function RegionFAQ({ metro, stats }) {
  const m3rwd = stats.statsByModel.find((s) => s.trimId === "m3-rwd");
  const myRwd = stats.statsByModel.find((s) => s.trimId === "my-rwd");

  const m3EstimatedMax = m3rwd?.max ? Math.round((41990000 - m3rwd.max * 10000) / 10000) : 0;
  const myEstimatedMax = myRwd?.max ? Math.round((49990000 - myRwd.max * 10000) / 10000) : 0;

  const faqs = [
    {
      q: `2026년 ${metro.name} 테슬라 Model 3 RWD 보조금은 얼마인가요?`,
      a: `2026년 ${metro.name} 테슬라 Model 3 RWD의 보조금은 최대 ${m3rwd?.max ?? 0}만원입니다 (국고보조금 + ${metro.shortName} 지방보조금 합산). 출고가 4,199만원에서 보조금을 차감하면 실구매가는 약 ${m3EstimatedMax}만원 수준입니다.${metro.type === "do" ? ` ${metro.name} 내 시/군/구별로 ${m3rwd?.min ?? 0}만원~${m3rwd?.max ?? 0}만원으로 차이가 있습니다.` : ""}`,
    },
    {
      q: `${metro.name} 테슬라 Model Y RWD 실구매가는 얼마인가요?`,
      a: `2026년 ${metro.name} Model Y Premium RWD의 보조금은 최대 ${myRwd?.max ?? 0}만원이며, 출고가 4,999만원 기준 실구매가는 약 ${myEstimatedMax}만원입니다. 위 계산기에서 할부 조건을 입력하면 월 납입금도 바로 확인할 수 있습니다.`,
    },
    {
      q: `${metro.name} 테슬라 보조금 신청 방법은?`,
      a: `테슬라 차량 계약 후 테슬라 코리아가 보조금 신청을 대행합니다. ${metro.name} 주민등록 주소지 기준으로 지방보조금이 적용되며, 차량 인도 전 보조금 신청이 완료되어야 합니다. 보조금 예산이 소진되면 지급이 제한될 수 있으므로 상반기 내 진행을 권장합니다.`,
    },
    {
      q: `국고보조금과 ${metro.shortName} 지방보조금의 차이는?`,
      a: `국고보조금은 환경부에서 전국 동일하게 지급하는 보조금이고, 지방보조금은 ${metro.name} 지자체 예산으로 추가 지원하는 금액입니다. 두 금액을 합산한 것이 실제 혜택 금액입니다.${metro.type === "do" ? ` ${metro.name}은 시/군/구별로 지방보조금이 다르게 책정됩니다.` : ""}`,
    },
    {
      q: `청년·다자녀·전기차 전환 혜택도 받을 수 있나요?`,
      a: `네, 국고보조금의 20%를 추가 지원하는 청년 혜택(만 18~34세), 다자녀 가구 혜택(2자녀 100만원, 3자녀 200만원, 4자녀 이상 300만원), 전기차 전환 혜택(100만원) 등이 별도로 있습니다. 위 계산기에서 해당 항목을 체크하면 자동 반영되어 최종 실구매가를 확인할 수 있습니다.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold mb-4">자주 묻는 질문</h2>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-2">
        {faqs.map(({ q, a }, i) => (
          <details
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
          >
            <summary className="px-4 md:px-5 py-4 font-semibold text-sm md:text-base cursor-pointer hover:bg-gray-50 transition-colors list-none flex justify-between items-start gap-3">
              <span className="leading-snug">{q}</span>
              <span className="text-gray-400 text-lg mt-0.5 flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="px-4 md:px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
              {a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
