import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../state/store'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'

export function DeviationDetail() {
  const { deviationId } = useParams<{ deviationId: string }>()
  const navigate = useNavigate()
  const { selectedDeviation, graphData, setSelectedDeviation, generateWorkflow, workflowResult, workflowLoading } = useStore()

  useEffect(() => {
    if (deviationId) setSelectedDeviation(deviationId)
    return () => { setSelectedDeviation(null) }
  }, [deviationId])

  if (!selectedDeviation) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-96" />
      <div className="grid grid-cols-3 gap-4"><Skeleton className="h-32 col-span-1" /><Skeleton className="h-32 col-span-1" /><Skeleton className="h-32 col-span-1" /></div>
    </div>
  )

  const d = selectedDeviation
  const isCritical = d.severity === 'critical'

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/deviations" className="text-text-muted hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-text-primary font-mono">{d.id}</h1>
            <p className="text-sm text-text-muted">Deviation Detail</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/simulator/${d.id}`)}>Simulate</Button>
          <Button size="sm" loading={workflowLoading} onClick={() => generateWorkflow(d.id)}>Generate Workflow</Button>
        </div>
      </div>

      <div className={`rounded-lg border p-5 ${isCritical ? 'border-severity-critical/40 bg-severity-critical/5' : 'border-severity-major/30 bg-severity-major/5'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Badge variant={d.severity as any} dot>{d.severity.toUpperCase()}</Badge>
          <span className="text-sm text-text-muted">Confidence: {(d.confidence * 100).toFixed(0)}%</span>
        </div>
        <p className="text-sm text-text-primary font-mono bg-primary/50 rounded px-3 py-2">{d.calculation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Requirement</div>
          <div className="text-xs text-text-muted mb-1 font-mono">{d.requirement_id}</div>
          <div className="text-2xl font-bold font-mono text-accent-blue">{d.required_value_normalized}</div>
          <div className="text-sm text-text-secondary">{d.normalized_unit} ({d.operator})</div>
        </Card>
        <Card>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Submitted</div>
          <div className="text-xs text-text-muted mb-1 font-mono">{d.submittal_id}</div>
          <div className="text-2xl font-bold font-mono text-accent-amber">{d.submitted_value_normalized}</div>
          <div className="text-sm text-text-secondary">{d.normalized_unit}</div>
        </Card>
        <Card>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Delta</div>
          <div className={`text-2xl font-bold font-mono ${d.delta < 0 ? 'text-accent-red' : 'text-accent-green'}`}>
            {d.delta > 0 ? '+' : ''}{d.delta}
          </div>
          <div className="text-sm text-text-secondary">{d.normalized_unit}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Downstream Impact</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Equipment', count: graphData?.nodes.filter((n) => n.type === 'equipment').length || 0, color: 'text-accent-purple' },
              { label: 'Purchase Orders', count: graphData?.nodes.filter((n) => n.type === 'purchase_order').length || 0, color: 'text-accent-cyan' },
              { label: 'Activities', count: d.affected_activity_ids.length, color: 'text-accent-orange' },
              { label: 'Tests', count: d.affected_test_ids.length, color: 'text-accent-red' },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-lg bg-primary/50">
                <div className={`text-2xl font-bold font-mono ${item.color}`}>{item.count}</div>
                <div className="text-xs text-text-muted mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          {graphData && (
            <div className="mt-4">
              <Link to={`/graph/${d.id}`} className="text-sm text-accent-blue hover:underline">View full impact graph →</Link>
            </div>
          )}
        </Card>

        {workflowResult && (
          <Card>
            <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Generated Documents</div>
            <div className="space-y-2">
              {[
                { kind: 'RFI', data: workflowResult.rfi },
                { kind: 'NCR', data: workflowResult.ncr },
                { kind: 'Risk Register', data: workflowResult.risk_entry },
              ].map((doc) => (
                <div key={doc.kind} className="flex items-center justify-between p-3 rounded-lg bg-primary/50">
                  <span className="text-sm font-medium text-text-primary">{doc.kind}</span>
                  <span className="text-xs text-text-muted font-mono">{doc.data?.id}</span>
                </div>
              ))}
              <Button size="sm" className="w-full mt-2" onClick={() => navigate(`/workflow/${d.id}`)}>
                Go to Workflow →
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
