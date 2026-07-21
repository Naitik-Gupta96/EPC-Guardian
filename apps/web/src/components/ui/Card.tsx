import type { ReactNode, HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  children: ReactNode
}

export function Card({ hover, children, className = '', ...props }: Props) {
  return (
    <div
      className={`bg-secondary border border-gray-800/60 rounded-lg shadow-card p-5
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-sm font-semibold text-text-primary ${className}`}>{children}</h3>
}
