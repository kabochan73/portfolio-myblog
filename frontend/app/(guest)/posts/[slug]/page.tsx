import Link from 'next/link'
import { Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPost } from '@/lib/api'
import { notFound } from 'next/navigation'

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post
  try {
    post = await getPost(slug)
  } catch {
    notFound()
  }

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <div className="flex items-center gap-4">
          <time className="text-sm text-gray-400">
            {new Date(post.published_at!).toLocaleDateString('ja-JP')}
          </time>
          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full px-2 py-0.5 text-xs text-white hover:opacity-80"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <hr className="border-gray-200" />

      <div className="prose prose-gray max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.body}
        </ReactMarkdown>
      </div>

      <div className="pt-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← 一覧に戻る
        </Link>
      </div>
    </article>
  )
}

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <Suspense>
      <PostContent params={params} />
    </Suspense>
  )
}
