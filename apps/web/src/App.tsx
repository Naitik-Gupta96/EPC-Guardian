import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './features/dashboard/Dashboard'
import { ComplianceFeed } from './features/compliance/ComplianceFeed'
import { DeviationDetail } from './features/deviation-detail/DeviationDetail'
import { ImpactGraph } from './features/impact-graph/ImpactGraph'
import { Simulator } from './features/simulator/Simulator'
import { WorkflowPanel } from './features/workflow/WorkflowPanel'
import { BenchmarkDashboard } from './features/benchmark/BenchmarkDashboard'
import { DocumentLibrary } from './features/documents/DocumentLibrary'
import { AuditTrail } from './features/audit/AuditTrail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deviations" element={<ComplianceFeed />} />
          <Route path="/deviations/:deviationId" element={<DeviationDetail />} />
          <Route path="/graph" element={<ImpactGraph />} />
          <Route path="/graph/:deviationId" element={<ImpactGraph />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/simulator/:deviationId" element={<Simulator />} />
          <Route path="/workflow" element={<WorkflowPanel />} />
          <Route path="/workflow/:deviationId" element={<WorkflowPanel />} />
          <Route path="/benchmark" element={<BenchmarkDashboard />} />
          <Route path="/documents" element={<DocumentLibrary />} />
          <Route path="/audit" element={<AuditTrail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
