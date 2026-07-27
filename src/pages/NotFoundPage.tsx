import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
        Back to posts
      </Link>
    </div>
  )
}