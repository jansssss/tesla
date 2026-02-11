import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm mb-4">
          <Link href="/about" className="hover:text-white transition-colors">
            사이트 소개
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            문의하기
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/privacy" className="hover:text-white transition-colors">
            개인정보처리방침
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            이용약관
          </Link>
          <span className="text-gray-600">|</span>
          <a href="mailto:goooods@naver.com" className="hover:text-white transition-colors">
            goooods@naver.com
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2026 하우머치 테슬라. 본 사이트는 테슬라(Tesla, Inc.)와 공식적인 관계가 없는 독립적인 정보 제공 사이트입니다.</p>
        </div>
      </div>
    </footer>
  );
}
