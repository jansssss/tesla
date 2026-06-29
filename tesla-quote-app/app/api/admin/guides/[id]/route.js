import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function getAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}

// source/status 컬럼 미존재(마이그레이션 전) 에러 판별
function isUnknownColumnError(error) {
  if (!error) return false
  return (
    error.code === '42703' ||
    error.code === 'PGRST204' ||
    /column .* does not exist|find the '(status|source)' column/i.test(error.message || '')
  )
}

async function checkAuth(request) {
  const auth = request.headers.get('Authorization') ?? ''
  const token = auth.replace('Bearer ', '')
  if (!token) return false

  const { data: { user }, error } = await getAdminClient().auth.getUser(token)
  return !error && !!user
}

// GET /api/admin/guides/[id] — 가이드 상세 (섹션 포함)
export async function GET(request, { params }) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = getAdminClient()

  const [{ data: guide, error: gErr }, { data: sections }] = await Promise.all([
    supabase.from('guides').select('*').eq('id', id).single(),
    supabase.from('guide_sections').select('*').eq('guide_id', id).order('order_index'),
  ])

  if (gErr) return NextResponse.json({ error: gErr.message }, { status: gErr.code === 'PGRST116' ? 404 : 500 })
  return NextResponse.json({ ...guide, sections: sections ?? [] })
}

// PATCH /api/admin/guides/[id] — content_html 등 업데이트
export async function PATCH(request, { params }) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const allowed = ['content_html', 'title', 'description', 'category', 'read_time', 'slug', 'key_points', 'sources', 'status', 'source']
  const updateData = {}
  for (const key of allowed) {
    if (key in body && body[key] !== undefined) updateData[key] = body[key]
  }

  if (!Object.keys(updateData).length) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const supabase = getAdminClient()
  let { data, error } = await supabase
    .from('guides')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  // 마이그레이션 전(source/status 컬럼 부재)이면 해당 필드 빼고 재시도
  if (error && isUnknownColumnError(error)) {
    const { source, status, ...rest } = updateData
    if (Object.keys(rest).length) {
      ;({ data, error } = await supabase.from('guides').update(rest).eq('id', id).select().single())
    }
  }

  if (error) {
    const isDup = error.code === '23505'
    return NextResponse.json(
      { error: isDup ? '이미 존재하는 슬러그입니다.' : error.message },
      { status: isDup ? 409 : 500 }
    )
  }

  try {
    revalidatePath('/')
    revalidatePath('/guides')
    if (data?.slug) revalidatePath(`/guides/${data.slug}`)
  } catch {}

  return NextResponse.json(data)
}

// DELETE /api/admin/guides/[id] — 가이드 삭제
export async function DELETE(request, { params }) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = getAdminClient()

  // revalidate용 slug 확보
  const { data: existing } = await supabase.from('guides').select('slug').eq('id', id).single()

  const { error } = await supabase.from('guides').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    revalidatePath('/')
    revalidatePath('/guides')
    if (existing?.slug) revalidatePath(`/guides/${existing.slug}`)
  } catch {}

  return NextResponse.json({ deleted: true })
}
