import Link from 'next/link'
import { getPosts, getTags } from '@/lib/api'

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()])

  return (
    <div className="space-y-10">
      {/* タグ一覧 */}
      {tags.length > 0 && (
        <section>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:border-gray-900 hover:text-gray-900"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 記事一覧 */}
      <section>
        {posts.length === 0 ? (
          <p className="text-gray-500">まだ記事がありません。</p>
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
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
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
