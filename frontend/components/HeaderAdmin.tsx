'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HeaderAdmin() {
  const router = useRouter()

  async function handleLogout() {
    const token = localStorage.getItem('token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    localStorage.removeItem('token')
    router.push('/admin/login')
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600">
          My blog
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/admin/posts" className="text-sm text-gray-600 hover:text-gray-900">
            記事管理
          </Link>
          <Link href="/admin/posts/drafts" className="text-sm text-gray-600 hover:text-gray-900">
            下書き
          </Link>
          <Link href="/admin/tags" className="text-sm text-gray-600 hover:text-gray-900">
            タグ管理
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            ログアウト
          </button>
        </nav>
      </div>
    </header>
  )
}
