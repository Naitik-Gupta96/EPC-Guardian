import { useState } from 'react'
import { Skeleton } from './Skeleton'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render: (row: T) => React.ReactNode
  width?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[] | null
  loading?: boolean
  onRowClick?: (row: T) => void
  emptyMessage?: string
  pageSize?: number
}

export function DataTable<T extends { id?: string }>({
  columns, data, loading, onRowClick, emptyMessage = 'No data', pageSize = 20,
}: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = data
    ? [...data].sort((a, b) => {
        if (!sortKey) return 0
        const aVal = (a as any)[sortKey]
        const bVal = (b as any)[sortKey]
        if (aVal == null) return 1
        if (bVal == null) return -1
        const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal))
        return sortDir === 'asc' ? cmp : -cmp
      })
    : []

  const display = sorted.slice(0, pageSize)

  if (loading) return <Skeleton className="h-64 w-full rounded-lg" />

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-text-muted">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-3
                  ${col.sortable ? 'cursor-pointer hover:text-text-secondary select-none' : ''}
                  ${col.width ? `w-[${col.width}]` : ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <svg className={`w-3 h-3 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {display.map((row) => (
            <tr
              key={row.id}
              className={`border-b border-gray-800/50 transition-colors duration-100
                ${onRowClick ? 'cursor-pointer hover:bg-tertiary' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-3 text-text-primary">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
