import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function authHeaders() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
}

function checkAuth(request) {
  const auth = request.headers.get('Authorization') ?? ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

// GET /api/admin/guides/[id] — 가이드 상세 (섹션 포함)
export async function GET(request, { params }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const [guideRes, secRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/guides?id=eq.${id}&select=*&limit=1`, {
      headers: authHeaders(),
    }),
    fetch(`${SUPABASE_URL}/rest/v1/guide_sections?guide_id=eq.${id}&order=order_index.asc`, {
      headers: authHeaders(),
    }),
  ])

  if (!guideRes.ok) {
    return NextResponse.json({ error: 'Supabase error' }, { status: 500 })
  }

  const guides = await guideRes.json()
  if (!guides.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const sections = secRes.ok ? await secRes.json() : []
  return NextResponse.json({ ...guides[0], sections })
}

// PATCH /api/admin/guides/[id] — content_html, title, description 업데이트
export async function PATCH(request, { params }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const body = await request.json()

  // 허용 필드만 추림
  const allowed = ['content_html', 'title', 'description', 'category', 'read_time']
  const updateData = {}
  for (const key of allowed) {
    if (key in body) updateData[key] = body[key]
  }

  if (!Object.keys(updateData).length) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/guides?id=eq.${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(updateData),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
