export default function RegionFAQ({ metro, dataDate }) {
  const faqs = [
    {
      q: `${metro.name} 표의 금액을 지금 받을 수 있나요?`,
      a: `이 표는 ${dataDate} 자료의 비교값이며 지급 확정액이 아닙니다. 차량의 정확한 인증 차종, 신청자 자격, 출고·등록 일정과 예산 상태를 최신 공고에서 다시 확인해야 합니다. 계산기는 실시간 잔여 예산이나 개인의 선정 여부를 조회하지 않습니다.`,
    },
    {
      q: "계약을 먼저 하면 보조금이 확보되나요?",
      a: "계약과 지원 대상 선정은 별개입니다. 제조·수입사에 신청 접수와 선정 상태를 확인하고, 주소지 공고의 선정 방식과 출고·등록 기한을 함께 확인하세요. 신청 접수 화면만으로 지급이 확정됐다고 판단하지 마세요.",
    },
    {
      q: "청년·다자녀 등 추가 지원을 미리 예산에 넣어도 되나요?",
      a: "추가 지원은 해당 연도 공고의 자격, 증빙, 중복 적용 조건을 확인한 뒤 반영하세요. 기본 보조금만 적용한 경우와 추가 지원이 인정된 경우를 나누어 비교하면, 서류 확인 결과에 따라 자금이 부족해지는 일을 줄일 수 있습니다.",
    },
    {
      q: "표의 보조금 차감 차량가 외에 얼마를 준비해야 하나요?",
      a: "옵션, 취득·등록 관련 비용, 보험료, 금융비용을 별도로 확인해야 합니다. Tesla의 최종 구매 가격표와 보험 견적을 기준으로 자금을 점검하세요. 선수금과 대출원금은 차량대금의 지불 방법이므로 차량대금에 다시 더하지 않습니다.",
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold md:text-xl">계산 결과를 계약에 쓰기 전 확인할 질문</h2>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="space-y-2">
        {faqs.map(({ q, a }) => (
          <details key={q} className="rounded-xl border border-gray-200 bg-white">
            <summary className="cursor-pointer px-5 py-4 text-sm font-semibold">{q}</summary>
            <p className="px-5 pb-5 text-sm leading-7 text-gray-600">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
