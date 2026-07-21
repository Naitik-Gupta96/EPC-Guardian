import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../../state/store'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'

export function WorkflowPanel() {
  const { deviationId } = useParams<{ deviationId: string }>()
  const { selectedDeviation, workflowResult, workflowLoading, setSelectedDeviation, generateWorkflow } = useStore()
  const [preview, setPreview] = useState<{ kind: string; content: string } | null>(null)
  const [approvals, setApprovals] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (deviationId) setSelectedDeviation(deviationId)
    return () => { setSelectedDeviation(null) }
  }, [deviationId])

  const docs = workflowResult
    ? [
        { kind: 'RFI', id: workflowResult.rfi?.id, content: workflowResult.rfi?.draft_content || '' },
        { kind: 'NCR', id: workflowResult.ncr?.id, content: workflowResult.ncr?.draft_content || '' },
        { kind: 'Risk Register', id: workflowResult.risk_entry?.id, content: workflowResult.risk_entry?.draft_content || '' },
      ]
    : []

  if (!selectedDeviation) return <Skeleton className="h-96 rounded-lg" />

  const allApproved = docs.length > 0 && docs.every((d) => approvals[d.kind])

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/deviations/${deviationId}`} className="text-text-muted hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Corrective Workflow</h1>
            <p className="text-sm text-text-muted font-mono">{deviationId}</p>
          </div>
        </div>
        <Button onClick={() => generateWorkflow(deviationId!)} loading={workflowLoading}>
          {docs.length > 0 ? 'Regenerate' : 'Generate Documents'}
        </Button>
      </div>

      {allApproved && (
        <div className="rounded-lg border border-accent-green/30 bg-accent-green/5 p-4 text-sm text-accent-green">
          All corrective actions approved and queued for outbox dispatch.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {docs.map((doc) => {
          const approved = approvals[doc.kind]
          return (
            <Card key={doc.kind} className={approved ? 'border-accent-green/30' : ''}>
              <CardHeader>
                <CardTitle>{doc.kind}</CardTitle>
                {approved ? (
                  <Badge variant="success">APPROVED ✓</Badge>
                ) : (
                  <Badge variant="warning">DRAFTED</Badge>
                )}
              </CardHeader>
              <div className="text-xs text-text-muted mb-4 font-mono">{doc.id}</div>
              <div className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full" onClick={() => setPreview(doc)}>
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={approved}
                  onClick={() => setApprovals((a) => ({ ...a, [doc.kind]: true }))}
                >
                  {approved ? 'Approved' : 'Approve'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={`${preview?.kind} — ${preview?.content?.split('\n')[0] || ''}`}
        className="max-w-2xl"
      >
        {preview && (
          <pre className="text-sm text-text-primary whitespace-pre-wrap font-mono bg-primary rounded-lg p-4 max-h-96 overflow-y-auto">
            {preview.content}
          </pre>
        )}
      </Modal>
    </div>
  )
}
