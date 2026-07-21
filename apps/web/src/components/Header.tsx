import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../state/store'
import { Badge } from './ui/Badge'
import { GlobalSearch } from './GlobalSearch'

export function Header() {
  const { toggleSidebar, addToast, project } = useStore()
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header className="h-14 bg-primary border-b border-gray-800 flex items-center justify-between px-4 shrink-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-tertiary text-text-muted hover:text-text-primary transition-colors cursor-pointer lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-accent-blue flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            </div>
            <span className="text-sm font-semibold text-text-primary tracking-tight">EPC Guardian</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-gray-700 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Search deviations...
            <kbd className="px-1 py-0.5 rounded bg-tertiary text-[10px] font-mono text-text-muted">⌘K</kbd>
          </button>

          <Badge variant={project?.status === 'seeded' ? 'default' : 'success'} dot>
            {project?.status || 'seeded'}
          </Badge>

          <button
            onClick={() => addToast({ message: 'Profile menu (mock)', type: 'info' })}
            className="w-7 h-7 rounded-full bg-accent-purple/20 flex items-center justify-center text-xs font-semibold text-accent-purple cursor-pointer hover:bg-accent-purple/30 transition-colors"
          >
            EG
          </button>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
