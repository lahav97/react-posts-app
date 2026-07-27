import type { Comment } from '../../types'

interface CommentItemProps {
  comment: Comment
}

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-800',
  'bg-teal-100 text-teal-800',
  'bg-rose-100 text-rose-800',
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-800',
]

// Deterministic hash so each commenter's avatar color stays consistent across renders.
function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <div className="mb-2 flex items-center gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${colorForName(comment.name)}`}
        >
          {comment.name.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{comment.name}</p>
          <p className="truncate text-xs text-slate-400">{comment.email}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600">{comment.body}</p>
    </div>
  )
}