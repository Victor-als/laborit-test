import { AlertTriangle, X } from 'lucide-react'

interface ErrorBannerProps {
  message: string
  onDismiss: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="mx-4 mb-2 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-900/30 border border-red-500/20 animate-fade-up">
      <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
      <p className="flex-1 text-xs font-body text-red-300 leading-relaxed">{message}</p>
      <button onClick={onDismiss} className="text-red-400/60 hover:text-red-300 transition-colors">
        <X size={13} />
      </button>
    </div>
  )
}
