'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const PAGE_SIZE = 20

/** 현재 페이지 기준 표시할 페이지 번호 배열(양끝 + 현재 주변 윈도우, 생략은 '…') */
function getPageNumbers(current, total) {
  const delta = 2
  const range = []
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) range.push(i)
  if (range[0] > 1) {
    if (range[0] > 2) range.unshift('…')
    range.unshift(1)
  }
  if (range[range.length - 1] < total) {
    if (range[range.length - 1] < total - 1) range.push('…')
    range.push(total)
  }
  return range
}

export default function AdminPostsPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : ''
    if (!t) { router.push('/admin/login'); return }
    setToken(t)
  }, [router])

  const load = useCallback(async (tk) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/guides', { headers: { Authorization: `Bearer ${tk}` } })
      if (res.status === 401) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      if (res.ok) setGuides(await res.json())
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { if (token) load(token) }, [token, load])

  const handleDelete = async (guide) => {
    if (!window.confirm(`"${guide.title}" 글을 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`)) return
    setDeletingId(guide.id)
    try {
      const res = await fetch(`/api/admin/guides/${guide.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setGuides(prev => prev.filter(g => g.id !== guide.id))
      } else {
        const data = await res.json().catch(() => ({}))
        alert(`삭제 실패: ${data.error || ''}`)
      }
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const filtered = guides.filter(
    g => g.title?.includes(search) || g.slug?.includes(search) || g.category?.includes(search)
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-slate-100" style={{ fontFamily: "'Noto Sans KR', system-ui, sans-serif" }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 text-white md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[13px] text-slate-400 hover:text-white">← 홈</Link>
          <span className="text-[13px] font-bold text-slate-500">/</span>
          <span className="text-[15px] font-bold">글 관리</span>
        </div>
        <button onClick={handleLogout} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800">로그아웃</button>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        {/* 타이틀 + 새 글 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">정보성 가이드</h1>
            <p className="mt-1 text-sm text-slate-500">전체 {guides.length}개 · 작성한 글이 /guides 목록에 노출됩니다</p>
          </div>
          <Link href="/admin/editor" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500">
            ✏️ 새 글 작성
          </Link>
        </div>

        {/* 검색 */}
        <div className="mb-4">
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="제목·슬러그·카테고리 검색"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400"
          />
        </div>

        {/* 목록 */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-400">불러오는 중…</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-sm text-slate-400">
              {search ? '검색 결과가 없습니다' : '아직 작성한 글이 없습니다'}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pageItems.map(guide => (
                <li key={guide.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">{guide.category}</span>
                      <span className="text-[11px] text-slate-400">{(guide.updated_at || guide.published_at || '').slice(0, 10)}</span>
                      {guide.content_html ? (
                        <span className="text-[11px] font-semibold text-emerald-600">● 편집됨</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">○ 원본</span>
                      )}
                    </div>
                    <Link href={`/admin/editor?id=${guide.id}`} className="block truncate text-[15px] font-bold text-slate-900 hover:text-blue-600">
                      {guide.title}
                    </Link>
                    <p className="truncate text-xs text-slate-400">/guides/{guide.slug}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <a href={`/guides/${guide.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">보기</a>
                    <Link href={`/admin/editor?id=${guide.id}`} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100">수정</Link>
                    <button onClick={() => handleDelete(guide)} disabled={deletingId === guide.id} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50">
                      {deletingId === guide.id ? '…' : '삭제'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 페이지네이션 */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← 이전
              </button>
              {getPageNumbers(currentPage, totalPages).map((n, i) =>
                n === '…' ? (
                  <span key={`e${i}`} className="px-2 text-xs text-slate-400">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`min-w-[34px] rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                      n === currentPage
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음 →
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentPage} / {totalPages} 페이지 · 전체 {filtered.length}개
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
