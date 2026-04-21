import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'images'

function getAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY)
}

async function verifyToken(request) {
  const auth = request.headers.get('Authorization') ?? ''
  const token = auth.replace('Bearer ', '')
  if (!token) return false
  const { data: { user }, error } = await getAdminClient().auth.getUser(token)
  return !error && !!user
}

export async function POST(request) {
  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const form = await request.formData()
  const file = form.get('file')
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buf = Buffer.from(await file.arrayBuffer())

  const upRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`,
    {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: buf,
    }
  )
  if (!upRes.ok) {
    const err = await upRes.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${key}`
  return NextResponse.json({ url: publicUrl })
}
