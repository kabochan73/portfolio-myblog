'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Post, Tag } from '@/types'

type Props = {
  posts: Post[]
  tags: Tag[]
}

export default function PostListWithSearch({ posts, tags }: Props) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      )
    : posts

  return (
    <div className="space-y-8">
      {/* 検索 */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="記事を検索..."
        className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-gray-400 focus:bg-white"
      />

      {/* タグ一覧 */}
      {tags.length > 0 && (
        <section>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="rounded-full border px-3 py-1 text-sm text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: tag.color, borderColor: tag.color }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 検索結果ラベル */}
      {query.trim() && (
        <p className="text-sm text-gray-500">
          「<span className="font-medium text-gray-900">{query}</span>」の検索結果 — {filtered.length} 件
        </p>
      )}

      {/* 記事一覧 */}
      <section>
        {filtered.length === 0 ? (
          <p className="text-gray-500">
            {query ? '記事が見つかりませんでした。' : 'まだ記事がありません。'}
          </p>
        ) : (
          <ul className="space-y-8">
            {filtered.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.slug}`} className="group block">
                  <article className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-600">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4">
                      <time className="text-sm text-gray-400">
                        {new Date(post.published_at!).toLocaleDateString('ja-JP')}
                      </time>
                      {post.tags.length > 0 && (
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="rounded-full px-2 py-0.5 text-xs text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
