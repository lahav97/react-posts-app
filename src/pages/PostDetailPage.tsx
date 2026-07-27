import { useParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { usePost } from '../hooks/usePost'
import { useComments } from '../hooks/useComments'
import { getLocalPosts } from '../hooks/useCreatePost'
import { queryKeys } from '../lib/queryKeys'
import CommentItem from '../components/comments/CommentItem'
import Spinner from '../components/ui/Spinner'
import ErrorState from '../components/ui/ErrorState'
import EmptyState from '../components/ui/EmptyState'
import type { Post } from '../types'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const postId = Number(id)
  const queryClient = useQueryClient()

  const isValidId = Number.isInteger(postId) && postId !== 0

  // Skip the network request if the post is already in the query cache or was created locally.
  const memoryPosts = queryClient.getQueryData<Post[]>(queryKeys.posts.all)
  const localPosts = getLocalPosts()
  const cachedPost =
    memoryPosts?.find((p) => p.id === postId) ?? localPosts.find((p) => p.id === postId)

  // Passing NaN disables the query (see usePost/useComments) when we already have the data.
  const postQuery = usePost(isValidId && !cachedPost && postId > 0 ? postId : NaN)
  const commentsQuery = useComments(postId > 0 ? postId : NaN)

  if (!isValidId) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Post not found</h1>
        <p className="mt-2 text-slate-600">That doesn't look like a valid post.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          Back to posts
        </Link>
      </div>
    )
  }

  if (!cachedPost && postQuery.isLoading) {
    return <Spinner label="Loading post" />
  }

  if (!cachedPost && postQuery.isError) {
    return <ErrorState message={postQuery.error.message} onRetry={() => postQuery.refetch()} />
  }

  const post = cachedPost ?? postQuery.data

  if (!post) {
    return <ErrorState message="This post could not be found." />
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
        <ArrowLeft size={14} />
        Back to posts
      </Link>

      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
            U{post.userId}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">User {post.userId}</p>
            {post.isLocal && (
              <span className="inline-block rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                Your post
              </span>
            )}
          </div>
        </div>
        <h1 className="mb-3 text-xl font-bold text-slate-900">{post.title}</h1>
        <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{post.body}</p>
      </article>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-slate-500">
          Comments {commentsQuery.data ? `(${commentsQuery.data.length})` : ''}
        </h2>

        {post.isLocal ? (
          <EmptyState title="No comments yet" description="This post has no comments." />
        ) : (
          <>
            {commentsQuery.isLoading && <Spinner label="Loading comments" />}

            {commentsQuery.isError && (
              <ErrorState
                message={commentsQuery.error.message}
                onRetry={() => commentsQuery.refetch()}
              />
            )}

            {commentsQuery.data && commentsQuery.data.length === 0 && (
              <EmptyState title="No comments yet" description="This post has no comments." />
            )}

            {commentsQuery.data && commentsQuery.data.length > 0 && (
              <div>
                {commentsQuery.data.map((comment, index) => (
                  <div
                    key={comment.id}
                    style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
                    className="animate-[fadeInUp_0.3s_ease-in-out]"
                  >
                    <CommentItem comment={comment} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}