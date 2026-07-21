import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../state/store'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { FilterBar } from './FilterBar'

export function ComplianceFeed() {
  const navigate = useNavigate()
  const { deviations, deviationsLoading, fetchDeviations } = useStore()

  useEffect(() => { fetchDeviations() }, [])

  const columns: Column<any>[] = [
    { key: 'id', label: 'ID', sortable: true, render: (r) => <span className="font-mono text-xs">{r.id}</span>, width: '140px' },
    { key: 'severity', label: 'Severity', sortable: true, render: (r) => <Badge variant={r.severity} dot>{r.severity}</Badge> },
    { key: 'delta', label: 'Delta', sortable: true, render: (r) => (
      <span className={`font-mono text-sm ${r.delta < 0 ? 'text-accent-red' : 'text-accent-green'}`}>
        {r.delta > 0 ? '+' : ''}{r.delta} {r.normalized_unit}
      </span>
    )},
    { key: 'requirement_id', label: 'Requirement', render: (r) => <span className="font-mono text-xs text-text-secondary">{r.requirement_id}</span> },
    { key: 'submittal_id', label: 'Submittal', render: (r) => <span className="font-mono text-xs text-text-secondary">{r.submittal_id}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (r) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        r.status === 'open' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-accent-green/10 text-accent-green'
      }`}>{r.status}</span>
    )},
    { key: 'confidence', label: 'Conf', sortable: true, render: (r) => (
      <span className="font-mono text-xs text-text-muted">{(r.confidence * 100).toFixed(0)}%</span>
    )},
    { key: 'actions', label: '', render: (r) => (
      <Button
        variant="ghost" size="sm"
        onClick={(e) => { e.stopPropagation(); navigate(`/deviations/${r.id}`) }}
      >
        View
      </Button>
    )},
  ]

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Compliance Feed</h1>
          <p className="text-sm text-text-muted">{deviations.length} deviations detected</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchDeviations}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </Button>
          <Button size="sm">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export
          </Button>
        </div>
      </div>

      <Card>
        <FilterBar />
        <DataTable
          columns={columns}
          data={deviations}
          loading={deviationsLoading}
          onRowClick={(r) => navigate(`/deviations/${r.id}`)}
          emptyMessage="No deviations match your filters"
        />
      </Card>
    </div>
  )
}
