import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'

interface Props {
  deviationId: string
}

const typeColors: Record<string, string> = {
  requirement: 'border-amber text-amber',
  submittal: 'border-blue-400 text-blue-400',
  equipment: 'border-teal text-teal',
  purchase_order: 'border-purple-400 text-purple-400',
  milestone: 'border-paper/50 text-paper/50',
  activity: 'border-paper/70 text-paper/70',
  test: 'border-red-400 text-red-400',
}

const statusIcons: Record<string, string> = {
  violated: '✗',
  reviewed: '●',
  affected: '!',
  delayed: '◷',
  at_risk: '⚠',
}

export function ImpactGraph({ deviationId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['impact-graph', deviationId],
    queryFn: () => api.getImpactGraph(deviationId),
  })

  if (isLoading) return <div className="font-mono text-paper/50">Loading graph...</div>
  if (!data) return <div className="font-mono text-paper/50">No graph data</div>

  const stages = [
    { label: 'Requirement', nodes: data.nodes.filter((n: any) => n.type === 'requirement' || n.type === 'submittal') },
    { label: 'Equipment', nodes: data.nodes.filter((n: any) => n.type === 'equipment') },
    { label: 'Procurement', nodes: data.nodes.filter((n: any) => n.type === 'purchase_order') },
    { label: 'Milestone', nodes: data.nodes.filter((n: any) => n.type === 'milestone') },
    { label: 'Activity', nodes: data.nodes.filter((n: any) => n.type === 'activity') },
    { label: 'Test', nodes: data.nodes.filter((n: any) => n.type === 'test') },
  ].filter((s) => s.nodes.length > 0)

  return (
    <div className="border border-paper/10 rounded-lg p-6 bg-paper/5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono text-sm text-paper/70">Requirement → Commissioning</h2>
        {data.summary && (
          <div className="text-xs font-mono text-paper/40">
            {data.summary.equipment_count} equipment &middot; {data.summary.purchase_order_count} PO &middot;{' '}
            {data.summary.affected_activity_count} activities &middot; {data.summary.affected_test_count} tests
          </div>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.label} className="flex-shrink-0 w-48">
            <div className="text-xs font-mono text-paper/30 uppercase mb-2 text-center">{stage.label}</div>
            <div className="space-y-2">
              {stage.nodes.map((node: any) => (
                <div
                  key={node.id}
                  className={`p-3 rounded border bg-ink/50 text-xs font-mono ${typeColors[node.type] || 'border-paper/20 text-paper/60'}`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-paper/40">{statusIcons[node.status] || '•'}</span>
                    <span className="truncate">{node.label}</span>
                  </div>
                  <div className="text-[10px] text-paper/30 truncate">{node.id}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
