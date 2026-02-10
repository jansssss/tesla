import Link from 'next/link';

export const metadata = {
  title: '면책조항 - 하우머치 테슬라',
  description: '하우머치 테슬라의 면책조항 및 주의사항을 확인하세요.',
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-red-600 hover:text-red-700 text-sm font-medium">
            ← 홈으로 돌아가기
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            면책조항
          </h1>

          <div className="text-sm text-gray-500 mb-8">
            <p>최종 수정일: 2024년 2월 10일</p>
          </div>

          {/* 중요 알림 */}
          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
            <h2 className="text-xl font-bold text-red-900 mb-3">
              ⚠️ 중요 안내사항
            </h2>
            <p className="text-red-800 leading-relaxed">
              본 사이트에서 제공하는 모든 정보는 참고용이며, 최종 구매 결정은 반드시
              공식 채널을 통해 확인하신 후 이루어져야 합니다.
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* 1. 일반 면책사항 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. 일반 면책사항
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                하우머치 테슬라(이하 "본 사이트")는 한국에서 테슬라 전기차 구매 시 적용 가능한
                보조금 및 세금 혜택 정보를 제공하는 독립적인 정보 사이트입니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                본 사이트는 테슬라(Tesla, Inc.) 또는 테슬라코리아와 공식적인 관계가 없으며,
                독립적으로 운영되는 정보 제공 플랫폼입니다.
              </p>
            </section>

            {/* 2. 정보의 정확성 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. 정보의 정확성 및 최신성
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                2.1 정보의 출처
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                본 사이트에서 제공하는 보조금 및 가격 정보는 다음 출처를 기반으로 합니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>환경부 및 각 지방자치단체가 공개한 전기차 보조금 정책</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>테슬라 공식 홈페이지의 차량 가격 정보</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>관련 법령에 따른 세금 감면 정보</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                2.2 정보 변경 가능성
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                다음과 같은 이유로 실제 정보와 차이가 있을 수 있습니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">⚠</span>
                  <span><strong>보조금 정책 변경:</strong> 지자체 예산 소진, 정책 변경 등으로 보조금 금액이나 지원 조건이 수시로 변경될 수 있습니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">⚠</span>
                  <span><strong>차량 가격 변동:</strong> 테슬라의 차량 가격은 환율, 정책 등에 따라 변경될 수 있습니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">⚠</span>
                  <span><strong>세법 개정:</strong> 관련 세법의 개정으로 감면 혜택이 변경될 수 있습니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">⚠</span>
                  <span><strong>업데이트 시차:</strong> 실시간으로 모든 변경사항을 반영하지 못할 수 있습니다.</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                2.3 반드시 확인해야 할 사항
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-lg">
                <p className="text-gray-800 leading-relaxed font-semibold mb-3">
                  최종 구매 결정 전 반드시 다음을 확인하시기 바랍니다:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>해당 지자체 담당 부서에 최신 보조금 정보 확인</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>테슬라 공식 홈페이지 또는 전시장에서 정확한 차량 가격 확인</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>본인의 구매 조건이 보조금 지급 요건을 충족하는지 확인</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>지자체의 보조금 예산 잔액 확인</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 3. 책임의 제한 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. 책임의 제한
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                3.1 정보 이용에 따른 책임
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                본 사이트는 다음 사항에 대해 책임을 지지 않습니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>본 사이트에서 제공한 정보를 기반으로 한 구매 결정으로 인한 금전적 손실</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>보조금 신청 누락, 지연, 거부 등으로 인한 불이익</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>실제 지급 금액과 사이트 표시 금액의 차이로 인한 손해</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>차량 구매 계약 과정에서 발생하는 모든 문제</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>지자체 또는 테슬라의 정책 변경으로 인한 불이익</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                3.2 계산 결과
              </h3>
              <p className="text-gray-700 leading-relaxed">
                본 사이트에서 제공하는 계산 결과는 참고용이며, 개인의 구매 조건, 지역,
                시기 등에 따라 실제 금액과 차이가 있을 수 있습니다. 정확한 금액은
                반드시 공식 채널을 통해 확인하시기 바랍니다.
              </p>
            </section>

            {/* 4. 외부 링크 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. 외부 링크 및 제3자 콘텐츠
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트는 이용자의 편의를 위해 외부 웹사이트로의 링크를 제공할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                본 사이트는 외부 링크를 통해 접속한 웹사이트의 내용, 정확성, 안전성 등에
                대해 보증하지 않으며, 해당 웹사이트의 이용으로 인한 손해에 대해 책임을 지지 않습니다.
              </p>
            </section>

            {/* 5. 광고 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. 광고 및 제휴
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트는 운영을 위해 Google AdSense 등의 광고 서비스를 이용할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                광고를 통해 표시되는 제품이나 서비스의 품질, 안전성 등에 대해서는
                본 사이트가 보증하지 않으며, 광고를 통한 거래로 인한 문제에 대해서는
                책임을 지지 않습니다.
              </p>
            </section>

            {/* 6. 테슬라 상표권 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. 상표권 및 저작권
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                "Tesla", "테슬라", "Model 3", "Model Y" 등은 Tesla, Inc.의 등록 상표입니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                본 사이트는 정보 제공 목적으로 해당 상표를 사용하고 있으며,
                Tesla, Inc.와 공식적인 제휴 관계가 없습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                본 사이트에서 제공하는 정보는 공개된 자료를 기반으로 작성되었으며,
                상표권 침해의 의도가 없음을 명시합니다.
              </p>
            </section>

            {/* 7. 서비스 중단 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. 서비스 중단 및 변경
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트는 다음과 같은 경우 사전 고지 없이 서비스를 중단하거나 변경할 수 있습니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>시스템 유지보수, 업그레이드 작업</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>천재지변, 전쟁, 기타 불가항력적 사유</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>서비스 제공의 기술적 문제 발생</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>운영상의 이유</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                서비스 중단으로 인한 어떠한 손해에 대해서도 본 사이트는 책임을 지지 않습니다.
              </p>
            </section>

            {/* 8. 데이터 보안 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                8. 데이터 보안
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트는 이용자의 개인정보를 보호하기 위해 최선을 다하고 있으나,
                인터넷 환경의 특성상 완벽한 보안을 보장할 수 없습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                해킹, 컴퓨터 바이러스 침입 등 불가항력적 사유로 인한 개인정보 유출 및
                이로 인한 손해에 대해서는 책임을 지지 않습니다.
              </p>
            </section>

            {/* 9. 법적 조언 아님 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                9. 법적/재무적 조언 아님
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트에서 제공하는 정보는 일반적인 참고 정보이며,
                개별적인 법적, 재무적, 세무적 조언이 아닙니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                구체적인 상황에 대한 전문적인 조언이 필요한 경우,
                자격을 갖춘 전문가와 상담하시기 바랍니다.
              </p>
            </section>

            {/* 10. 준거법 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                10. 준거법 및 관할
              </h2>
              <p className="text-gray-700 leading-relaxed">
                본 면책조항의 해석 및 적용은 대한민국 법률을 따르며,
                본 사이트 이용과 관련한 분쟁이 발생할 경우 대한민국 법원을 관할 법원으로 합니다.
              </p>
            </section>

            {/* 문의 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                문의사항
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 면책조항과 관련하여 궁금한 점이 있으시면 아래로 연락주세요:
              </p>
              <p className="text-gray-700">
                이메일: <a href="mailto:goooods@naver.com" className="text-red-600 hover:underline">goooods@naver.com</a>
              </p>
              <p className="mt-3">
                <Link href="/contact" className="text-red-600 hover:underline font-medium">
                  문의 페이지로 이동 →
                </Link>
              </p>
            </section>

            {/* 마지막 업데이트 */}
            <section className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600">
                본 면책조항은 2024년 2월 10일에 최종 수정되었으며, 예고 없이 변경될 수 있습니다.
                정기적으로 확인하시기 바랍니다.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
