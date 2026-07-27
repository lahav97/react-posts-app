import { Link } from 'react-router-dom'
import type { Post } from '../../types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      to={`/posts/${post.id}`}
      // Local (user-created) posts get a solid indigo left border; server posts get a
      // muted one that only picks up color on hover.
      className={`group flex h-full flex-col rounded-xl border-l-4 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        post.isLocal
          ? 'border-l-indigo-500 border-y border-r border-y-slate-200 border-r-slate-200'
          : 'border-l-slate-300 border-y border-r border-y-slate-200 border-r-slate-200 hover:border-l-indigo-300'
      }`}
    >
      {post.isLocal && (
        <span className="mb-2 inline-block w-fit rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
          Your post
        </span>
      )}
      <h3 className="mb-2 line-clamp-2 font-semibold text-slate-900 group-hover:text-indigo-700">
        {post.title}
      </h3>
      <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{post.body}</p>
    </Link>
  )
}