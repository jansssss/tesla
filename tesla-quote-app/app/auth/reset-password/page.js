'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase가 recovery 링크 클릭 후 hash에 토큰을 담아 리다이렉트함
    // supabase-js v2는 자동으로 세션을 감지함
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true)
      } else {
        setMsg('유효하지 않은 링크입니다. 비밀번호 재설정 이메일을 다시 요청해주세요.')
      }
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setMsg('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 8) {
      setMsg('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    setMsg('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMsg(error.message)
      setLoading(false)
    } else {
      setMsg('비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다...')
      setTimeout(() => router.push('/admin/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-white text-xl font-semibold mb-6 text-center">비밀번호 재설정</h1>

        {!ready && !msg && (
          <p className="text-gray-400 text-sm text-center">확인 중...</p>
        )}

        {msg && !ready && (
          <p className="text-red-400 text-sm text-center">{msg}</p>
        )}

        {ready && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">새 비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                placeholder="8자 이상"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                placeholder="동일하게 입력"
              />
            </div>

            {msg && (
              <p className={`text-sm ${msg.includes('변경') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black text-sm font-medium py-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
