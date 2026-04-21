'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminEditButton({ slug }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminToken'))
  }, [])

  if (!isAdmin) return null

  return (
    <Link
      href={`/admin/editor?slug=${encodeURIComponent(slug)}`}
      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
    >
      ✏️ 수정
    </Link>
  )
}
