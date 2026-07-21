import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../../state/store'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

const stageOrder = ['requirement', 'equipment', 'purchase_order', 'milestone', 'activity', 'test']
const stageLabels: Record<string, string> = {
  requirement: 'Requirements',
  equipment: 'Equipment',
  purchase_order: 'Procurement',
  milestone: 'Milestones',
  activity: 'Activities',
  test: 'Tests',
}

const typeColors: Record<string, string> = {
  requirement: 'border-accent-blue bg-accent-blue/10',
  equipment: 'border-accent-purple bg-accent-purple/10',
  purchase_order: 'border-accent-cyan bg-accent-cyan/10',
  milestone: 'border-accent-amber bg-accent-amber/10',
  activity: 'border-accent-orange bg-accent-orange/10',
  test: 'border-accent-red bg-accent-red/10',
}

export function ImpactGraph() {
  const { deviationId } = useParams<{ deviationId: string }>()
  const { graphData, setSelectedDeviation } = useStore()
  useEffect(() => {
    if (deviationId) setSelectedDeviation(deviationId)
    return () => { setSelectedDeviation(null) }
  }, [deviationId])

  if (!graphData) return <Skeleton className="h-[600px] rounded-lg" />

  const stages = stageOrder.map((type) => ({
    type,
    label: stageLabels[type],
    nodes: graphData.nodes.filter((n) => n.type === type),
  }))

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/deviations/${deviationId}`} className="text-text-muted hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Impact Graph</h1>
            <p className="text-sm text-text-muted font-mono">{graphData.deviation_id}</p>
          </div>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(stageLabels).map(([type, label]) => (
            <Badge key={type} variant="default">
              <span className={`w-2 h-2 rounded-full mr-1.5 ${typeColors[type]?.split(' ')[0]?.replace('border-', 'bg-') || 'bg-gray-500'}`} />
              {label}
            </Badge>
          ))}
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-8 min-w-[900px]">
            {stages.map((stage) => (
              <div key={stage.type} className="flex-1 min-w-[120px]">
                <div className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3 text-center">
                  {stage.label}
                  <span className="ml-1 text-text-muted/50">({stage.nodes.length})</span>
                </div>
                <div className="space-y-2">
                  {stage.nodes.map((node) => (
                    <div
                      key={node.id}
                      className={`p-3 rounded-lg border text-center transition-all
                        ${typeColors[node.type] || 'border-gray-700 bg-tertiary'}
                        ${node.status === 'affected' ? 'shadow-glow-red' : ''}`}
                    >
                      <div className="text-[10px] font-mono text-text-muted truncate">{node.id}</div>
                      <div className="text-xs font-medium text-text-primary mt-0.5 truncate">{node.label}</div>
                      {node.status === 'affected' && (
                        <Badge variant="critical" className="mt-1.5">AFFECTED</Badge>
                      )}
                    </div>
                  ))}
                  {stage.nodes.length === 0 && (
                    <div className="text-center py-6 text-[10px] text-text-muted/40">No nodes</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {graphData.summary && (
          <div className="mt-4 p-3 rounded-lg bg-primary/50 text-sm text-text-secondary">
            {graphData.summary}
          </div>
        )}
      </Card>
    </div>
  )
}
