import Link from 'next/link';

export const metadata = {
  title: '사이트 소개 | 하우머치 테슬라',
  description: '하우머치 테슬라는 환경부·지자체 보조금 공고를 분석해 테슬라 실구매가를 지역별로 계산해주는 정보 사이트입니다.',
  alternates: { canonical: 'https://www.paytesla.kr/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 뒤로가기 */}
        <div className="mb-8">
          <Link href="/" className="text-red-600 hover:text-red-700 text-sm font-medium">
            ← 홈으로 돌아가기
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-md p-8 md:p-12 space-y-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            사이트 소개
          </h1>

          {/* 사이트 소개 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">하우머치 테슬라는 어떤 사이트인가요</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              테슬라를 구매할 때 가장 어려운 부분은 <strong>"내가 실제로 얼마를 내야 하는가"</strong>를 파악하는 것입니다.
              국고보조금과 지방보조금이 따로 있고, 지방보조금은 시·군·구마다 다 다릅니다.
              여기에 청년·다자녀 가산 혜택까지 붙으면 계산이 복잡해집니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              하우머치 테슬라는 환경부와 각 지자체가 공개한 보조금 공고문을 분석해
              모델별·지역별 실구매가를 계산해주는 사이트입니다.
              공식 공고 전 예상 보조금이나 가격 전망은 제공하지 않으며,
              공식 발표가 나온 뒤 이전 기준과 달라진 변경점만 분석합니다.
            </p>
          </section>

          {/* 운영자 소개 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">운영자 소개</h2>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-900 text-lg font-black text-white">
                js
              </div>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <p>
                  안녕하세요, 이 사이트를 운영하는 <strong>jans</strong>입니다.
                  저는 자동차나 IT 업계와는 무관한 <strong>평범한 직장인</strong>입니다.
                  최근 전기차를 직접 구매하면서, 국고보조금·지자체보조금·청년/다자녀 가산까지 얽힌
                  실구매가 계산이 너무 복잡하다는 걸 직접 겪었습니다.
                </p>
                <p>
                  "이걸 누구나 클릭 몇 번으로 확인할 수 있으면 좋겠다"는 생각에서 이 사이트를 시작했습니다.
                  최근의 AI·자동화 도구를 활용해 흩어진 보조금 공고 데이터를 모으고,
                  지역별 실구매가를 바로 계산해주는 도구를 만들어 직접 검수하며 정리하고 있습니다.
                </p>
                <p>
                  전문가의 분석이라기보다, <strong>같은 고민을 먼저 해본 한 명의 실구매자</strong>로서
                  제가 부딪힌 정보들을 정리한다는 마음으로 운영합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 데이터 신뢰성 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">데이터 수집 방법</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                {
                  title: "환경부 전기차 보조금 공고",
                  desc: "매년 발표되는 환경부 무공해차 보급사업 보조금 공고문을 직접 분석합니다.",
                },
                {
                  title: "지자체 보조금 공고",
                  desc: "17개 광역시도 + 주요 기초자치단체의 개별 보조금 공고를 수집·정리합니다.",
                },
                {
                  title: "커뮤니티 실구매 사례 교차검증",
                  desc: "테슬라 커뮤니티에 올라오는 실제 구매 사례와 데이터를 대조해 오류를 보정합니다.",
                },
                {
                  title: "테슬라 코리아 공식 출고가",
                  desc: "모델별 출고가는 테슬라 코리아 공식 가격 기준으로 반영합니다.",
                },
              ].map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5 font-bold flex-shrink-0">•</span>
                  <span><strong>{title}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 운영 원칙 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">운영 원칙</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                { title: "공고 기반", desc: "계산 데이터는 공개된 공고문을 근거로 하며, 출처를 확인할 수 있습니다." },
                { title: "정기 업데이트", desc: "보조금 공고가 나오면 데이터를 갱신하고, 업데이트 시점을 표기합니다." },
                { title: "오류 수정", desc: "잘못된 수치나 누락이 있으면 제보를 받아 즉시 수정합니다." },
              ].map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5 font-bold flex-shrink-0">▸</span>
                  <span><strong>{title}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 면책 */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">정보 정확성 및 면책 사항</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              본 사이트에서 제공하는 보조금 정보는 공개된 공고문을 바탕으로 작성되었으며,
              최대한 정확한 정보를 제공하기 위해 노력합니다.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              단, 보조금 정책은 지자체 예산 소진 및 정책 변경으로 달라질 수 있습니다.
              최종 구매 결정 전 반드시 해당 지자체와 테슬라 코리아 공식 채널을 통해 확인하세요.
            </p>
            <p className="text-sm text-gray-500">
              자세한 내용은{' '}
              <Link href="/disclaimer" className="text-red-600 hover:underline">면책조항</Link>을 참고해주세요.
            </p>
          </section>

          {/* 문의 */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">문의하기</h2>
            <p className="text-sm text-gray-600 mb-3">
              보조금 데이터 오류, 계산기 버그, 개선 제안은 언제든 환영합니다.
            </p>
            <p className="text-sm text-gray-700">
              이메일:{' '}
              <a href="mailto:goooods@naver.com" className="text-red-600 hover:underline">goooods@naver.com</a>
            </p>
            <p className="mt-2">
              <Link href="/contact" className="text-red-600 hover:underline text-sm font-medium">
                문의 페이지로 이동 →
              </Link>
            </p>
          </section>

        </article>
      </div>
    </main>
  );
}
