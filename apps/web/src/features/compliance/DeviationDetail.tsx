import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../../api/client'
import { ImpactGraph } from '../impact-graph/ImpactGraph'
import { Simulator } from '../simulator/Simulator'
import { WorkflowPanel } from '../workflow/WorkflowPanel'

export function DeviationDetail() {
  const { deviationId } = useParams<{ deviationId: string }>()
  const [activeTab, setActiveTab] = useState<'graph' | 'simulate' | 'workflow'>('graph')

  const { data: dev, isLoading: devLoading } = useQuery({
    queryKey: ['deviation', deviationId],
    queryFn: () => api.getDeviation(deviationId!),
    enabled: !!deviationId,
  })

  if (devLoading || !dev) {
    return <div className="font-mono text-paper/50">Loading deviation...</div>
  }

  const severityColor = dev.severity === 'critical' ? 'text-red-400' : dev.severity === 'major' ? 'text-amber' : 'text-teal'

  return (
    <div className="space-y-6">
      <div className="border border-paper/10 rounded-lg p-6 bg-paper/5">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-mono">{dev.id}</h1>
          <span className={`px-2 py-0.5 rounded text-xs font-mono border ${severityColor}`}>
            {dev.severity.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-paper/30 px-2 py-0.5 border border-paper/20 rounded">
            {dev.decision_path}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6 font-mono text-sm">
          <div className="space-y-2">
            <div className="text-paper/50 text-xs uppercase">Requirement</div>
            <div className="text-amber text-lg font-bold">{dev.required_value_normalized} {dev.normalized_unit}</div>
            <div className="text-paper/70">{dev.operator}</div>
          </div>
          <div className="space-y-2">
            <div className="text-paper/50 text-xs uppercase">Submitted</div>
            <div className="text-red-400 text-lg font-bold">{dev.submitted_value_normalized} {dev.normalized_unit}</div>
            <div className="text-paper/50 text-xs">{dev.calculation}</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-ink/50 rounded border border-paper/10 font-mono text-xs text-paper/60">
          Delta: {dev.delta} {dev.normalized_unit} &middot; Severity rule: {dev.severity_rule_id} &middot; Confidence: {dev.confidence}
        </div>
      </div>

      <div className="flex gap-2 border-b border-paper/10">
        {(['graph', 'simulate', 'workflow'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-mono transition-colors ${
              activeTab === tab
                ? 'text-amber border-b-2 border-amber'
                : 'text-paper/50 hover:text-paper'
            }`}
          >
            {tab === 'graph' ? 'Impact Graph' : tab === 'simulate' ? 'Simulator' : 'Workflow'}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'graph' && <ImpactGraph deviationId={deviationId!} />}
        {activeTab === 'simulate' && <Simulator deviationId={deviationId!} deviation={dev} />}
        {activeTab === 'workflow' && <WorkflowPanel deviationId={deviationId!} />}
      </div>
    </div>
  )
}
