import { NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../state/store'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { to: '/deviations', label: 'Compliance Feed', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { to: '/graph', label: 'Impact Graph', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
      { to: '/simulator', label: 'Simulator', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { to: '/workflow', label: 'Workflow', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/benchmark', label: 'Benchmark', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ],
  },
  {
    label: 'Records',
    items: [
      { to: '/documents', label: 'Documents', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
      { to: '/audit', label: 'Audit Trail', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
  },
]

export function Sidebar() {
  const { sidebarOpen, deviations } = useStore()
  const location = useLocation()
  const openCount = deviations.filter((d) => d.status === 'open').length

  return (
    <aside
      className={`bg-secondary border-r border-gray-800 flex flex-col transition-all duration-300
        ${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden lg:w-16'} hidden lg:flex`}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Project</div>
        <div className="text-sm font-medium text-text-primary truncate">DC-TIER3-DEMO-001</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {sidebarOpen && <div className="px-3 mb-1 text-[10px] font-semibold text-text-muted uppercase tracking-widest">{group.label}</div>}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to
                const showBadge = item.to === '/deviations' && openCount > 0
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 group
                      ${isActive
                        ? 'bg-tertiary text-accent-blue'
                        : 'text-text-secondary hover:text-text-primary hover:bg-tertiary/50'
                      }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {sidebarOpen && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {showBadge && (
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-accent-red/20 text-accent-red">
                            {openCount}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          Connected
          <span className="ml-auto">v0.1</span>
        </div>
      </div>
    </aside>
  )
}
