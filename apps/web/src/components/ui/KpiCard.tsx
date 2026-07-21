import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: { value: string; positive: boolean }
  color?: string
  onClick?: () => void
}

export function KpiCard({ label, value, icon, trend, color = 'text-accent-blue', onClick }: Props) {
  return (
    <div
      className={`bg-secondary border border-gray-800/60 rounded-lg shadow-card p-5
        ${onClick ? 'card-hover cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>
      <div className={`text-3xl font-bold font-mono ${color}`}>{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend.positive ? 'text-accent-green' : 'text-accent-red'}`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            {trend.positive
              ? <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
              : <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
            }
          </svg>
          {trend.value}
        </div>
      )}
    </div>
  )
}
