'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function sectionsToHtml(guide) {
  let html = ''
  if (guide.key_points?.length) {
    html += '<h2>핵심 요약</h2>\n<ul>\n'
    for (const pt of guide.key_points) html += `  <li>${pt}</li>\n`
    html += '</ul>\n\n'
  }
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
  if (guide.sources?.length) {
    html += '<hr>\n<h3>참고 출처</h3>\n<ul>\n'
    for (const s of guide.sources)
      html += `  <li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>\n`
    html += '</ul>\n'
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
  /* 에디터 전용 */
  .doc-edit{outline:none;min-height:200px}
  .doc-edit:focus{outline:none}
`

// 툴바 버튼 정의
const TOOLBAR = [
  { label: 'B',        title: '굵게',       cmd: 'bold' },
  { label: 'I',        title: '기울임',     cmd: 'italic' },
  { label: 'H2',       title: '소제목',     cmd: 'formatBlock', val: 'h2' },
  { label: 'H3',       title: '작은 제목',  cmd: 'formatBlock', val: 'h3' },
  { label: 'P',        title: '본문 단락',  cmd: 'formatBlock', val: 'p' },
  { label: '≡',        title: '목록',       cmd: 'insertUnorderedList' },
  { label: '❝',        title: '인용',       cmd: 'formatBlock', val: 'blockquote' },
  { label: '─',        title: '구분선',     cmd: 'insertHorizontalRule' },
  { label: '🔗',       title: '링크',       cmd: 'link' },
]

function Toolbar({ editorRef }) {
  const exec = (cmd, val) => {
    if (cmd === 'link') {
      const url = window.prompt('URL 입력', 'https://')
      if (url) document.execCommand('createLink', false, url)
    } else {
      document.execCommand(cmd, false, val || null)
    }
    editorRef.current?.focus()
  }

  return (
    <div style={{ display: 'flex', gap: '2px', padding: '6px 12px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexWrap: 'wrap' }}>
      {TOOLBAR.map(({ label, title, cmd, val }) => (
        <button
          key={label}
          title={title}
          onMouseDown={(e) => { e.preventDefault(); exec(cmd, val) }}
          style={{
            padding: '4px 10px', border: '1px solid #e2e8f0', borderRadius: '5px',
            background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
            color: '#374151', minWidth: '32px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function AdminEditorPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [guides, setGuides] = useState([])
  const [selected, setSelected] = useState(null)
  const [htmlContent, setHtmlContent] = useState('')
  const [tab, setTab] = useState('editor') // 'editor' | 'html' | 'preview'
  const [saving, setSaving] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingGuide, setLoadingGuide] = useState(false)
  const [search, setSearch] = useState('')
  const [savedMsg, setSavedMsg] = useState('')
  const editorRef = useRef(null)

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : ''
    if (!t) { router.push('/admin/login'); return }
    setToken(t)
  }, [router])

  const loadGuides = useCallback(async (tk) => {
    setLoadingList(true)
    try {
      const res = await fetch('/api/admin/guides', { headers: { Authorization: `Bearer ${tk}` } })
      if (res.status === 401) { localStorage.removeItem('adminToken'); router.push('/admin/login'); return }
      if (res.ok) setGuides(await res.json())
    } finally { setLoadingList(false) }
  }, [router])

  useEffect(() => { if (token) loadGuides(token) }, [token, loadGuides])

  const selectGuide = async (guide) => {
    setLoadingGuide(true)
    setSelected(null)
    setHtmlContent('')
    try {
      const res = await fetch(`/api/admin/guides/${guide.id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setSelected(data)
        const html = data.content_html || sectionsToHtml(data)
        setHtmlContent(html)
        setTab('editor')
        // contenteditable에 초기값 주입은 useEffect에서 처리
      }
    } finally { setLoadingGuide(false) }
  }

  // 탭 전환 시 에디터 ↔ HTML 동기화
  const switchTab = (next) => {
    if (tab === 'editor' && editorRef.current) {
      // 에디터 → HTML/미리보기로 갈 때: innerHTML 저장
      setHtmlContent(editorRef.current.innerHTML)
    }
    setTab(next)
  }

  // editor 탭 활성화 시 contenteditable에 HTML 주입
  useEffect(() => {
    if (tab === 'editor' && editorRef.current && htmlContent !== undefined) {
      if (editorRef.current.innerHTML !== htmlContent) {
        editorRef.current.innerHTML = htmlContent
      }
    }
  }, [tab, selected]) // selected가 바뀔 때도 초기화

  const handleSave = async () => {
    // 저장 전 에디터에서 최신 내용 가져오기
    const content = tab === 'editor' && editorRef.current
      ? editorRef.current.innerHTML
      : htmlContent

    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/guides/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content_html: content }),
      })
      if (res.ok) {
        setHtmlContent(content)
        setSavedMsg('저장 완료!')
        setTimeout(() => setSavedMsg(''), 2500)
        loadGuides(token)
      } else {
        alert('저장 실패')
      }
    } finally { setSaving(false) }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const filtered = guides.filter(
    (g) => g.title?.includes(search) || g.slug?.includes(search) || g.category?.includes(search)
  )

  const TABS = [
    { id: 'editor',  label: '✏️ 에디터' },
    { id: 'html',    label: '⌨️ HTML 소스' },
    { id: 'preview', label: '👁 미리보기' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Noto Sans KR', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: SHARED_CSS }} />

      {/* 상단 헤더 */}
      <div style={{ background: '#0f172a', color: 'white', padding: '0 20px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', flexShrink: 0 }}>← 홈</Link>
          <span style={{ color: '#334155', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>가이드 편집기</span>
          {selected && (
            <span style={{ color: '#475569', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              / {selected.title}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {savedMsg && <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: '600' }}>{savedMsg}</span>}
          <button onClick={handleLogout} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>
            로그아웃
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 48px)' }}>

        {/* 좌측 가이드 목록 */}
        <div style={{ width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목·카테고리 검색"
              style={{ width: '100%', padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingList ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>로딩 중…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>가이드 없음</div>
            ) : (
              filtered.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => selectGuide(guide)}
                  style={{
                    padding: '10px 14px', borderBottom: '1px solid #f8fafc', cursor: 'pointer',
                    background: selected?.id === guide.id ? '#eff6ff' : 'white',
                    borderLeft: `3px solid ${selected?.id === guide.id ? '#2563eb' : 'transparent'}`,
                  }}
                  onMouseEnter={(e) => { if (selected?.id !== guide.id) e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={(e) => { if (selected?.id !== guide.id) e.currentTarget.style.background = 'white' }}
                >
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {guide.category}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', lineHeight: '1.4' }}>
                    {guide.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
                    {guide.content_html ? '✅ HTML 편집됨' : '📄 원본'} · {(guide.updated_at || guide.published_at || '').slice(0, 10)}
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '6px 14px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#94a3b8' }}>
            총 {filtered.length}개
          </div>
        </div>

        {/* 우측 편집 영역 */}
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: '12px' }}>
            {loadingGuide
              ? <><div style={{ fontSize: '32px' }}>⏳</div><p style={{ fontSize: '14px' }}>불러오는 중…</p></>
              : <><div style={{ fontSize: '48px' }}>📝</div><p style={{ fontSize: '14px' }}>좌측에서 가이드를 선택하세요</p></>
            }
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* 탭 바 + 저장 */}
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '44px', flexShrink: 0 }}>
              <div style={{ display: 'flex', height: '100%', gap: '2px' }}>
                {TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => switchTab(id)}
                    style={{
                      padding: '0 16px', height: '100%', border: 'none',
                      borderBottom: tab === id ? '2px solid #2563eb' : '2px solid transparent',
                      background: 'transparent',
                      color: tab === id ? '#2563eb' : '#64748b',
                      fontWeight: tab === id ? '700' : '500',
                      fontSize: '13px', cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {savedMsg && <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>{savedMsg}</span>}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '6px 20px', borderRadius: '6px', border: 'none',
                    background: saving ? '#94a3b8' : '#2563eb',
                    color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '13px', fontWeight: '700',
                  }}
                >
                  {saving ? '저장 중…' : '저장'}
                </button>
              </div>
            </div>

            {/* ── 에디터 탭 ── */}
            <div style={{ flex: 1, display: tab === 'editor' ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden', background: 'white' }}>
              <Toolbar editorRef={editorRef} />
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="doc doc-edit"
                  style={{ minHeight: '100%' }}
                />
              </div>
            </div>

            {/* ── HTML 소스 탭 ── */}
            {tab === 'html' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  style={{
                    flex: 1, width: '100%', padding: '20px 24px',
                    border: 'none', outline: 'none', resize: 'none',
                    fontFamily: '"Fira Code","Consolas","Courier New",monospace',
                    fontSize: '13px', lineHeight: '1.8',
                    background: '#1e293b', color: '#e2e8f0',
                    boxSizing: 'border-box', tabSize: 2,
                  }}
                  spellCheck={false}
                />
                <div style={{ padding: '5px 20px', background: '#0f172a', color: '#475569', fontSize: '11px', display: 'flex', gap: '16px' }}>
                  <span>{htmlContent.length.toLocaleString()} chars</span>
                  <span>{htmlContent.split('\n').length} lines</span>
                  <span style={{ marginLeft: 'auto' }}>저장 후 사이트에 반영됩니다</span>
                </div>
              </div>
            )}

            {/* ── 미리보기 탭 ── */}
            {tab === 'preview' && (
              <div style={{ flex: 1, overflow: 'auto', background: '#f1f5f9', padding: '24px' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.08)' }}>
                  <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#172554 46%,#2563eb 100%)', padding: '28px 32px', color: 'white' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bfdbfe', marginBottom: '6px' }}>{selected.category}</div>
                    <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 8px', lineHeight: '1.3' }}>{selected.title}</h1>
                    <p style={{ fontSize: '13px', color: '#bfdbfe', margin: 0, lineHeight: '1.6' }}>{selected.description}</p>
                  </div>
                  <div className="doc" style={{ padding: '32px' }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
