export type Tag = {
  id: number
  name: string
  slug: string
  color: string
  created_at: string
  updated_at: string
}

export type Post = {
  id: number
  title: string
  body: string
  slug: string
  published_at: string | null
  created_at: string
  updated_at: string
  tags: Tag[]
}
