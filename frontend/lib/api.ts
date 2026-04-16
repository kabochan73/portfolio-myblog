import { cacheLife, cacheTag } from 'next/cache'
import type { Post, Tag } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// 記事一覧取得（タグフィルタ対応）
export async function getPosts(tagSlug?: string): Promise<Post[]> {
  'use cache'
  cacheLife('days')
  cacheTag('posts')

  const url = tagSlug
    ? `${API_URL}/posts?tag=${tagSlug}`
    : `${API_URL}/posts`

  const res = await fetch(url)
  if (!res.ok) throw new Error('記事の取得に失敗しました')
  return res.json()
}

// 記事詳細取得
export async function getPost(slug: string): Promise<Post> {
  'use cache'
  cacheLife('days')
  cacheTag('posts', `post-${slug}`)

  const res = await fetch(`${API_URL}/posts/${slug}`)
  if (!res.ok) throw new Error('記事の取得に失敗しました')
  return res.json()
}

// タグ一覧取得
export async function getTags(): Promise<Tag[]> {
  'use cache'
  cacheLife('days')
  cacheTag('tags')

  const res = await fetch(`${API_URL}/tags`)
  if (!res.ok) throw new Error('タグの取得に失敗しました')
  return res.json()
}
