'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { revalidatePosts } from '@/lib/revalidate'
import MarkdownEditor from '@/components/MarkdownEditor'
import type { Post, Tag } from '@/types'

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [slug, setSlug] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (id: string, token: string) => {
    const [postRes, tagsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`),
    ])

    if (!postRes.ok) {
      router.push('/admin/posts')
      return
    }

    const allPosts: Post[] = await postRes.json()
    const post = allPosts.find((p) => p.id === Number(id))

    if (!post) {
      router.push('/admin/posts')
      return
    }

    const allTags: Tag[] = await tagsRes.json()

    setTitle(post.title)
    setBody(post.body)
    setSlug(post.slug)
    setIsDraft(!post.published_at)
    setSelectedTagIds(post.tags.map((t) => t.id))
    setTags(allTags)
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    params.then(({ id }) => fetchData(id, token))
  }, [router, params, fetchData])

  function toggleTag(id: number) {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const token = localStorage.getItem('token')
    const { id } = await params

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
          slug,
          published_at: isDraft ? null : new Date().toISOString(),
          tag_ids: selectedTagIds,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message ?? '保存に失敗しました。')
        return
      }

      await revalidatePosts()
      router.push('/admin/posts')
    } catch {
      setError('通信エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">記事編集</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm text-gray-700">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700">スラッグ</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700">本文（Markdown）</label>
          <MarkdownEditor value={body} onChange={setBody} />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
            className="h-4 w-4"
          />
          下書きとして保存
        </label>

        {tags.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm text-gray-700">タグ</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="rounded-full border px-3 py-1 text-sm text-white transition-opacity"
                  style={{
                    backgroundColor: tag.color,
                    borderColor: tag.color,
                    opacity: selectedTagIds.includes(tag.id) ? 1 : 0.4,
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : isDraft ? '下書き保存' : '公開する'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-900"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
