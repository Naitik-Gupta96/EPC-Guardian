import { useEffect, useState } from 'react'

export interface ToastData {
  id: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  action?: { label: string; onClick: () => void }
}

let toastListeners: ((t: ToastData) => void)[] = []

export function toast(t: ToastData) {
  toastListeners.forEach((fn) => fn(t))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<(ToastData & { removing?: boolean })[]>([])

  useEffect(() => {
    const handler = (t: ToastData) => {
      const id = t.id || Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { ...t, id }])
      setTimeout(() => {
        setToasts((prev) => prev.map((x) => x.id === id ? { ...x, removing: true } : x))
        setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 300)
      }, 5000)
    }
    toastListeners.push(handler)
    return () => { toastListeners = toastListeners.filter((fn) => fn !== handler) }
  }, [])

  const typeStyles: Record<string, string> = {
    success: 'border-accent-green/30',
    error: 'border-accent-red/30',
    warning: 'border-accent-amber/30',
    info: 'border-accent-blue/30',
  }

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-secondary border ${typeStyles[t.type || 'info']} rounded-lg shadow-elevated px-4 py-3
            flex items-start gap-3 transition-all duration-300
            ${t.removing ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
        >
          <p className="text-sm text-text-primary flex-1">{t.message}</p>
          {t.action && (
            <button onClick={t.action.onClick} className="text-xs font-medium text-accent-blue hover:underline whitespace-nowrap">
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
