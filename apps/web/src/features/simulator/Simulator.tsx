import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'

interface Props {
  deviationId: string
  deviation?: any
}

export function Simulator({ deviationId }: Props) {
  const [delayDays, setDelayDays] = useState(0)
  const [trigger, setTrigger] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['simulate', deviationId, delayDays, trigger],
    queryFn: () => api.simulate(deviationId, delayDays),
    enabled: trigger > 0,
  })

  return (
    <div className="border border-paper/10 rounded-lg p-6 bg-paper/5">
      <h2 className="font-mono text-sm text-paper/70 mb-4">Schedule Impact Simulator</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono text-paper/50 block mb-2">
            Extra delay on affected activities: <span className="text-amber font-bold">{delayDays} days</span>
          </label>
          <input
            type="range"
            min={0}
            max={60}
            value={delayDays}
            onChange={(e) => setDelayDays(Number(e.target.value))}
            className="w-full accent-amber"
          />
          <div className="flex justify-between text-[10px] font-mono text-paper/30">
            <span>0 days</span>
            <span>60 days</span>
          </div>
        </div>
        <button
          onClick={() => setTrigger((t) => t + 1)}
          className="px-4 py-2 bg-amber/20 border border-amber/40 text-amber font-mono text-sm rounded hover:bg-amber/30 transition-colors"
        >
          Simulate
        </button>
      </div>

      {isLoading && <div className="mt-4 font-mono text-xs text-paper/50">Computing...</div>}
      {error && <div className="mt-4 font-mono text-xs text-red-400">Simulation failed</div>}
      {data && trigger > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 border border-paper/10 rounded bg-ink/50">
            <div className="text-xs font-mono text-paper/50">Baseline</div>
            <div className="text-xl font-mono text-teal">{data.baseline_duration_days} <span className="text-xs text-paper/40">days</span></div>
          </div>
          <div className="p-3 border border-paper/10 rounded bg-ink/50">
            <div className="text-xs font-mono text-paper/50">Impacted</div>
            <div className="text-xl font-mono text-red-400">{data.impacted_duration_days} <span className="text-xs text-paper/40">days</span></div>
          </div>
          <div className="p-3 border border-paper/10 rounded bg-ink/50">
            <div className="text-xs font-mono text-paper/50">Delta</div>
            <div className={`text-xl font-mono ${data.project_delta_days > 0 ? 'text-red-400' : 'text-teal'}`}>
              {data.project_delta_days > 0 ? '+' : ''}{data.project_delta_days} <span className="text-xs text-paper/40">days</span>
            </div>
          </div>
        </div>
      )}

      {data && trigger > 0 && data.float_by_activity && (
        <div className="mt-4">
          <div className="text-xs font-mono text-paper/50 mb-2">Activity Float</div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(data.float_by_activity as Record<string, number>)
              .sort(([, a], [, b]) => a - b)
              .slice(0, 8)
              .map(([id, float]) => (
                <div key={id} className={`p-2 rounded text-xs font-mono border ${float === 0 ? 'border-red-400/30 text-red-400' : 'border-paper/10 text-paper/50'}`}>
                  {id}: {float}d
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
