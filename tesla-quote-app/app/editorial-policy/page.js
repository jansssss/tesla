import Link from 'next/link';

export const metadata = {
  title: '콘텐츠 정책 - 하우머치 테슬라',
  description: '하우머치 테슬라의 정보 출처, 업데이트 방침, 콘텐츠 신뢰도 기준을 안내합니다.',
};

export default function EditorialPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-red-600 hover:text-red-700 text-sm font-medium">
            ← 홈으로 돌아가기
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">콘텐츠 정책</h1>

          <div className="prose prose-lg max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">정보 제공 목적</h2>
              <p className="text-gray-700 leading-relaxed">
                하우머치 테슬라는 한국에서 테슬라 전기차 구매를 고려하는 소비자에게
                보조금·세제 혜택·지역별 실구매가를 정확하게 안내하기 위해 운영합니다.
                복잡한 보조금 구조를 계산기와 가이드로 쉽게 이해할 수 있도록 돕는 것이 목표입니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">정보 출처</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>무공해차 통합누리집</strong> — 환경부 공식 사이트의 보조금 공고문을 기준으로 데이터를 수집합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>지자체 공고문</strong> — 각 시·도·군·구의 전기차 보조금 공고문을 직접 확인하여 반영합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>환경부 고시</strong> — 국비 보조금 단가 및 지원 기준은 환경부 고시를 따릅니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>테슬라 공식 차량 가격</strong> — 차량 기본 가격은 테슬라 공식 사이트의 공개 가격을 사용합니다.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">업데이트 방침</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                전기차 보조금 정책은 연도별·지역별로 수시 변경될 수 있습니다. 다음 기준으로 정보를 최신화합니다.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>연간 보조금 공고</strong> — 매년 초 환경부 및 지자체 공고 확인 후 즉시 반영</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>예산 소진·추경</strong> — 중간 변경 공고 발표 시 확인 후 가능한 빨리 업데이트</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>차량 가격 변동</strong> — 테슬라 공식 가격 변경 시 반영</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>오류 신고</strong> — 사용자 신고 오류는 영업일 기준 3일 이내 검토</span>
                </li>
              </ul>
              <p className="text-gray-600 text-sm mt-4">
                각 계산기 페이지 하단에 데이터 기준일이 표시되어 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">콘텐츠 작성 기준</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>공식 자료 우선</strong> — 추정치나 비공식 정보는 사용하지 않습니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>예측·전망 배제</strong> — 공식 공고 전 예상 보조금이나 가격 전망은 제공하지 않으며, 공식 발표 후 이전 기준과의 변경점만 분석합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>지역별 차이 명시</strong> — 지자체 보조금은 지역마다 다르므로 반드시 지역을 선택하여 확인하도록 안내합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>광고와 정보 분리</strong> — 광고 게재 여부가 계산 결과나 가이드 내용에 영향을 주지 않습니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>자동화 사용 공개</strong> — 검색 질문 분석과 초안 구조화에 AI·자동화 도구를 사용합니다. 공식 1차 출처, 본문 구조, 과장 표현, 내부링크를 코드로 검사하며 기준을 통과하지 못한 글은 공개 파일에 반영하지 않습니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>가상 경험 금지</strong> — 확인할 수 없는 1인칭 사용 후기나 소유 경험을 만들지 않습니다. 경험이 아닌 자료 분석 글은 조건과 출처를 중심으로 작성합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>독립 운영</strong> — 이 사이트는 테슬라(Tesla, Inc.)와 공식적인 관계가 없는 독립 정보 제공 사이트입니다.</span>
                </li>
              </ul>
            </section>

            <section className="bg-red-50 border border-red-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-red-900 mb-4">면책 사항</h2>
              <p className="text-red-800 leading-relaxed">
                본 사이트에서 제공하는 모든 계산 결과와 보조금 정보는 <strong>참고용</strong>입니다.
                실제 보조금 수령 금액은 지자체 예산 상황, 접수 시점, 신청 자격에 따라 달라질 수 있습니다.
                최종 구매 결정 전 반드시 <strong>무공해차 통합누리집</strong>과 해당 지자체 공고문을 확인하세요.
              </p>
              <p className="mt-3">
                <Link href="/disclaimer" className="text-red-700 font-medium hover:underline">
                  자세한 면책조항 보기 →
                </Link>
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">오류 신고 및 문의</h2>
              <p className="text-gray-700 leading-relaxed">
                보조금 데이터 오류, 계산 오류, 콘텐츠 개선 제안은 아래로 문의하세요.
              </p>
              <p className="mt-3 text-gray-700">
                이메일:{' '}
                <a href="mailto:goooods@naver.com" className="text-red-600 hover:underline">
                  goooods@naver.com
                </a>
              </p>
            </section>

          </div>
        </article>
      </div>
    </main>
  );
}
