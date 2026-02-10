import Link from 'next/link';

export const metadata = {
  title: '문의하기 - 하우머치 테슬라',
  description: '하우머치 테슬라에 문의사항이나 제안사항을 보내주세요.',
};

export default function ContactPage() {
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
            문의하기
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* 소개 */}
            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                하우머치 테슬라를 이용해주셔서 감사합니다.<br />
                서비스 이용 중 궁금한 점이나 개선 제안사항이 있으시면 언제든지 연락주세요.
              </p>
            </section>

            {/* 연락 방법 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                연락 방법
              </h2>

              {/* 이메일 */}
              <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-lg border border-red-100 max-w-2xl">
                <div className="flex items-start">
                  <div className="bg-red-600 text-white p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">이메일</h3>
                    <a
                      href="mailto:goooods@naver.com"
                      className="text-red-600 hover:text-red-700 font-medium text-lg"
                    >
                      goooods@naver.com
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                      가장 빠른 답변을 받으실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 문의 유형 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                주요 문의 유형
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 mt-1">📋</span>
                    <div>
                      <strong className="text-gray-800">서비스 이용 문의</strong>
                      <p className="text-sm text-gray-600 mt-1">계산 방법, 기능 사용법 등</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 mt-1">💡</span>
                    <div>
                      <strong className="text-gray-800">개선 제안</strong>
                      <p className="text-sm text-gray-600 mt-1">새로운 기능 아이디어, UI/UX 개선 제안 등</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 mt-1">🐛</span>
                    <div>
                      <strong className="text-gray-800">버그 신고</strong>
                      <p className="text-sm text-gray-600 mt-1">오류 발견 시 자세한 상황 설명과 함께 제보</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 mt-1">📊</span>
                    <div>
                      <strong className="text-gray-800">정보 업데이트 요청</strong>
                      <p className="text-sm text-gray-600 mt-1">보조금 정보 변경 사항 알림</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-3 mt-1">🤝</span>
                    <div>
                      <strong className="text-gray-800">협업 문의</strong>
                      <p className="text-sm text-gray-600 mt-1">제휴, 광고 등 비즈니스 관련 문의</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* 문의 시 포함하면 좋은 정보 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                문의 시 포함하면 좋은 정보
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                더 빠르고 정확한 답변을 위해 다음 정보를 함께 보내주시면 도움이 됩니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>사용 중인 브라우저 및 기기 정보 (예: Chrome, Safari, 모바일/PC 등)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>문제가 발생한 페이지 URL</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>문제가 발생한 시점 및 상황</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>스크린샷 (해당되는 경우)</span>
                </li>
              </ul>
            </section>

            {/* 응답 시간 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                응답 시간
              </h2>
              <p className="text-gray-700 leading-relaxed">
                문의하신 내용은 영업일 기준 1-3일 이내에 답변드리도록 노력하고 있습니다.
                다만, 문의량이 많거나 복잡한 문의의 경우 다소 시간이 걸릴 수 있는 점 양해 부탁드립니다.
              </p>
            </section>

            {/* FAQ 안내 */}
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                💬 자주 묻는 질문
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                일반적인 질문은 <Link href="/about" className="text-red-600 hover:underline">사이트 소개</Link> 페이지나
                {' '}<Link href="/disclaimer" className="text-red-600 hover:underline">면책조항</Link> 페이지에서
                답변을 찾으실 수 있습니다.
              </p>
            </section>

            {/* 개인정보 안내 */}
            <section className="mt-8 text-sm text-gray-600 bg-gray-50 p-4 rounded">
              <p className="mb-2">
                <strong>개인정보 처리:</strong> 문의 시 제공하신 이메일 주소는 답변 목적으로만 사용되며,
                답변 완료 후 1년간 보관 후 파기됩니다.
              </p>
              <p>
                자세한 내용은 <Link href="/privacy" className="text-red-600 hover:underline">개인정보처리방침</Link>을 참고해주세요.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
