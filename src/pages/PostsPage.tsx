import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/posts/PostCard'
import SearchBar from '../components/posts/SearchBar'
import Spinner from '../components/ui/Spinner'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'

export default function PostsPage() {
  const [search, setSearch] = useState('')
  const { data: posts, isLoading, isError, error, refetch } = usePosts()

  const location = useLocation()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(Boolean(location.state?.postCreated))

  useEffect(() => {
    if (!showToast) return
    navigate(location.pathname, { replace: true, state: null })
    const timer = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      {showToast && (
        <div
          role="status"
          className="animate-[fadeIn_0.3s_ease-in-out] rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Post created.
        </div>
      )}

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Posts</h1>
        <Link
          to="/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add post
        </Link>
      </div>

      <div className="space-y-2">
        <SearchBar value={search} onChange={setSearch} />
        <p className="text-sm text-slate-500" aria-live="polite">
          {search
            ? `Showing ${filteredPosts.length} of ${posts?.length ?? 0}`
            : `Showing all ${posts?.length ?? 0} posts`}
        </p>
      </div>

      {filteredPosts.length === 0 ? (
        <EmptyState
          title={search ? 'No posts match your search' : 'No posts yet'}
          description={search ? 'Try a different title.' : undefined}
        />
      ) : (
        <div className="grid animate-[fadeIn_0.3s_ease-in-out] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}