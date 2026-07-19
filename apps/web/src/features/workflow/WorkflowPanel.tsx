import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../../api/client'

interface Props {
  deviationId: string
}

export function WorkflowPanel({ deviationId }: Props) {
  const [generated, setGenerated] = useState(false)
  const [approved, setApproved] = useState<Record<string, boolean>>({})

  const { data, isLoading } = useQuery({
    queryKey: ['workflow', deviationId, generated],
    queryFn: () => api.generateWorkflow(deviationId),
    enabled: generated,
  })

  return (
    <div className="border border-paper/10 rounded-lg p-6 bg-paper/5">
      <h2 className="font-mono text-sm text-paper/70 mb-4">Corrective Workflow</h2>
      {!generated ? (
        <button
          onClick={() => setGenerated(true)}
          className="px-4 py-2 bg-amber/20 border border-amber/40 text-amber font-mono text-sm rounded hover:bg-amber/30 transition-colors"
        >
          Generate RFI, NCR & Risk Entry
        </button>
      ) : isLoading ? (
        <div className="font-mono text-xs text-paper/50">Drafting documents...</div>
      ) : data ? (
        <div className="space-y-4">
          {[
            { key: 'rfi', label: 'RFI', data: data.rfi },
            { key: 'ncr', label: 'NCR', data: data.ncr },
            { key: 'risk_entry', label: 'Risk Register', data: data.risk_entry },
          ].map((item) => (
            <div key={item.key} className="border border-paper/10 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-mono text-sm text-amber">{item.label}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setApproved((a) => ({ ...a, [item.key]: !a[item.key] }))}
                    className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                      approved[item.key]
                        ? 'bg-teal/20 border-teal/40 text-teal'
                        : 'border-paper/20 text-paper/50 hover:text-paper'
                    }`}
                  >
                    {approved[item.key] ? 'Approved' : 'Approve'}
                  </button>
                </div>
              </div>
              <pre className="text-xs font-mono text-paper/70 whitespace-pre-wrap bg-ink/50 p-3 rounded border border-paper/5">
                {item.data.draft_content}
              </pre>
              <div className="mt-1 text-[10px] font-mono text-paper/30">
                Schedule impact: {item.data.schedule_delta_days} days
              </div>
            </div>
          ))}
          <div className="p-3 border border-amber/20 bg-amber/5 rounded text-xs font-mono text-amber/70">
            All documents must be individually approved. This MVP records approvals in the outbox — nothing is externally dispatched.
          </div>
        </div>
      ) : null}
    </div>
  )
}
