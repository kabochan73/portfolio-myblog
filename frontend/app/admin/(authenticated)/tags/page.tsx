'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { revalidatePosts } from '@/lib/revalidate'
import type { Tag } from '@/types'

export default function AdminTagsPage() {
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6B7280')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchTags = useCallback(async (token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    setTags(data)
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchTags(token)
  }, [router, fetchTags])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, color }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message ?? '作成に失敗しました。')
        return
      }

      const newTag: Tag = await res.json()
      await revalidatePosts()
      setTags((prev) => [...prev, newTag])
      setName('')
      setColor('#6B7280')
    } catch {
      setError('通信エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('このタグを削除しますか？')) return

    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/tags/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      await revalidatePosts()
      setTags((prev) => prev.filter((tag) => tag.id !== id))
    }
  }

  return (
    <div className="space-y-10">
      <h1 className="text-xl font-bold text-gray-900">タグ管理</h1>

      {/* タグ作成フォーム */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">新規タグ作成</h2>
        <form onSubmit={handleCreate} className="flex items-end gap-3">
          <div className="space-y-1">
            <label className="text-sm text-gray-700">タグ名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700">カラー</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-gray-300"
              />
              <span className="text-sm text-gray-500">{color}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? '作成中...' : '作成'}
          </button>
        </form>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </section>

      {/* タグ一覧 */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">タグ一覧</h2>
        {tags.length === 0 ? (
          <p className="text-gray-500">まだタグがありません。</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tags.map((tag) => (
              <li key={tag.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-sm text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                  <span className="text-sm text-gray-400">{tag.color}</span>
                </div>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
