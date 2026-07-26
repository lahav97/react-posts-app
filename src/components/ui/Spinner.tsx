interface SpinnerProps {
  label?: string
}

export default function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div role="status" className="flex justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
      <span className="sr-only">{label}</span>
    </div>
  )
}