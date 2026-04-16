import Link from 'next/link'
import { getPosts, getTags } from '@/lib/api'
import { notFound } from 'next/navigation'

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [posts, tags] = await Promise.all([getPosts(slug), getTags()])

  const currentTag = tags.find((tag) => tag.slug === slug)
  if (!currentTag) notFound()

  return (
    <div className="space-y-10">
      {/* タグ一覧 */}
      <section>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="rounded-full border px-3 py-1 text-sm text-white transition-opacity hover:opacity-80"
              style={{
                backgroundColor: tag.color,
                borderColor: tag.color,
                opacity: tag.slug === slug ? 1 : 0.5,
              }}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 絞り込み中のタグ */}
      <section>
        <h1 className="text-lg font-semibold text-gray-900">
          # {currentTag.name}
        </h1>
      </section>

      {/* 記事一覧 */}
      <section>
        {posts.length === 0 ? (
          <p className="text-gray-500">このタグの記事はまだありません。</p>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => (
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

      {/* 戻るリンク */}
      <div>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← すべての記事を見る
        </Link>
      </div>
    </div>
  )
}
