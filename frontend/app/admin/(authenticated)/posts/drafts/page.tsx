'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { revalidatePosts } from '@/lib/revalidate'
import type { Post } from '@/types'

export default function AdminDraftsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDrafts = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts/drafts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchDrafts(token)
  }, [router, fetchDrafts])

  async function handleDelete(id: number) {
    if (!confirm('この下書きを削除しますか？')) return

    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      await revalidatePosts()
      setPosts((prev) => prev.filter((post) => post.id !== id))
    }
  }

  if (loading) return <p className="text-gray-500">読み込み中...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">下書き一覧</h1>
          <p className="text-sm text-gray-400 mt-1">{posts.length} 件</p>
        </div>
        <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-gray-900">
          ← 記事管理に戻る
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center">
          <p className="text-gray-400">下書きはありません。</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{post.title}</p>
                <p className="text-sm text-gray-400">
                  最終更新: {new Date(post.updated_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
