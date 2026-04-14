'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

/* 기존 sections 구조 → HTML 변환 */
function sectionsToHtml(guide) {
  let html = ''

  if (guide.key_points?.length) {
    html += '<h2>핵심 요약</h2><ul>'
    for (const pt of guide.key_points) {
      html += `<li>${pt}</li>`
    }
    html += '</ul>'
  }

  for (const [i, sec] of (guide.sections || []).entries()) {
    html += `<h2>${String(i + 1).padStart(2, '0')}. ${sec.title}</h2>`
    for (const p of sec.paragraphs || []) {
      html += `<p>${p}</p>`
    }
    if (sec.bullets?.length) {
      html += '<ul>'
      for (const b of sec.bullets) html += `<li>${b}</li>`
      html += '</ul>'
    }
    if (sec.callout) {
      html += `<blockquote>${sec.callout}</blockquote>`
    }
    if (sec.section_table) {
      html += '<table><thead><tr>'
      for (const h of sec.section_table.headers) html += `<th>${h}</th>`
      html += '</tr></thead><tbody>'
      for (const row of sec.section_table.rows) {
        html += '<tr>'
        for (const cell of row) html += `<td>${cell}</td>`
        html += '</tr>'
      }
      html += '</tbody></table>'
    }
  }

  if (guide.sources?.length) {
    html += '<hr><h3>참고 출처</h3><ul>'
    for (const s of guide.sources) {
      html += `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name}</a></li>`
    }
    html += '</ul>'
  }

  return html
}

const PREVIEW_CSS = `
  .guide-html-content h1{font-size:1.6rem;font-weight:900;margin:1.8rem 0 .8rem;color:#0f172a;line-height:1.3}
  .guide-html-content h2{font-size:1.25rem;font-weight:800;margin:1.5rem 0 .6rem;color:#0f172a;line-height:1.35}
  .guide-html-content h3{font-size:1.05rem;font-weight:700;margin:1.2rem 0 .5rem;color:#1e293b}
  .guide-html-content p{font-size:.9375rem;line-height:1.85;color:#374151;margin-bottom:1rem}
  .guide-html-content ul,.guide-html-content ol{padding-left:1.4rem;margin-bottom:1rem}
  .guide-html-content li{font-size:.9rem;line-height:1.8;color:#374151;margin-bottom:.4rem}
  .guide-html-content blockquote{border-left:4px solid #2563eb;padding:.8rem 1rem;background:#eff6ff;margin:1.2rem 0;border-radius:0 8px 8px 0;font-size:.9rem;color:#1e40af;line-height:1.7}
  .guide-html-content table{width:100%;border-collapse:collapse;margin:1.2rem 0;font-size:.875rem}
  .guide-html-content th{background:#0f172a;color:#fff;padding:10px 12px;text-align:left;font-size:.75rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
  .guide-html-content td{padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#374151}
  .guide-html-content tr:nth-child(even) td{background:#f8fafc}
  .guide-html-content strong{font-weight:700;color:#0f172a}
  .guide-html-content a{color:#2563eb;text-decoration:underline}
  .guide-html-content hr{border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0}
  .guide-html-content code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:.85em;font-family:monospace;color:#0f172a}
`

export default function AdminEditorPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [guides, setGuides] = useState([])
  const [selected, setSelected] = useState(null)   // 현재 편집 중인 가이드 전체 데이터
  const [htmlContent, setHtmlContent] = useState('')
  const [editMode, setEditMode] = useState('html') // 'html' | 'preview'
  const [saving, setSaving] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingGuide, setLoadingGuide] = useState(false)
  const [search, setSearch] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : ''
    if (!storedToken) {
      router.push('/admin/login')
      return
    }
    setToken(storedToken)
  }, [router])

  const loadGuides = useCallback(async (tk) => {
    setLoadingList(true)
    try {
      const res = await fetch('/api/admin/guides', {
        headers: { Authorization: `Bearer ${tk}` },
      })
      if (res.status === 401) {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
        return
      }
      if (res.ok) setGuides(await res.json())
    } finally {
      setLoadingList(false)
    }
  }, [router])

  useEffect(() => {
    if (token) loadGuides(token)
  }, [token, loadGuides])

  const selectGuide = async (guide) => {
    setLoadingGuide(true)
    setSelected(null)
    setHtmlContent('')
    try {
      const res = await fetch(`/api/admin/guides/${guide.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setSelected(data)
        setHtmlContent(data.content_html || sectionsToHtml(data))
        setEditMode('html')
      }
    } finally {
      setLoadingGuide(false)
    }
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/guides/${selected.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content_html: htmlContent }),
      })
      if (res.ok) {
        setSavedMsg('저장 완료!')
        setTimeout(() => setSavedMsg(''), 2500)
        loadGuides(token)
      } else {
        alert('저장 실패. 콘솔을 확인하세요.')
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

  const filtered = guides.filter(
    (g) => g.title.includes(search) || g.slug.includes(search) || g.category.includes(search)
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Noto Sans KR', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: PREVIEW_CSS }} />

      {/* 상단 헤더 */}
      <div style={{ background: '#0f172a', color: 'white', padding: '0 20px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← 홈
          </Link>
          <span style={{ color: '#475569' }}>|</span>
          <span style={{ fontSize: '15px', fontWeight: '700' }}>가이드 편집기</span>
          {selected && (
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              / {selected.title.length > 30 ? selected.title.slice(0, 30) + '…' : selected.title}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {savedMsg && (
            <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: '600' }}>{savedMsg}</span>
          )}
          {selected && (
            <>
              <button
                onClick={() => setEditMode(editMode === 'html' ? 'preview' : 'html')}
                style={{
                  padding: '6px 14px', borderRadius: '6px', border: '1px solid #475569',
                  background: editMode === 'preview' ? '#1e3a5f' : 'transparent',
                  color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                }}
              >
                {editMode === 'html' ? '👁 미리보기' : '✏️ HTML 편집'}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '6px 16px', borderRadius: '6px', border: 'none',
                  background: saving ? '#475569' : '#2563eb',
                  color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '13px', fontWeight: '700'
                }}
              >
                {saving ? '저장 중…' : '💾 저장'}
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px', borderRadius: '6px', border: '1px solid #475569',
              background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '12px'
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 본문 영역 */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 52px)' }}>

        {/* 좌측 가이드 목록 */}
        <div style={{ width: '280px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목·카테고리 검색"
              style={{
                width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0',
                borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#0f172a'
              }}
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
                    padding: '12px 14px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                    background: selected?.id === guide.id ? '#eff6ff' : 'white',
                    borderLeft: `3px solid ${selected?.id === guide.id ? '#2563eb' : 'transparent'}`,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (selected?.id !== guide.id) e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={(e) => { if (selected?.id !== guide.id) e.currentTarget.style.background = 'white' }}
                >
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '3px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {guide.category}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', lineHeight: '1.4' }}>
                    {guide.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'flex', gap: '6px' }}>
                    <span>{guide.content_html ? '✅ HTML' : '📄 원본'}</span>
                    <span>·</span>
                    <span>{(guide.updated_at || guide.published_at || '').slice(0, 10)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '8px 14px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#94a3b8' }}>
            총 {filtered.length}개
          </div>
        </div>

        {/* 우측 편집 영역 */}
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            {loadingGuide ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                <p style={{ fontSize: '14px' }}>가이드 불러오는 중…</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
                <p style={{ fontSize: '14px' }}>좌측에서 편집할 가이드를 선택하세요</p>
              </div>
            )}
          </div>
        ) : editMode === 'html' ? (
          /* HTML 편집 모드 */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* 가이드 메타 정보 */}
            <div style={{ padding: '10px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '13px' }}>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{selected.title}</span>
              <span style={{ color: '#94a3b8', marginLeft: '10px' }}>{selected.category}</span>
              <span style={{ color: '#cbd5e1', marginLeft: '10px' }}>|</span>
              <span style={{ color: '#64748b', marginLeft: '10px', fontSize: '12px' }}>
                {selected.description?.slice(0, 70)}{selected.description?.length > 70 ? '…' : ''}
              </span>
            </div>
            {/* HTML 소스 textarea */}
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              style={{
                flex: 1, width: '100%', padding: '18px 22px',
                border: 'none', outline: 'none', resize: 'none',
                fontFamily: '"Fira Code", "Consolas", "Courier New", monospace',
                fontSize: '13px', lineHeight: '1.75',
                background: '#1e293b', color: '#e2e8f0',
                boxSizing: 'border-box', tabSize: 2,
              }}
              placeholder="<h2>섹션 제목</h2>&#10;<p>본문 내용을 입력하세요.</p>&#10;<ul>&#10;  <li>항목 1</li>&#10;  <li>항목 2</li>&#10;</ul>&#10;<blockquote>강조 문구</blockquote>"
              spellCheck={false}
            />
            {/* 하단 상태바 */}
            <div style={{ padding: '6px 20px', background: '#0f172a', color: '#64748b', fontSize: '11px', display: 'flex', gap: '16px' }}>
              <span>문자 수: {htmlContent.length.toLocaleString()}</span>
              <span>줄 수: {htmlContent.split('\n').length}</span>
              <span style={{ marginLeft: 'auto', color: '#475569' }}>HTML 편집 모드 — 저장 후 가이드 페이지에 반영됩니다</span>
            </div>
          </div>
        ) : (
          /* 미리보기 모드 */
          <div style={{ flex: 1, overflow: 'auto', padding: '32px', background: '#f1f5f9' }}>
            <div style={{
              maxWidth: '760px', margin: '0 auto', background: 'white',
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 8px_40px rgba(15,23,42,0.10)',
            }}>
              {/* 가이드 헤더 (실제 페이지와 동일한 스타일) */}
              <div style={{
                background: 'linear-gradient(135deg,#0f172a 0%,#172554 46%,#2563eb 100%)',
                padding: '32px', color: 'white'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bfdbfe', marginBottom: '8px' }}>
                  {selected.category}
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 10px', lineHeight: '1.3' }}>
                  {selected.title}
                </h1>
                <p style={{ fontSize: '14px', color: '#bfdbfe', margin: 0, lineHeight: '1.6' }}>
                  {selected.description}
                </p>
              </div>
              {/* 본문 */}
              <div
                className="guide-html-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{ padding: '32px' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
