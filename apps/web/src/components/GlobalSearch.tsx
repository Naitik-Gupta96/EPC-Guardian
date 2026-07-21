import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const deviations = useStore((s) => s.deviations)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const lower = query.toLowerCase()
  const results = query
    ? deviations.filter(
        (d) =>
          d.id.toLowerCase().includes(lower) ||
          d.requirement_id.toLowerCase().includes(lower) ||
          d.severity.toLowerCase().includes(lower) ||
          (d.calculation && d.calculation.toLowerCase().includes(lower)),
      )
    : []

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary border border-gray-700 rounded-xl shadow-elevated w-full max-w-lg overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
          <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deviations, requirements, documents..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-tertiary text-text-muted">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-text-muted">
              No results for "{query}"
            </div>
          )}
          {results.map((d) => (
            <button
              key={d.id}
              onClick={() => { navigate(`/deviations/${d.id}`); onClose() }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-tertiary transition-colors text-left cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                d.severity === 'critical' ? 'bg-accent-red' :
                d.severity === 'major' ? 'bg-accent-orange' :
                d.severity === 'minor' ? 'bg-accent-amber' : 'bg-accent-blue'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-text-primary truncate">{d.id}</div>
                <div className="text-xs text-text-muted truncate">{d.calculation}</div>
              </div>
              <span className="text-[10px] font-medium uppercase text-text-muted">{d.severity}</span>
            </button>
          ))}
          {!query && (
            <div className="px-4 py-8 text-center text-sm text-text-muted">
              Type to search across {deviations.length} deviations and project documents
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
