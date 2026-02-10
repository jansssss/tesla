import Link from 'next/link';

export const metadata = {
  title: '사이트 소개 - 하우머치 테슬라',
  description: '하우머치 테슬라는 한국에서 테슬라 구매 시 받을 수 있는 보조금과 세금 혜택을 계산하는 정보 제공 사이트입니다.',
};

export default function AboutPage() {
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
            사이트 소개
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* 소개 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                하우머치 테슬라란?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>하우머치 테슬라</strong>는 한국에서 테슬라 전기차 구매를 고려하시는 분들을 위한
                정보 제공 사이트입니다. 테슬라 차량 구매 시 받을 수 있는 <strong>국고 보조금, 지자체 보조금,
                세금 감면 혜택</strong> 등을 종합적으로 계산하여 <strong>실제 구매 가격</strong>을 손쉽게
                확인하실 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                복잡한 보조금 체계와 지역별로 다른 혜택 정보를 일일이 찾아보는 수고를 덜어드리고,
                몇 번의 클릭만으로 정확한 최종 구매가를 계산해드립니다.
              </p>
            </section>

            {/* 주요 기능 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                주요 기능
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>지역별 보조금 조회:</strong> 전국 시/도, 시/군/구별 보조금 정보 제공</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>모델별 계산:</strong> 테슬라 Model 3, Model Y 등 다양한 모델 지원</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>세금 혜택 계산:</strong> 개별소비세, 교육세, 취득세 감면 등 종합 계산</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>실시간 정보 업데이트:</strong> 변경되는 보조금 정책을 반영하여 최신 정보 유지</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✓</span>
                  <span><strong>월 납입금 계산:</strong> 할부 구매 시 월별 예상 납입금 계산</span>
                </li>
              </ul>
            </section>

            {/* 이용 대상 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                이용 대상
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                하우머치 테슬라는 다음과 같은 분들에게 유용합니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>테슬라 전기차 구매를 고려 중이신 분</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>지역별 보조금 차이를 비교하고 싶으신 분</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>정확한 최종 구매 가격을 알고 싶으신 분</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>전기차 보조금 정책에 대해 알아보고 싶으신 분</span>
                </li>
              </ul>
            </section>

            {/* 면책 사항 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                정보의 정확성
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 사이트에서 제공하는 정보는 공개된 자료를 기반으로 작성되었으며,
                최대한 정확한 정보를 제공하기 위해 노력하고 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                단, 보조금 정책은 지자체 예산 상황에 따라 변경될 수 있으며,
                최종 구매 전 반드시 해당 지자체 및 테슬라 공식 채널을 통해 확인하시기 바랍니다.
                자세한 내용은 <Link href="/disclaimer" className="text-red-600 hover:underline">면책조항</Link>을
                참고해주세요.
              </p>
            </section>

            {/* 문의 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                문의하기
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                사이트 이용 중 문의사항이나 개선 제안이 있으시면 언제든지 연락주세요.
              </p>
              <p className="text-gray-700">
                이메일: <a href="mailto:goooods@naver.com" className="text-red-600 hover:underline">goooods@naver.com</a>
              </p>
              <p className="mt-2">
                <Link href="/contact" className="text-red-600 hover:underline font-medium">
                  문의 페이지로 이동 →
                </Link>
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
