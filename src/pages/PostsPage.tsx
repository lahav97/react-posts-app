import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/posts/PostCard'
import SearchBar from '../components/posts/SearchBar'
import Spinner from '../components/ui/Spinner'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'

export default function PostsPage() {
  const [search, setSearch] = useState('')
  const { data: posts, isLoading, isError, error, refetch } = usePosts()

  const filteredPosts = useMemo(() => {
    if (!posts) return []
    const term = search.trim().toLowerCase()
    if (!term) return posts
    return posts.filter((post) => post.title.toLowerCase().includes(term))
  }, [posts, search])

  if (isLoading) {
    return <Spinner label="Loading posts" />
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Posts</h1>
        <Link
          to="/new"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Add post
        </Link>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {filteredPosts.length === 0 ? (
        <EmptyState
          title={search ? 'No posts match your search' : 'No posts yet'}
          description={search ? 'Try a different title.' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}