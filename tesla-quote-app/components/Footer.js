'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const FOOTER_LINKS = [
  { label: '계산기 전체', href: '/calc' },
  { label: '구매 질문 30', href: '/answers' },
  { label: '사이트 소개', href: '/about' },
  { label: '문의하기', href: '/contact' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '이용약관', href: '/terms' },
  { label: '콘텐츠 정책', href: '/editorial-policy' },
  { label: '데이터 출처', href: '/data-sources' },
]

export default function Footer() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminToken'))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
    router.refresh()
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Links
            모바일: 2열 그리드 — 구분자(|)로 이어 붙이면 줄바꿈이 지저분해지고
            터치 타깃이 30px 아래로 떨어진다. 데스크톱: 기존 한 줄 배치 유지. */}
        <nav aria-label="사이트 정보" className="mb-4">
          <div className="grid grid-cols-2 gap-x-4 text-sm md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-6">
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[44px] items-center transition-colors hover:text-white md:min-h-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-1 flex justify-center md:mt-3">
            <a
              href="mailto:goooods@naver.com"
              className="flex min-h-[44px] items-center text-sm transition-colors hover:text-white md:min-h-0"
            >
              goooods@naver.com
            </a>
          </div>
        </nav>

        {/* Copyright */}
        <div className="text-center text-xs leading-relaxed text-gray-500 md:text-sm">
          <p>© 2026 하우머치 테슬라. 본 사이트는 테슬라(Tesla, Inc.)와 공식적인 관계가 없는 독립적인 정보 제공 사이트입니다.</p>
        </div>

        {/* 관리자 버튼 — 로그인 상태에서만 표시 */}
        {isAdmin && (
          <div className="flex justify-end mt-2 pr-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/editor"
                className="text-[10px] font-mono text-blue-500 border border-blue-800 rounded px-2 py-0.5 hover:text-blue-300 hover:border-blue-600 transition-colors"
              >
                EDITOR
              </Link>
              <button
                onClick={handleLogout}
                className="text-[10px] font-mono text-red-500 border border-red-800 rounded px-2 py-0.5 hover:text-red-300 hover:border-red-600 transition-colors"
              >
                LOGOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
