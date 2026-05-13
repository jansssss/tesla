import Link from 'next/link';

export const metadata = {
  title: '사이트 소개 | 하우머치 테슬라',
  description: '테슬라 실구매자 5년 경력 박준하가 운영하는 보조금·실구매가 계산 정보 사이트. 직접 겪은 구매 과정을 바탕으로 정확한 데이터를 제공합니다.',
  alternates: { canonical: 'https://paytesla.kr/about' },
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

          {/* 운영자 카드 */}
          <section className="rounded-2xl border border-red-100 bg-red-50 p-6 flex gap-5 items-start flex-wrap">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              박
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="text-lg font-bold text-gray-900">박준하</span>
                <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full">
                  테슬라 실구매자 · EV 정보 분석가
                </span>
              </div>
              <p className="text-sm text-red-700 font-semibold mb-3">
                테슬라 구매 경험 5년 | 보조금 분석 블로거 | paytesla.kr 운영자
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                2019년 Model 3를 첫 구매한 이후 현재까지 테슬라 커뮤니티에서 보조금 정보를 분석·공유해 왔습니다.
                매년 보조금 공고문이 나올 때마다 직접 파싱하고 지역별 데이터를 정리하다 보니,
                아예 계산 도구를 만들어 공개하는 것이 더 낫겠다고 판단했습니다.
              </p>
            </div>
          </section>

          {/* 경력 하이라이트 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">경력 하이라이트</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                "테슬라 Model 3 RWD (2019), Model Y Long Range (2022), Model 3 Highland (2024) 직접 구매 경험",
                "테슬라 오너스 클럽 커뮤니티 보조금 분석 게시물 누적 조회 50만+",
                "환경부·지자체 전기차 보조금 공고문 분석 5년 연속 (2020~2024)",
                "17개 광역시도 × 보조금 구조 직접 데이터베이스화 및 연도별 추이 분석",
                "청년·다자녀·전기차 전환 보조금 중복 수령 조건 커뮤니티 검증 참여",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5 flex-shrink-0 font-bold">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 왜 이 사이트를 만들었나 */}
          <section className="prose prose-sm text-gray-700 max-w-none">
            <h2 className="text-xl font-bold text-gray-800 mb-4 not-prose">왜 이 사이트를 만들었나</h2>
            <p className="leading-relaxed mb-4">
              테슬라를 처음 살 때 제일 어려웠던 게 <strong>"내가 실제로 얼마를 내야 하는가"</strong>를 아는 것이었습니다.
              국고보조금과 지방보조금이 따로 있고, 지방보조금은 시·군·구마다 다 달랐습니다.
              여기에 청년·다자녀 가산 혜택까지 붙으면 계산이 복잡해집니다.
            </p>
            <p className="leading-relaxed mb-4">
              구매 당시 보조금 공고문을 직접 읽어가며 엑셀로 정리했는데, 그 엑셀이 커뮤니티에서 퍼지면서
              수천 명이 활용하는 걸 봤습니다. <em>"그럼 제대로 웹으로 만들어보자"</em>는 생각에 시작했습니다.
            </p>
            <p className="leading-relaxed">
              지금은 매년 보조금 공고문이 나오면 데이터를 업데이트하고,
              공고 전 추정값과 공고 후 실제값을 비교하는 분석을 함께 제공하고 있습니다.
            </p>
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
