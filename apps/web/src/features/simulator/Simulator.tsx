import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../../state/store'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { Badge } from '../../components/ui/Badge'

const presets = [7, 14, 30, 60]

export function Simulator() {
  const { deviationId } = useParams<{ deviationId: string }>()
  const { selectedDeviation, simulationResult, simulationLoading, setSelectedDeviation, runSimulation } = useStore()
  const [extraDays, setExtraDays] = useState(30)

  useEffect(() => {
    if (deviationId) setSelectedDeviation(deviationId)
    return () => { setSelectedDeviation(null) }
  }, [deviationId])

  const handleRun = () => {
    if (deviationId) runSimulation(deviationId, extraDays)
  }

  if (!selectedDeviation) return <Skeleton className="h-96 rounded-lg" />

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/deviations/${deviationId}`} className="text-text-muted hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Scenario Simulator</h1>
            <p className="text-sm text-text-muted font-mono">{deviationId}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
        </CardHeader>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">Extra Delay</span>
              <span className="text-lg font-mono font-bold text-accent-blue">{extraDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="1"
              value={extraDays}
              onChange={(e) => setExtraDays(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-tertiary cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-blue
                [&::-webkit-slider-thumb]:shadow-glow-blue [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-[10px] text-text-muted">
              <span>0</span><span>15</span><span>30</span><span>45</span><span>60</span>
            </div>
          </div>

          <div className="flex gap-2">
            {presets.map((p) => (
              <Button
                key={p}
                variant={extraDays === p ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setExtraDays(p)}
              >+{p}d</Button>
            ))}
          </div>

          <Button onClick={handleRun} loading={simulationLoading} className="w-full">
            Run Simulation
          </Button>
        </div>
      </Card>

      {simulationResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Baseline</CardTitle>
              <Badge variant="compliant">SCHEDULED</Badge>
            </CardHeader>
            <div className="space-y-2">
              {Object.entries(simulationResult.baseline).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm py-1">
                  <span className="text-text-muted">{key}</span>
                  <span className="font-mono text-text-primary">{val}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impacted</CardTitle>
              <Badge variant="critical">+{simulationResult.total_delay_days}d DELAY</Badge>
            </CardHeader>
            <div className="space-y-2">
              {Object.entries(simulationResult.impacted).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm py-1">
                  <span className="text-text-muted">{key}</span>
                  <span className="font-mono text-accent-red">{val}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {simulationResult && simulationResult.critical_path?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Critical Path</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {simulationResult.critical_path.map((a, i) => (
              <span key={a} className="flex items-center gap-1 text-xs font-mono">
                <Badge variant="warning">{a}</Badge>
                {i < simulationResult.critical_path.length - 1 && (
                  <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                )}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
