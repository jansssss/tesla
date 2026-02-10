import Link from 'next/link';

export const metadata = {
  title: '이용약관 - 하우머치 테슬라',
  description: '하우머치 테슬라의 서비스 이용약관을 확인하세요.',
};

export default function TermsPage() {
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
            이용약관
          </h1>

          <div className="text-sm text-gray-500 mb-8">
            <p>최종 수정일: 2024년 2월 10일</p>
            <p>시행일: 2024년 2월 10일</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* 제1조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제1조 (목적)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관은 하우머치 테슬라(이하 "사이트")가 제공하는 테슬라 전기차 보조금 계산 및
                관련 정보 서비스(이하 "서비스")의 이용과 관련하여 사이트와 이용자 간의 권리, 의무 및
                책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            {/* 제2조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제2조 (용어의 정의)
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2 min-w-[80px]">① "사이트"</span>
                  <span>하우머치 테슬라가 운영하는 웹사이트를 의미합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 min-w-[80px]">② "이용자"</span>
                  <span>본 약관에 따라 사이트가 제공하는 서비스를 이용하는 자를 의미합니다.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 min-w-[80px]">③ "서비스"</span>
                  <span>사이트가 제공하는 테슬라 보조금 계산, 정보 제공 등 모든 서비스를 의미합니다.</span>
                </li>
              </ul>
            </section>

            {/* 제3조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제3조 (약관의 게시 및 변경)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 사이트는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 화면에 게시합니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                ② 사이트는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ③ 약관이 변경되는 경우 사이트는 변경사항을 시행일자 7일 전부터 공지합니다.
                다만, 이용자에게 불리한 약관의 변경인 경우에는 30일 전에 공지합니다.
              </p>
            </section>

            {/* 제4조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제4조 (서비스의 제공)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 사이트는 다음과 같은 서비스를 제공합니다:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>테슬라 전기차 보조금 계산 서비스</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>지역별 보조금 정보 제공</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>실구매가 및 월 납입금 계산 서비스</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>전기차 관련 정보 제공</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                ② 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검 등
                필요한 경우 서비스 제공이 일시 중단될 수 있습니다.
              </p>
            </section>

            {/* 제5조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제5조 (서비스 이용)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 서비스 이용은 사이트의 승낙에 의해 가능합니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                ② 이용자는 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ③ 서비스는 무료로 제공되며, 별도의 회원가입 절차가 필요하지 않습니다.
              </p>
            </section>

            {/* 제6조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제6조 (이용자의 의무)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                이용자는 다음 행위를 하여서는 안 됩니다:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>허위 내용의 등록</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>타인의 정보 도용</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>사이트의 정보 및 서비스를 이용한 영리 행위</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>사이트의 운영을 방해하는 행위</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>사이트의 저작권 및 지적재산권을 침해하는 행위</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>해킹, 바이러스 유포 등 사이트의 안정성을 해치는 행위</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>기타 관련 법령에 위배되는 행위</span>
                </li>
              </ul>
            </section>

            {/* 제7조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제7조 (사이트의 의무)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 사이트는 관련 법령과 본 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며,
                계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다합니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                ② 사이트는 이용자가 안전하게 서비스를 이용할 수 있도록 개인정보 보호를 위해
                보안시스템을 구축하며 개인정보처리방침을 공시하고 준수합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ③ 사이트는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나 불만이 정당하다고
                인정할 경우 이를 처리하여야 합니다.
              </p>
            </section>

            {/* 제8조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제8조 (정보의 정확성)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 사이트는 제공하는 보조금 정보의 정확성을 위해 노력하나, 정보의 정확성을 보장하지는 않습니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                ② 보조금 정책은 정부 및 지자체의 예산 상황에 따라 수시로 변경될 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ③ 최종 구매 결정 전 반드시 해당 지자체 및 테슬라 공식 채널을 통해 최신 정보를 확인하시기 바랍니다.
              </p>
            </section>

            {/* 제9조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제9조 (저작권 및 지적재산권)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 사이트가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 사이트에 귀속됩니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                ② 이용자는 사이트를 이용함으로써 얻은 정보 중 사이트에 지적재산권이 귀속된 정보를
                사이트의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로
                이용하거나 제3자에게 이용하게 하여서는 안됩니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ③ 사이트는 테슬라(Tesla, Inc.)의 공식 사이트가 아니며, 테슬라의 상표권을 침해하지 않습니다.
              </p>
            </section>

            {/* 제10조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제10조 (면책조항)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 사이트는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인해
                서비스를 제공할 수 없는 경우 책임이 면제됩니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                ② 사이트는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                ③ 사이트는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에
                대하여 책임을 지지 않습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ④ 사이트는 이용자가 제공한 정보의 정확성, 신뢰성에 대해 보증하지 않으며,
                그로 인해 발생한 손해에 대해 책임을 지지 않습니다.
              </p>
            </section>

            {/* 제11조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제11조 (광고 게재)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 사이트는 서비스 운영을 위해 광고를 게재할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ② 이용자가 광고를 통해 제3자가 제공하는 상품 또는 서비스를 이용하는 경우,
                이용자와 제3자 간에 발생하는 문제에 대해 사이트는 책임을 지지 않습니다.
              </p>
            </section>

            {/* 제12조 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                제12조 (분쟁 해결)
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                ① 사이트와 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여
                필요한 모든 노력을 하여야 합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                ② 본 약관에 명시되지 않은 사항은 관련 법령에 따르며, 분쟁 발생 시 대한민국 법을
                준거법으로 합니다.
              </p>
            </section>

            {/* 부칙 */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                부칙
              </h2>
              <p className="text-gray-700">
                본 약관은 2024년 2월 10일부터 시행됩니다.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
