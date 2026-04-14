// Supabase Auth 방식으로 교체됨 — 이 라우트는 더 이상 사용하지 않음
// 로그인은 supabase.auth.signInWithPassword() 클라이언트 직접 호출로 처리

import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ message: 'Use Supabase Auth directly' })
}
