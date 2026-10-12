import Link from "next/link";

export default function RegionDecisionGuide({ metro, dataDate }) {
  const isSeoul = metro.slug === "seoul";
  return (
    <section id="decision-guide" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
      <p className="text-xs font-semibold text-blue-700">신청 판단 안내 · 확인일 2026-10-12</p>
      <h2 className="mt-2 text-xl font-black text-slate-900">
        {isSeoul ? "서울: 계약 순서보다 출고·등록 가능 시점을 먼저 확인하세요" : "금액 비교 다음에는 신청 가능 여부를 확인하세요"}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-700">
        아래 표는 {dataDate} 보조금 자료입니다. 오늘의 지급액이나 예산 잔액은 아닙니다.
        지금 계약할지 결정하려면 금액, 신청 자격, 출고 일정 세 가지가 모두 확인되어야 합니다.
      </p>
      {isSeoul ? (
        <>
          <div className="mt-5 rounded-xl bg-blue-50 p-5 text-sm leading-7 text-slate-700">
            <h3 className="font-bold text-slate-900">하반기 공고에서 확인한 것과 아직 모르는 것</h3>
            <p className="mt-2">
              서울시 9월 14일 추가 공고의 전기승용 신청기간은 2026년 9월 17일 10시부터
              11월 30일 18시까지입니다. 예산이 소진되면 일찍 마감하며, 신청 접수 순서가 아닌
              출고·등록 순으로 지급합니다. 지원가능여부확인 요청 기한은 12월 2일,
              지급신청 기한은 12월 9일로 서로 다릅니다.
            </p>
            <p className="mt-2">
              추가 배정 발표만으로 지금 예산이 남아 있다고 볼 수 없습니다. 이 페이지에서는
              현재 잔여 물량, 개인별 선정 상태, 7월 이후 트림별 지급액 변경 여부를 확인하지 못했습니다.
            </p>
            <a className="mt-2 inline-block font-semibold text-blue-700 underline" href="https://news.seoul.go.kr/env/archives/570727" target="_blank" rel="noopener noreferrer">
              서울시 하반기 추가 공고 원문
            </a>
          </div>
          <h3 className="mt-6 font-bold text-slate-900">같은 차를 주문해도 판단이 달라지는 두 경우</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold">출고 일정과 신청 상태를 확인한 구매자</h4>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                예를 들어 인도 일정이 잡혔다면 담당자에게 지원 선정 여부와 등록 일정이 공고 기한에
                맞는지 확인합니다. 확인된 보조금을 최종 구매 가격표와 대조한 다음 보험·등록 비용과
                결제일에 필요한 현금을 준비합니다. 인도 일정 확정만으로 보조금 확정은 아닙니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold">주문만 했고 인도일은 미정인 구매자</h4>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                신청기간이 남았다는 이유만으로 보조금을 차감해 예산을 확정하지 않습니다.
                기본 보조금을 받는 경우와 못 받는 경우를 각각 계산하고, 출고가 늦어질 때의
                자금 차이를 감당할 수 있는지 먼저 봅니다. 이 예시는 판단 방법이며 지급 예측이 아닙니다.
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {metro.name}의 최신 접수 마감·거주 요건·잔여 예산을 이 페이지에서 검증한 것은 아닙니다.
          지역 이름만으로 지원 조건을 추정하지 말고 아래 공식 지급현황에서 해당 지자체 공고를 열어 확인하세요.
          {metro.type === "do" && " 도 전체 최대값은 내 주소지의 지급액이 아닙니다. 실제 시·군을 선택해 비교하세요."}
        </p>
      )}
      <h3 className="mt-6 font-bold text-slate-900">계약 전 메모해 둘 네 가지</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
        <li>공고명·공고일과 신청자 구분: 개인·사업자·법인의 주소지 및 거주 요건이 무엇인지 확인합니다.</li>
        <li>차량의 인증 차종명: 판매 이름이 비슷해도 내 트림이 지급대상 목록과 일치하는지 확인합니다.</li>
        <li>신청 접수·선정·출고·등록 상태: 담당자에게 각 단계를 나누어 묻고 확인한 날짜를 남깁니다.</li>
        <li>최종 구매 가격표와 별도 비용: 보험·등록·금융비용, 추가 지원 미인정 시 부족한 자금을 확인합니다.</li>
      </ul>
      <h3 className="mt-6 font-bold text-slate-900">확인할 공식 화면</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-700">
        <li><a href="https://ev.or.kr/nportal/buySupprt/initSubsidyPaymentCheckAction.do" target="_blank" rel="noopener noreferrer" className="underline">무공해차 통합누리집: 지자체 공고·지급현황 확인</a></li>
        <li><a href="https://ev.or.kr/nportal/buySupprt/initSubsidyTargetVehicleAction.do" target="_blank" rel="noopener noreferrer" className="underline">무공해차 통합누리집: 지급대상 차종 확인</a></li>
        <li><a href="https://www.tesla.com/ko_KR/support/faq" target="_blank" rel="noopener noreferrer" className="underline">Tesla 공식 FAQ: 최종 결제·보험·등록 안내</a></li>
      </ul>
      <p className="mt-3 text-xs leading-6 text-slate-500">확인일은 안내 자료를 읽은 날짜이며 보조금·차량 가격의 갱신일이 아닙니다. 지급현황은 공식 화면에서 직접 확인해야 합니다.</p>
      <nav aria-label="보조금 판단 후 읽을 가이드" className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5 text-sm font-semibold text-blue-700">
        <Link href="/guides/seoul-vs-naju-ev-subsidy-2026" className="underline">지역 금액 비교를 해석하는 법</Link>
        <Link href="/guides/ev-tax-benefits-running-cost-guide" className="underline">차값 외 세금·유지비 점검</Link>
        <Link href="/guides" className="underline">전체 구매 가이드</Link>
      </nav>
    </section>
  );
}
