import Link from 'next/link';

export const metadata = {
  title: '개인정보처리방침 - 하우머치 테슬라',
  description: '하우머치 테슬라의 개인정보 처리방침을 확인하세요.',
};

export default function PrivacyPage() {
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
            개인정보처리방침
          </h1>

          <div className="text-sm text-gray-500 mb-8">
            <p>최종 수정일: 2026년 2월 10일</p>
            <p>시행일: 2026년 2월 10일</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* 1. 총칙 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. 총칙
              </h2>
              <p className="text-gray-700 leading-relaxed">
                하우머치 테슬라(이하 "본 사이트")는 이용자의 개인정보를 중요시하며,
                「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등
                관련 법령을 준수하고 있습니다. 본 개인정보처리방침은 이용자가 제공한 개인정보가
                어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가
                취해지고 있는지 알려드립니다.
              </p>
            </section>

            {/* 2. 수집하는 개인정보 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. 수집하는 개인정보의 항목
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                본 사이트는 기본적으로 회원가입이나 로그인 없이 서비스를 이용할 수 있으며,
                최소한의 정보만을 수집합니다.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                2.1 자동으로 수집되는 정보
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>접속 IP 주소</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>쿠키(Cookie)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>서비스 이용 기록</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>방문 일시</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>브라우저 종류 및 OS</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                2.2 문의 시 수집되는 정보
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>이메일 주소 (문의 답변 전송 목적)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>문의 내용</span>
                </li>
              </ul>
            </section>

            {/* 3. 개인정보의 수집 및 이용 목적 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. 개인정보의 수집 및 이용 목적
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트는 수집한 개인정보를 다음의 목적을 위해 활용합니다:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">•</span>
                  <span><strong>서비스 제공:</strong> 보조금 계산 서비스 제공 및 사이트 운영</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">•</span>
                  <span><strong>서비스 개선:</strong> 이용자 통계 분석 및 서비스 품질 향상</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">•</span>
                  <span><strong>문의 응대:</strong> 이용자 문의사항 처리 및 답변</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">•</span>
                  <span><strong>보안:</strong> 부정 이용 방지 및 서비스 안정성 확보</span>
                </li>
              </ul>
            </section>

            {/* 4. 개인정보의 보유 및 이용 기간 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. 개인정보의 보유 및 이용 기간
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                본 사이트는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는
                해당 정보를 지체 없이 파기합니다.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>접속 로그:</strong> 3개월 보관 후 파기</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>문의 내역:</strong> 문의 답변 완료 후 1년 보관 후 파기</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>법령에 따른 보존:</strong> 관련 법령에서 정한 기간 동안 보관</span>
                </li>
              </ul>
            </section>

            {/* 5. 개인정보의 제3자 제공 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                5. 개인정보의 제3자 제공
              </h2>
              <p className="text-gray-700 leading-relaxed">
                본 사이트는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                다만, 아래의 경우에는 예외로 합니다:
              </p>
              <ul className="space-y-2 text-gray-700 mt-3">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>이용자가 사전에 동의한 경우</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</span>
                </li>
              </ul>
            </section>

            {/* 6. 개인정보 처리 위탁 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. 개인정보 처리 위탁
              </h2>
              <p className="text-gray-700 leading-relaxed">
                본 사이트는 현재 개인정보 처리 업무를 외부에 위탁하지 않습니다.
                향후 위탁이 필요한 경우 사전에 고지하고 동의를 구하겠습니다.
              </p>
            </section>

            {/* 7. 쿠키(Cookie)의 운영 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                7. 쿠키(Cookie)의 운영
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트는 이용자에게 보다 나은 서비스를 제공하기 위해 쿠키를 사용합니다.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
                쿠키란?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                쿠키는 웹사이트가 이용자의 브라우저에 보내는 작은 텍스트 파일로,
                이용자의 컴퓨터에 저장됩니다.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
                쿠키 사용 목적
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>이용자 설정 정보 저장 (지역, 모델 선택 등)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>방문 및 이용 형태 파악을 통한 서비스 개선</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>광고 효과 측정 (Google AdSense 등)</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">
                쿠키 설정 거부 방법
              </h3>
              <p className="text-gray-700 leading-relaxed">
                이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹브라우저에서
                옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다
                확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다. 다만,
                쿠키 설치를 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.
              </p>
            </section>

            {/* 8. 개인정보 보호책임자 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                8. 개인정보 보호책임자
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                본 사이트는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
                개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
                아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">개인정보 보호책임자</p>
                <p className="text-gray-700">이메일: goooods@naver.com</p>
              </div>
            </section>

            {/* 9. 개인정보의 안전성 확보 조치 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                9. 개인정보의 안전성 확보 조치
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>개인정보 취급 직원의 최소화 및 교육</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>개인정보에 대한 접근 제한</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>해킹 등에 대비한 기술적 대책</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>HTTPS 보안 프로토콜 사용</span>
                </li>
              </ul>
            </section>

            {/* 10. 이용자의 권리 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                10. 이용자의 권리
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                이용자는 다음과 같은 권리를 행사할 수 있습니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>개인정보 열람 요구</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>오류 등이 있을 경우 정정 요구</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>삭제 요구</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>처리정지 요구</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                권리 행사는 개인정보 보호책임자에게 이메일로 연락하시면 됩니다.
              </p>
            </section>

            {/* 11. 개인정보 처리방침 변경 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                11. 개인정보 처리방침 변경
              </h2>
              <p className="text-gray-700 leading-relaxed">
                본 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라
                내용의 추가, 삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터
                사이트의 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>

            {/* 부칙 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                부칙
              </h2>
              <p className="text-gray-700">
                본 방침은 2026년 2월 10일부터 시행됩니다.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
