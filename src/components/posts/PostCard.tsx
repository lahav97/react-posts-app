import { Link } from 'react-router-dom'
import type { Post } from '../../types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {post.isLocal && (
        <span className="mb-2 inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          Your post
        </span>
      )}
      <h3 className="mb-1.5 font-medium text-slate-900">{post.title}</h3>
      <p className="line-clamp-2 text-sm text-slate-600">{post.body}</p>
    </Link>
  )
}