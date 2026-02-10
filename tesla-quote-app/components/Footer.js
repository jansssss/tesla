import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">하우머치 테슬라</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              한국에서 테슬라 구매 시 받을 수 있는 2026년 국고 및 지자체 보조금, 세금 혜택 등을
              한눈에 확인하고 실구매가를 계산할 수 있는 정보 제공 사이트입니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  가격 계산기
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  사이트 소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">약관 및 정책</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  면책조항
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">✉</span>
                <a href="mailto:goooods@naver.com" className="hover:text-white transition-colors">
                  goooods@naver.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2026 하우머치 테슬라. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              본 사이트는 테슬라(Tesla, Inc.)와 공식적인 관계가 없는 독립적인 정보 제공 사이트입니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
