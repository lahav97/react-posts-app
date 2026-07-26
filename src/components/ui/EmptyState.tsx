interface EmptyStateProps {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
    </div>
  )
}