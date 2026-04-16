import { getPosts, getTags } from '@/lib/api'
import PostListWithSearch from '@/components/PostListWithSearch'

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()])

  return <PostListWithSearch posts={posts} tags={tags} />
}
