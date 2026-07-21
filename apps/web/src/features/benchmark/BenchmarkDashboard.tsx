import { useEffect } from 'react'
import { useStore } from '../../state/store'
import { KpiCard } from '../../components/ui/KpiCard'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'

export function BenchmarkDashboard() {
  const { benchmarkResult, benchmarkLoading, runBenchmark } = useStore()

  useEffect(() => { runBenchmark() }, [])

  if (benchmarkLoading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
      </div>
    </div>
  )

  const columns: Column<any>[] = [
    { key: 'case', label: '#', sortable: true, render: (r) => <span className="text-xs text-text-muted">{r.case_id || r.id}</span> },
    { key: 'category', label: 'Category', render: (r) => <Badge variant="info">{r.category || '—'}</Badge> },
    { key: 'expected', label: 'Expected', render: (r) => <span className="text-xs font-mono">{r.expected || '—'}</span> },
    { key: 'predicted', label: 'Predicted', render: (r) => <span className="text-xs font-mono">{r.predicted || '—'}</span> },
    { key: 'result', label: 'Result', sortable: true, render: (r) => {
      const correct = r.match || r.correct
      return correct
        ? <Badge variant="success" dot>TP</Badge>
        : <Badge variant="error" dot>FN</Badge>
    }},
  ]

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Benchmark Dashboard</h1>
          <p className="text-sm text-text-muted">30-case ground truth evaluation</p>
        </div>
        <Button size="sm" onClick={runBenchmark} loading={benchmarkLoading}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </Button>
      </div>

      {benchmarkResult && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <KpiCard label="Total Cases" value={benchmarkResult.total_cases} color="text-text-primary" />
            <KpiCard label="True Positives" value={benchmarkResult.true_positives} color="text-accent-green" />
            <KpiCard label="False Positives" value={benchmarkResult.false_positives} color="text-accent-red" />
            <KpiCard label="False Negatives" value={benchmarkResult.false_negatives} color="text-accent-amber" />
            <KpiCard label="Precision" value={`${(benchmarkResult.precision * 100).toFixed(1)}%`} color="text-accent-purple" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard label="Recall" value={`${(benchmarkResult.recall * 100).toFixed(1)}%`} color="text-accent-cyan" />
            <KpiCard label="F1 Score" value={`${(benchmarkResult.f1 * 100).toFixed(1)}%`} color="text-accent-blue" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Case Breakdown</CardTitle>
            </CardHeader>
            <DataTable
              columns={columns}
              data={benchmarkResult.results}
              emptyMessage="No benchmark results"
            />
          </Card>
        </>
      )}
    </div>
  )
}
