import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'
import { useStore } from '../../state/store'

export function BenchmarkDashboard() {
  const projectId = useStore((s) => s.projectId)

  const { data, isLoading } = useQuery({
    queryKey: ['benchmark', projectId],
    queryFn: () => api.getBenchmark(projectId),
  })

  if (isLoading) return <div className="font-mono text-paper/50">Loading benchmark...</div>
  if (!data) return <div className="font-mono text-paper/50">No benchmark data</div>

  const metrics = [
    { label: 'Precision', value: data.precision, color: 'text-teal' },
    { label: 'Recall', value: data.recall, color: 'text-amber' },
    { label: 'F1 Score', value: data.f1, color: 'text-amber' },
    { label: 'Citation Accuracy', value: data.citation_accuracy, color: 'text-teal' },
    { label: 'Extraction Accuracy', value: data.exact_extraction, color: 'text-teal' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-mono text-amber mb-6">Benchmark</h1>
      <div className="grid grid-cols-5 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="border border-paper/10 rounded-lg p-4 bg-paper/5">
            <div className="text-xs font-mono text-paper/50 mb-1">{m.label}</div>
            <div className={`text-2xl font-mono font-bold ${m.color}`}>
              {(m.value * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-teal/20 rounded-lg bg-teal/5">
          <div className="text-xs font-mono text-paper/50 mb-1">True Positives</div>
          <div className="text-xl font-mono text-teal">{data.correct_deviations}</div>
        </div>
        <div className="p-4 border border-red-400/20 rounded-lg bg-red-400/5">
          <div className="text-xs font-mono text-paper/50 mb-1">False Positives</div>
          <div className="text-xl font-mono text-red-400">{data.false_positives}</div>
        </div>
        <div className="p-4 border border-amber/20 rounded-lg bg-amber/5">
          <div className="text-xs font-mono text-paper/50 mb-1">False Negatives</div>
          <div className="text-xl font-mono text-amber">{data.false_negatives}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-paper/40">
        Total test cases: {data.total_cases} &middot; Unsupported verified: {data.unsupported_verified}
      </div>
    </div>
  )
}
