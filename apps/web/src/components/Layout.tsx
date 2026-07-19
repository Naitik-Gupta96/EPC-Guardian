import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/deviations', label: 'Compliance Feed' },
  { to: '/benchmark', label: 'Benchmark' },
  { to: '/documents', label: 'Documents' },
  { to: '/audit', label: 'Audit' },
]

export function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-ink text-paper font-sans">
      <header className="border-b border-paper/10 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-amber font-mono font-bold text-lg tracking-tight">
          EPC GUARDIAN
        </Link>
        <nav className="flex gap-6 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`transition-colors ${
                location.pathname.startsWith(item.to)
                  ? 'text-amber'
                  : 'text-paper/60 hover:text-paper'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="text-xs font-mono text-paper/30">seeded mode</span>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
