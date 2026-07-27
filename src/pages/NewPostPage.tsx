import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useCreatePost } from '../hooks/useCreatePost'

const MIN_TITLE_LENGTH = 3
const MIN_BODY_LENGTH = 10

export default function NewPostPage() {
  const navigate = useNavigate()
  const createPost = useCreatePost()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [bodyError, setBodyError] = useState<string | null>(null)

  function validate(): boolean {
    let valid = true

    if (title.trim().length < MIN_TITLE_LENGTH) {
      setTitleError(`Title must be at least ${MIN_TITLE_LENGTH} characters.`)
      valid = false
    } else {
      setTitleError(null)
    }

    if (body.trim().length < MIN_BODY_LENGTH) {
      setBodyError(`Body must be at least ${MIN_BODY_LENGTH} characters.`)
      valid = false
    } else {
      setBodyError(null)
    }

    return valid
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!validate()) return

    createPost.mutate(
      { title: title.trim(), body: body.trim() },
      {
        onSuccess: () => {
          navigate('/', { state: { postCreated: true } })
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline">
        <ArrowLeft size={14} />
        Back to posts
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-5 text-xl font-bold text-slate-900">Add post</h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {titleError && <p className="mt-1 text-sm text-red-600">{titleError}</p>}
          </div>

          <div>
            <label htmlFor="body" className="mb-1 block text-sm font-medium text-slate-700">
              Body
            </label>
            <textarea
              id="body"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {bodyError && <p className="mt-1 text-sm text-red-600">{bodyError}</p>}
          </div>

          {createPost.isError && (
            <p className="text-sm text-red-600">{createPost.error.message}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createPost.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createPost.isPending ? (
                'Creating…'
              ) : (
                <>
                  <Sparkles size={16} />
                  Create post
                </>
              )}
            </button>
            <Link
              to="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}