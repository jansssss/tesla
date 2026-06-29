'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['테슬라', '전기차', '보조금', '충전', '비교', '구매가이드', '자동차']

/** HTML 본문에서 순수 텍스트만 추출 */
function htmlToText(html) {
  return String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 본문 첫 단락(없으면 앞부분)에서 요약 자동 생성 — 최대 150자 */
function deriveSummary(html) {
  const pMatch = String(html || '').match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const text = htmlToText(pMatch ? pMatch[1] : html)
  if (!text) return ''
  return text.length > 150 ? text.slice(0, 150).trim() + '…' : text
}

/** 본문 길이로 읽기 시간 자동 계산 (한국어 약 500자/분, 최소 1분) */
function estimateReadTime(html) {
  const len = htmlToText(html).length
  return `${Math.max(1, Math.round(len / 500))}분`
}

/** 제목에서 SEO 슬러그 자동 생성 — 한글 키워드 보존, 최대 60자 */
function slugifyKo(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

// 매 요청 직전 Supabase가 자동 갱신해주는 최신 access_token을 가져온다
// (로그인 시점에 저장한 토큰은 1시간 뒤 만료되어 장시간 작성 중 업로드/저장이 401로 실패할 수 있음)
async function getFreshToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

function sectionsToHtml(guide) {
  let html = ''
  for (const [i, sec] of (guide.sections || []).entries()) {
    html += `<h2>${String(i + 1).padStart(2, '0')}. ${sec.title}</h2>\n`
    for (const p of sec.paragraphs || []) html += `<p>${p}</p>\n`
    if (sec.bullets?.length) {
      html += '<ul>\n'
      for (const b of sec.bullets) html += `  <li>${b}</li>\n`
      html += '</ul>\n'
    }
    if (sec.callout) html += `<blockquote>${sec.callout}</blockquote>\n`
    if (sec.section_table) {
      html += '<table>\n<thead><tr>'
      for (const h of sec.section_table.headers) html += `<th>${h}</th>`
      html += '</tr></thead>\n<tbody>\n'
      for (const row of sec.section_table.rows)
        html += '<tr>' + row.map(c => `<td>${c}</td>`).join('') + '</tr>\n'
      html += '</tbody></table>\n'
    }
    html += '\n'
  }
  return html.trim()
}

const SHARED_CSS = `
  .doc h1{font-size:1.6rem;font-weight:900;margin:1.8rem 0 .8rem;color:#0f172a;line-height:1.3}
  .doc h2{font-size:1.25rem;font-weight:800;margin:1.5rem 0 .6rem;color:#0f172a;padding-bottom:6px;border-bottom:2px solid #e2e8f0}
  .doc h3{font-size:1.05rem;font-weight:700;margin:1.2rem 0 .5rem;color:#1e293b}
  .doc p{font-size:.9375rem;line-height:1.85;color:#374151;margin-bottom:1rem}
  .doc ul,.doc ol{padding-left:1.4rem;margin-bottom:1rem}
  .doc li{font-size:.9rem;line-height:1.8;color:#374151;margin-bottom:.4rem}
  .doc blockquote{border-left:4px solid #2563eb;padding:.8rem 1rem;background:#eff6ff;margin:1.2rem 0;border-radius:0 8px 8px 0;font-size:.9rem;color:#1e40af;line-height:1.7}
  .doc table{width:100%;border-collapse:collapse;margin:1.2rem 0;font-size:.875rem}
  .doc th{background:#0f172a;color:#fff;padding:10px 12px;text-align:left;font-size:.75rem;font-weight:700;letter-spacing:.05em}
  .doc td{padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#374151}
  .doc tr:nth-child(even) td{background:#f8fafc}
  .doc strong{font-weight:700;color:#0f172a}
  .doc a{color:#2563eb;text-decoration:underline}
  .doc hr{border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0}
  .doc code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:.85em;font-family:monospace;color:#0f172a}
  .doc img{max-width:100%;height:auto;border-radius:8px;margin:1rem 0}
  .doc-edit{outline:none;min-height:340px}
  .doc-edit:focus{outline:none}
`

const TOOLBAR = [
  { label: 'B', title: '굵게', cmd: 'bold' },
  { label: 'I', title: '기울임', cmd: 'italic' },
  { label: 'H2', title: '소제목', cmd: 'formatBlock', val: 'h2' },
  { label: 'H3', title: '작은 제목', cmd: 'formatBlock', val: 'h3' },
  { label: 'P', title: '본문 단락', cmd: 'formatBlock', val: 'p' },
  { label: '≡', title: '목록', cmd: 'insertUnorderedList' },
  { label: '❝', title: '인용', cmd: 'formatBlock', val: 'blockquote' },
  { label: '─', title: '구분선', cmd: 'insertHorizontalRule' },
  { label: '🔗', title: '링크', cmd: 'link' },
]

function UnsplashModal({ onInsert, onClose }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      const tk = await getFreshToken()
      if (!tk) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      const res = await fetch(`/api/admin/unsplash?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${tk}` },
      })
      if (res.status === 401) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      const data = await res.json()
      if (!res.ok) { setError(data.error || '검색 실패'); return }
      setResults(data.results || [])
    } catch {
      setError('네트워크 오류')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="flex max-h-[80vh] w-[720px] max-w-[95vw] flex-col overflow-hidden rounded-xl bg-white" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4">
          <span className="text-sm font-bold text-slate-900">Unsplash 이미지</span>
          <div className="flex flex-1 gap-2">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="키워드 입력 (영문 권장)"
              className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-[13px] text-slate-900 outline-none"
            />
            <button onClick={search} disabled={loading} className="rounded-md bg-blue-600 px-4 py-1.5 text-[13px] font-bold text-white disabled:opacity-60">
              {loading ? '검색 중…' : '검색'}
            </button>
          </div>
          <button onClick={onClose} className="rounded-md border border-slate-200 px-2.5 py-1 text-[13px] text-slate-500">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          {results.length === 0 && !loading && !error && (
            <p className="mt-10 text-center text-[13px] text-slate-400">검색어를 입력하세요</p>
          )}
          <div className="grid grid-cols-3 gap-2.5">
            {results.map(img => (
              <div key={img.id} className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-600"
                onClick={() => onInsert(img)}>
                <img src={img.thumb} alt={img.alt} className="block h-[140px] w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[10px] text-white">{img.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Toolbar({ editorRef, onUploadStart, onUploadDone, onUploadError }) {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [showUnsplash, setShowUnsplash] = useState(false)
  const savedRangeRef = useRef(null)

  const exec = (cmd, val) => {
    if (cmd === 'link') {
      const url = window.prompt('URL 입력', 'https://')
      if (url) document.execCommand('createLink', false, url)
    } else {
      document.execCommand(cmd, false, val || null)
    }
    editorRef.current?.focus()
  }

  const saveRange = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange()
  }

  const insertImageUrl = (url, alt) => {
    const el = editorRef.current
    if (!el) return
    el.focus()
    const sel = window.getSelection()
    if (savedRangeRef.current) {
      sel.removeAllRanges()
      sel.addRange(savedRangeRef.current)
    }
    const img = document.createElement('img')
    img.src = url
    img.alt = alt || ''
    img.style.maxWidth = '100%'
    const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null
    if (range) {
      range.collapse(false)
      range.insertNode(img)
      range.setStartAfter(img)
      range.setEndAfter(img)
      sel.removeAllRanges()
      sel.addRange(range)
    } else {
      el.appendChild(img)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    onUploadStart()
    try {
      const tk = await getFreshToken()
      if (!tk) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tk}` },
        body: form,
      })
      if (res.status === 401) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      const data = await res.json()
      if (!res.ok) { onUploadError(data.error || '업로드 실패'); return }
      insertImageUrl(data.url, file.name)
      onUploadDone()
    } catch {
      onUploadError('네트워크 오류')
    }
  }

  const handleUnsplashInsert = (img) => {
    insertImageUrl(img.full, img.alt)
    setShowUnsplash(false)
  }

  const btnClass = 'min-w-[32px] rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-blue-50'

  return (
    <>
      <div className="sticky top-14 z-30 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm">
        {TOOLBAR.map(({ label, title, cmd, val }) => (
          <button key={label} title={title} onMouseDown={(e) => { e.preventDefault(); exec(cmd, val) }} className={btnClass}>
            {label}
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-slate-200" />
        <button title="이미지 업로드" onMouseDown={(e) => { e.preventDefault(); saveRange(); fileInputRef.current?.click() }} className={btnClass}>📁</button>
        <button title="Unsplash 이미지" onMouseDown={(e) => { e.preventDefault(); saveRange(); setShowUnsplash(true) }} className={btnClass}>🖼</button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      {showUnsplash && <UnsplashModal onInsert={handleUnsplashInsert} onClose={() => setShowUnsplash(false)} />}
    </>
  )
}

function AdminEditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editorRef = useRef(null)

  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // 글 데이터
  const [editId, setEditId] = useState(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('테슬라')
  const [readTime, setReadTime] = useState('1분')
  const [content, setContent] = useState('')
  const [slugTouched, setSlugTouched] = useState(false) // 슬러그 수동 편집 여부(자동 채움 중단용)

  // UI
  const [bodyMode, setBodyMode] = useState('rich') // rich | html
  const [showPreview, setShowPreview] = useState(false)
  const [previewDevice, setPreviewDevice] = useState('mobile')
  const [savedMsg, setSavedMsg] = useState('')
  const [uploadMsg, setUploadMsg] = useState('')

  const isEditMode = !!editId

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : ''
    if (!t) { router.push('/admin/login'); return }
    setToken(t)
  }, [router])

  // 진입 파라미터 처리 (id 또는 slug → 편집 / 없으면 새 글)
  useEffect(() => {
    if (!token) return
    const idParam = searchParams.get('id')
    const slugParam = searchParams.get('slug')
    if (idParam) {
      loadGuideById(idParam, token)
    } else if (slugParam) {
      resolveSlug(slugParam, token)
    }
  }, [token])

  const resolveSlug = async (slugParam, tk) => {
    try {
      const res = await fetch('/api/admin/guides', { headers: { Authorization: `Bearer ${tk}` } })
      if (res.status === 401) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      if (!res.ok) return
      const list = await res.json()
      const match = list.find((g) => g.slug === slugParam)
      if (match) loadGuideById(match.id, tk)
    } catch {}
  }

  const loadGuideById = async (id, tk) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/guides/${id}`, { headers: { Authorization: `Bearer ${tk}` } })
      if (res.status === 401) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      if (!res.ok) return
      const data = await res.json()
      setEditId(data.id)
      setTitle(data.title || '')
      setSlug(data.slug || '')
      setSlugTouched(true) // 발행된 글의 슬러그는 자동 변경 금지(URL·색인 고정)
      setDescription(data.description || '')
      setCategory(data.category || '테슬라')
      setReadTime(data.read_time || '1분')
      const html = data.content_html || sectionsToHtml(data)
      setContent(html)
    } finally {
      setLoading(false)
    }
  }

  // 리치 에디터에 콘텐츠 주입 (rich 모드 진입/로드 시)
  useEffect(() => {
    if (bodyMode === 'rich' && editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [bodyMode, content, loading])

  const switchBodyMode = (next) => {
    if (bodyMode === 'rich' && editorRef.current) {
      setContent(editorRef.current.innerHTML)
    }
    setBodyMode(next)
  }

  const currentContent = () =>
    bodyMode === 'rich' && editorRef.current ? editorRef.current.innerHTML : content

  const handleSave = async () => {
    if (!title.trim()) {
      alert('제목은 필수입니다.')
      return
    }
    const html = currentContent()

    // 요약·읽기시간·슬러그 자동 처리 (작성자 입력 없이도 최적값 생성)
    const finalDescription = description.trim() || deriveSummary(html) || title.trim()
    const finalReadTime = estimateReadTime(html)
    const finalSlug = slug.trim() || slugifyKo(title)
    // 화면에도 반영
    if (finalDescription !== description) setDescription(finalDescription)
    if (finalReadTime !== readTime) setReadTime(finalReadTime)

    setSaving(true)
    try {
      const tk = await getFreshToken()
      if (!tk) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      if (isEditMode) {
        const res = await fetch(`/api/admin/guides/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tk}` },
          body: JSON.stringify({
            title: title.trim(),
            description: finalDescription,
            category,
            read_time: finalReadTime,
            slug: finalSlug || undefined,
            key_points: [],
            content_html: html,
            // 에디터에서 직접 작성·발행 → 사람 작성 + 공개
            source: 'manual_editor',
            status: 'published',
          }),
        })
        const data = await res.json()
        if (!res.ok) { alert(`저장 실패: ${data.error || ''}`); return }
        setContent(html)
        setSavedMsg('저장 완료!')
        setTimeout(() => setSavedMsg(''), 2500)
        if (data.slug) {
          fetch('/api/admin/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tk}` },
            body: JSON.stringify({ slug: data.slug }),
          }).catch(() => {})
        }
      } else {
        const res = await fetch('/api/admin/guides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tk}` },
          body: JSON.stringify({
            title: title.trim(),
            description: finalDescription,
            category,
            read_time: finalReadTime,
            slug: finalSlug || undefined,
            key_points: [],
            content_html: html,
            // 에디터에서 직접 작성·발행 → 사람 작성 + 공개
            source: 'manual_editor',
            status: 'published',
          }),
        })
        const data = await res.json()
        if (!res.ok) { alert(`저장 실패: ${data.error || ''}`); return }
        setEditId(data.id)
        setSlug(data.slug)
        setContent(html)
        setSavedMsg('발행 완료!')
        setTimeout(() => setSavedMsg(''), 2500)
        // URL을 편집 모드로 교체 (새로고침해도 같은 글)
        router.replace(`/admin/editor?id=${data.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const previewWidth = previewDevice === 'mobile' ? '390px' : previewDevice === 'tablet' ? '768px' : '100%'

  return (
    <div className="min-h-screen bg-slate-100" style={{ fontFamily: "'Noto Sans KR', system-ui, sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: SHARED_CSS }} />

      {/* 헤더 */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 text-white md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin/posts" className="flex-shrink-0 text-[13px] text-slate-400 hover:text-white">← 글 관리</Link>
          <span className="hidden text-[13px] font-bold text-slate-500 sm:inline">/</span>
          <span className="truncate text-[15px] font-bold">{isEditMode ? '글 수정' : '새 글 작성'}</span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {savedMsg && <span className="text-xs font-semibold text-emerald-400">{savedMsg}</span>}
          <button onClick={() => setShowPreview(true)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800">👁 미리보기</button>
          <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-60">
            {saving ? '저장 중…' : (isEditMode ? '저장' : '발행')}
          </button>
          <button onClick={handleLogout} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800">로그아웃</button>
        </div>
      </header>

      {loading ? (
        <div className="flex h-[60vh] items-center justify-center text-sm text-slate-500">불러오는 중…</div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:px-6 lg:grid-cols-[1fr_340px]">
          {/* 본문 영역 */}
          <div className="space-y-5">
            {/* 제목 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">제목</label>
              <input
                value={title}
                onChange={e => {
                  const v = e.target.value
                  setTitle(v)
                  // 새 글 + 슬러그 미수정 시 제목에서 자동 생성
                  if (!isEditMode && !slugTouched) setSlug(slugifyKo(v))
                }}
                placeholder="글 제목을 입력하세요"
                className="w-full border-0 p-0 text-2xl font-black text-slate-900 outline-none placeholder:text-slate-300"
              />
            </div>

            {/* 요약 (선택 — 비우면 본문에서 자동 생성) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  요약 <span className="font-medium normal-case text-slate-400">· 선택 (비우면 본문에서 자동 생성)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setDescription(deriveSummary(currentContent()))}
                  className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  본문에서 자동 생성
                </button>
              </div>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="비워두면 저장 시 본문 첫 단락으로 자동 채워집니다 (검색·메타 설명용)"
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
              />
            </div>

            {/* 본문 */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-5 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">본문</span>
                <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
                  <button onClick={() => switchBodyMode('rich')} className={`rounded-md px-3 py-1 text-xs font-semibold ${bodyMode === 'rich' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>✏️ 에디터</button>
                  <button onClick={() => switchBodyMode('html')} className={`rounded-md px-3 py-1 text-xs font-semibold ${bodyMode === 'html' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>⌨️ HTML</button>
                </div>
              </div>

              {bodyMode === 'rich' ? (
                <div>
                  <Toolbar
                    editorRef={editorRef}
                    onUploadStart={() => setUploadMsg('업로드 중…')}
                    onUploadDone={() => { setUploadMsg(''); }}
                    onUploadError={(msg) => { setUploadMsg(msg); setTimeout(() => setUploadMsg(''), 3000) }}
                  />
                  {uploadMsg && <div className="bg-amber-50 px-5 py-1.5 text-xs font-semibold text-amber-600">{uploadMsg}</div>}
                  <div className="px-6 py-5">
                    <div ref={editorRef} contentEditable suppressContentEditableWarning className="doc doc-edit" />
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-b-2xl">
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    spellCheck={false}
                    className="block h-[460px] w-full resize-none bg-slate-900 p-5 font-mono text-[13px] leading-7 text-slate-100 outline-none"
                  />
                  <div className="flex gap-4 bg-slate-950 px-5 py-1.5 text-[11px] text-slate-500">
                    <span>{content.length.toLocaleString()} chars</span>
                    <span>{content.split('\n').length} lines</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-900">발행 설정</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">카테고리</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">읽기 시간 <span className="font-normal text-slate-400">· 자동</span></label>
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    <span>{readTime}</span>
                    <span className="text-[11px] text-slate-400">본문 길이로 자동 계산</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-slate-900">URL 슬러그 <span className="text-xs font-normal text-slate-400">· 자동</span></h3>
              <p className="mb-3 text-[11px] leading-relaxed text-slate-400">
                주소 끝부분(검색 노출 URL). 제목에서 자동 생성됩니다.
                {isEditMode && <span className="text-amber-600"> 발행된 글은 변경 시 기존 링크·검색 색인이 깨지므로 그대로 두세요.</span>}
              </p>
              <input
                value={slug}
                onChange={e => { setSlug(e.target.value); setSlugTouched(true) }}
                placeholder="제목 입력 시 자동 생성"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400"
              />
              <p className="mt-2 break-all text-xs text-slate-400">/guides/{slug.trim() || '자동생성'}</p>
            </div>
          </aside>
        </div>
      )}

      {/* 미리보기 모달 */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/70">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="mr-2 text-sm font-medium">미리보기</span>
              <div className="flex gap-1 rounded-lg bg-slate-700 p-1">
                {[['mobile', '모바일'], ['tablet', '태블릿'], ['desktop', '데스크톱']].map(([id, label]) => (
                  <button key={id} onClick={() => setPreviewDevice(id)} className={`rounded px-3 py-1.5 text-xs font-medium ${previewDevice === id ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}>{label}</button>
                ))}
              </div>
              <span className="ml-2 text-xs text-slate-400">{previewWidth}</span>
            </div>
            <button onClick={() => setShowPreview(false)} className="rounded-lg p-2 hover:bg-slate-700">✕</button>
          </div>
          <div className="flex flex-1 justify-center overflow-y-auto bg-slate-100 p-4 md:p-8">
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl transition-all" style={{ width: previewWidth, maxWidth: '100%', minHeight: '100%' }}>
              <div className="px-6 py-8 text-white" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#172554 46%,#2563eb 100%)' }}>
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">{category}</div>
                <h1 className="mb-2 text-2xl font-black leading-tight">{title || '제목을 입력하세요'}</h1>
                <p className="text-sm leading-6 text-blue-100">{description}</p>
              </div>
              <div className="doc px-7 py-7" dangerouslySetInnerHTML={{ __html: currentContent() || '<p style="color:#94a3b8">본문을 입력하세요</p>' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminEditorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">로딩 중…</div>}>
      <AdminEditorContent />
    </Suspense>
  )
}
