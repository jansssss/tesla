'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

/* 기존 sections 구조 → HTML 변환 */
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
      for (const row of sec.section_table.rows) {
        html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>\n'
      }
      html += '</tbody></table>\n'
    }
    html += '\n'
  }
  if (guide.sources?.length) {
    html += '<hr>\n<h3>참고 출처</h3>\n<ul>\n'
    for (const s of guide.sources) {
      html += `  <li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>\n`
    }
    html += '</ul>\n'
  }
  return html.trim()
}

const PREVIEW_CSS = `
  .preview-body { padding: 32px; max-width: 760px; margin: 0 auto; }
  .preview-body h1{font-size:1.6rem;font-weight:900;margin:1.8rem 0 .8rem;color:#0f172a;line-height:1.3}
  .preview-body h2{font-size:1.25rem;font-weight:800;margin:1.5rem 0 .6rem;color:#0f172a;padding-bottom:6px;border-bottom:2px solid #e2e8f0}
  .preview-body h3{font-size:1.05rem;font-weight:700;margin:1.2rem 0 .5rem;color:#1e293b}
  .preview-body p{font-size:.9375rem;line-height:1.85;color:#374151;margin-bottom:1rem}
  .preview-body ul,.preview-body ol{padding-left:1.4rem;margin-bottom:1rem}
  .preview-body li{font-size:.9rem;line-height:1.8;color:#374151;margin-bottom:.4rem}
  .preview-body blockquote{border-left:4px solid #2563eb;padding:.8rem 1rem;background:#eff6ff;margin:1.2rem 0;border-radius:0 8px 8px 0;font-size:.9rem;color:#1e40af;line-height:1.7}
  .preview-body table{width:100%;border-collapse:collapse;margin:1.2rem 0;font-size:.875rem}
  .preview-body th{background:#0f172a;color:#fff;padding:10px 12px;text-align:left;font-size:.75rem;font-weight:700;letter-spacing:.05em}
  .preview-body td{padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#374151}
  .preview-body tr:nth-child(even) td{background:#f8fafc}
  .preview-body strong{font-weight:700;color:#0f172a}
  .preview-body a{color:#2563eb;text-decoration:underline}
  .preview-body hr{border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0}
  .preview-body code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:.85em;font-family:monospace;color:#0f172a}
`

export default function AdminEditorPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [guides, setGuides] = useState([])
  const [selected, setSelected] = useState(null)
  const [htmlContent, setHtmlContent] = useState('')
  const [editMode, setEditMode] = useState('html') // 'html' | 'preview'
  const [saving, setSaving] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingGuide, setLoadingGuide] = useState(false)
  const [search, setSearch] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

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
        setHtmlContent(data.content_html || sectionsToHtml(data))
        setEditMode('html')
      }
    } finally { setLoadingGuide(false) }
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/guides/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content_html: htmlContent }),
      })
      if (res.ok) {
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

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Noto Sans KR', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: PREVIEW_CSS }} />

      {/* 상단 헤더 */}
      <div style={{ background: '#0f172a', color: 'white', padding: '0 20px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: '12px' }}>
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

            {/* 탭 + 저장 버튼 */}
            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '44px', flexShrink: 0 }}>
              {/* 탭 */}
              <div style={{ display: 'flex', gap: '0', height: '100%' }}>
                {['html', 'preview'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setEditMode(mode)}
                    style={{
                      padding: '0 18px',
                      height: '100%',
                      border: 'none',
                      borderBottom: editMode === mode ? '2px solid #2563eb' : '2px solid transparent',
                      background: 'transparent',
                      color: editMode === mode ? '#2563eb' : '#64748b',
                      fontWeight: editMode === mode ? '700' : '500',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    {mode === 'html' ? '✏️ HTML 편집' : '👁 미리보기'}
                  </button>
                ))}
              </div>

              {/* 저장 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {savedMsg && <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>{savedMsg}</span>}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '6px 18px', borderRadius: '6px', border: 'none',
                    background: saving ? '#94a3b8' : '#2563eb',
                    color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '13px', fontWeight: '700'
                  }}
                >
                  {saving ? '저장 중…' : '저장'}
                </button>
              </div>
            </div>

            {/* 편집 / 미리보기 */}
            {editMode === 'html' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  style={{
                    flex: 1, width: '100%', padding: '20px 24px',
                    border: 'none', outline: 'none', resize: 'none',
                    fontFamily: '"Fira Code", "Consolas", "Courier New", monospace',
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
            ) : (
              <div style={{ flex: 1, overflow: 'auto', background: '#f1f5f9', padding: '24px' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.08)' }}>
                  {/* 가이드 헤더 */}
                  <div style={{ background: 'linear-gradient(135deg,#0f172a 0%,#172554 46%,#2563eb 100%)', padding: '28px 32px', color: 'white' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bfdbfe', marginBottom: '6px' }}>
                      {selected.category}
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 8px', lineHeight: '1.3' }}>
                      {selected.title}
                    </h1>
                    <p style={{ fontSize: '13px', color: '#bfdbfe', margin: 0, lineHeight: '1.6' }}>
                      {selected.description}
                    </p>
                  </div>
                  {/* 본문 미리보기 */}
                  <div
                    className="preview-body"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
