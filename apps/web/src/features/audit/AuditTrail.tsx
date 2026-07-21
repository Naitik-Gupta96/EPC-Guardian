import { useEffect } from 'react'
import { useStore } from '../../state/store'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'

export function AuditTrail() {
  const { auditEvents, fetchAudit } = useStore()

  useEffect(() => { fetchAudit() }, [])

  if (auditEvents.length === 0) {
    return (
      <div className="max-w-7xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-text-primary">Audit Trail</h1>
          <p className="text-sm text-text-muted">Immutable event log</p>
        </div>
        <Card>
          <EmptyState title="No audit events" description="Audit events will appear as actions are performed." />
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Audit Trail</h1>
          <p className="text-sm text-text-muted">{auditEvents.length} events recorded</p>
        </div>
      </div>

      <Card>
        <div className="space-y-1">
          {auditEvents.map((event, i) => (
            <div key={i} className="flex items-start gap-4 px-3 py-3 rounded-md hover:bg-tertiary/50 transition-colors">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-accent-blue flex-shrink-0" />
                {i < auditEvents.length - 1 && <div className="w-px flex-1 bg-gray-800 my-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">{event.timestamp?.split('T')[1]?.split('.')[0] || event.timestamp}</span>
                  <Badge variant="default">{event.actor}</Badge>
                  <span className="text-xs text-text-secondary">{event.action}</span>
                </div>
                <div className="text-xs font-mono text-text-muted mt-0.5">{event.object_id}</div>
                {event.details && Object.keys(event.details).length > 0 && (
                  <pre className="text-[10px] text-text-muted mt-1">{JSON.stringify(event.details, null, 1)}</pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
