import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function authHeaders() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  }
}

function checkAuth(request) {
  const auth = request.headers.get('Authorization') ?? ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

// GET /api/admin/guides — 가이드 목록
export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/guides?select=id,slug,title,category,description,read_time,published_at,updated_at,content_html&order=created_at.desc`,
    { headers: authHeaders() }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Supabase error' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
