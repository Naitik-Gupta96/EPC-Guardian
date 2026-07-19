import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useStore } from '../../state/store'

const severityColors: Record<string, string> = {
  critical: 'bg-red-600/20 text-red-400 border-red-600/30',
  major: 'bg-amber/20 text-amber border-amber/30',
  minor: 'bg-teal/20 text-teal border-teal/30',
}

export function ComplianceFeed() {
  const projectId = useStore((s) => s.projectId)
  const { data, isLoading } = useQuery({
    queryKey: ['deviations', projectId],
    queryFn: () => api.getDeviations(projectId),
  })

  if (isLoading) return <div className="font-mono text-paper/50">Loading deviations...</div>

  const deviations = data?.deviations ?? []

  return (
    <div>
      <h1 className="text-2xl font-mono text-amber mb-6">Compliance Feed</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper/10 text-paper/50 font-mono text-xs uppercase">
              <th className="text-left py-3 px-2">ID</th>
              <th className="text-left py-3 px-2">Severity</th>
              <th className="text-left py-3 px-2">Delta</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Path</th>
            </tr>
          </thead>
          <tbody>
            {deviations.map((d: any) => (
              <tr key={d.id} className="border-b border-paper/5 hover:bg-paper/5 transition-colors">
                <td className="py-3 px-2">
                  <Link to={`/deviations/${d.id}`} className="text-teal font-mono hover:underline">
                    {d.id}
                  </Link>
                </td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono border ${severityColors[d.severity] || ''}`}>
                    {d.severity}
                  </span>
                </td>
                <td className="py-3 px-2 font-mono">
                  {d.delta > 0 ? '+' : ''}{d.delta} {d.normalized_unit}
                </td>
                <td className="py-3 px-2 font-mono text-xs">{d.status}</td>
                <td className="py-3 px-2 font-mono text-xs text-paper/50">{d.decision_path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
