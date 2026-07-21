import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../state/store'
import { KpiCard } from '../../components/ui/KpiCard'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

export function Dashboard() {
  const { deviations, deviationsLoading, fetchDeviations } = useStore()

  useEffect(() => { fetchDeviations() }, [])

  const critical = deviations.filter((d) => d.severity === 'critical')
  const open = deviations.filter((d) => d.status === 'open')
  const major = deviations.filter((d) => d.severity === 'major')

  if (deviationsLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted">Project health overview</p>
        </div>
        <Link to="/deviations" className="text-sm text-accent-blue hover:underline">View all deviations →</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Open Deviations" value={open.length} color="text-accent-amber" />
        <KpiCard label="Critical" value={critical.length} color="text-accent-red" />
        <KpiCard label="Major" value={major.length} color="text-accent-orange" />
        <KpiCard label="Schedule Impact" value="−5d" color="text-accent-red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Deviations</CardTitle>
          </CardHeader>
          <div className="space-y-1">
            {deviations.slice(0, 5).map((d) => (
              <Link
                key={d.id}
                to={`/deviations/${d.id}`}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-tertiary transition-colors group"
              >
                <Badge variant={d.severity as any} dot>{d.severity}</Badge>
                <span className="text-sm font-mono text-text-primary flex-1">{d.id}</span>
                <span className="text-xs text-text-muted font-mono">{d.delta}{d.normalized_unit}</span>
              </Link>
            ))}
            {deviations.length === 0 && <p className="text-sm text-text-muted py-4 text-center">No deviations detected</p>}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { label: 'Integrated System Testing', date: 'Aug 15', delta: '12d' },
              { label: 'Site Acceptance Testing', date: 'Aug 20', delta: '17d' },
              { label: 'Project Handover', date: 'Sep 1', delta: '29d' },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-tertiary/50 transition-colors">
                <div>
                  <div className="text-sm text-text-primary">{m.label}</div>
                  <div className="text-xs text-text-muted">{m.date}</div>
                </div>
                <span className="text-xs font-mono text-text-secondary">{m.delta}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {deviations.slice(0, 4).map((d) => (
            <div key={d.id} className="flex items-start gap-3 px-3 py-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 flex-shrink-0" />
              <div>
                <span className="text-text-primary">
                  Deviation <Link to={`/deviations/${d.id}`} className="text-accent-blue hover:underline font-mono">{d.id}</Link> generated
                </span>
                <span className="text-text-muted ml-2">— delta {d.delta}{d.normalized_unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
