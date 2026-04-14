import { createClient } from '@supabase/supabase-js'

// NEXT_PUBLIC_ 변수는 빌드 타임에 주입됨 — Vercel/로컬 .env.local에 설정 필요
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
