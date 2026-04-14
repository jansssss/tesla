import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
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

// GET /api/admin/guides/[id] — 가이드 상세 (섹션 포함)
export async function GET(request, { params }) {
  if (!await checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const supabase = getAdminClient()

  const [{ data: guide, error: gErr }, { data: sections, error: sErr }] = await Promise.all([
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

  const { id } = params
  const body = await request.json()

  const allowed = ['content_html', 'title', 'description', 'category', 'read_time']
  const updateData = {}
  for (const key of allowed) {
    if (key in body) updateData[key] = body[key]
  }

  if (!Object.keys(updateData).length) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('guides')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
