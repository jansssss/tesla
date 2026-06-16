import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function getAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}

async function checkAuth(request) {
  const auth = request.headers.get('Authorization') ?? ''
  const token = auth.replace('Bearer ', '')
  if (!token) return false

  const { data: { user }, error } = await getAdminClient().auth.getUser(token)
  return !error && !!user
}

// GET /api/admin/guides — 가이드 목록
export async function GET(request) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('guides')
    .select('id,slug,title,category,description,read_time,published_at,updated_at,content_html')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// 제목에서 ASCII 슬러그 후보 생성 (한글 등은 제거됨)
function slugifyAscii(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

// POST /api/admin/guides — 새 가이드(글) 생성
export async function POST(request) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식' }, { status: 400 })
  }

  const title = (body.title || '').trim()
  const category = (body.category || '').trim()
  const description = (body.description || '').trim()

  if (!title || !category || !description) {
    return NextResponse.json({ error: '제목, 카테고리, 요약은 필수입니다.' }, { status: 400 })
  }

  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')

  let slug = (body.slug || '').trim().toLowerCase().replace(/[^a-z0-9가-힣-]+/g, '-').replace(/^-+|-+$/g, '')
  if (!slug) {
    const base = slugifyAscii(title)
    slug = `${y}${m}${d}-${base || Math.random().toString(36).slice(2, 8)}`
  }

  const insertData = {
    slug,
    category,
    title,
    description,
    read_time: (body.read_time || '5분').toString(),
    key_points: Array.isArray(body.key_points) ? body.key_points : [],
    sources: Array.isArray(body.sources) ? body.sources : [],
    content_html: typeof body.content_html === 'string' ? body.content_html : null,
    published_at: `${y}-${m}-${d}`,
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('guides')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    const isDup = error.code === '23505'
    return NextResponse.json(
      { error: isDup ? '이미 존재하는 슬러그입니다. 다른 슬러그를 입력하세요.' : error.message },
      { status: isDup ? 409 : 500 }
    )
  }

  try {
    revalidatePath('/')
    revalidatePath('/guides')
    revalidatePath(`/guides/${slug}`)
  } catch {}

  return NextResponse.json(data, { status: 201 })
}
