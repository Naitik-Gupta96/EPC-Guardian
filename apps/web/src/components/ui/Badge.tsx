import type { ReactNode } from 'react'

type Severity = 'critical' | 'major' | 'minor' | 'observation' | 'compliant'

interface Props {
  variant?: Severity | 'default' | 'info' | 'success' | 'warning' | 'error'
  children: ReactNode
  className?: string
  dot?: boolean
}

const colors: Record<string, string> = {
  critical: 'bg-severity-critical/10 text-severity-critical border-severity-critical/30',
  major: 'bg-severity-major/10 text-severity-major border-severity-major/30',
  minor: 'bg-severity-minor/10 text-severity-minor border-severity-minor/30',
  observation: 'bg-severity-observation/10 text-severity-observation border-severity-observation/30',
  compliant: 'bg-severity-compliant/10 text-severity-compliant border-severity-compliant/30',
  default: 'bg-tertiary text-text-secondary border-gray-700',
  info: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
  success: 'bg-accent-green/10 text-accent-green border-accent-green/30',
  warning: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
  error: 'bg-accent-red/10 text-accent-red border-accent-red/30',
}

const dotColors: Record<string, string> = {
  critical: 'bg-severity-critical',
  major: 'bg-severity-major',
  minor: 'bg-severity-minor',
  observation: 'bg-severity-observation',
  compliant: 'bg-severity-compliant',
}

export function Badge({ variant = 'default', children, className = '', dot }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-md border ${colors[variant]} ${className}`}
    >
      {dot && variant in dotColors && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  )
}
