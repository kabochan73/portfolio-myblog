import { cacheLife, cacheTag } from 'next/cache'
import type { Post, Tag } from '@/types'

const API_URL = process.env.API_URL

// 記事一覧取得（タグフィルタ・検索対応）
export async function getPosts(tagSlug?: string, search?: string): Promise<Post[]> {
  'use cache'
  cacheLife('days')
  cacheTag('posts')

  const params = new URLSearchParams()
  if (tagSlug) params.set('tag', tagSlug)
  if (search) params.set('search', search)
  const query = params.toString()

  const res = await fetch(`${API_URL}/posts${query ? `?${query}` : ''}`)
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
