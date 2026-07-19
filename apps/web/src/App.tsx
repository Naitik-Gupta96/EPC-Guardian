import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ComplianceFeed } from './features/compliance/ComplianceFeed'
import { DeviationDetail } from './features/compliance/DeviationDetail'
import { BenchmarkDashboard } from './features/benchmark/BenchmarkDashboard'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="border border-amber/30 rounded-lg p-8 bg-amber/5 max-w-lg">
        <h1 className="text-3xl font-mono text-amber mb-4">EPC Guardian</h1>
        <p className="text-paper/70 mb-6 font-sans">
          AI Intelligence Platform for Data Centre EPC Project Delivery
        </p>
        <p className="text-sm font-mono text-paper/50 mb-6">
          Detect specification deviations &middot; Trace downstream impact &middot;
          Quantify schedule consequences &middot; Generate corrective workflows
        </p>
        <div className="text-xs font-mono text-paper/30">
          Project: DC-TIER3-DEMO-001 &middot; Mode: seeded
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/deviations" element={<ComplianceFeed />} />
          <Route path="/deviations/:deviationId" element={<DeviationDetail />} />
          <Route path="/benchmark" element={<BenchmarkDashboard />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function DocumentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-mono text-amber mb-6">Documents</h1>
      <p className="text-sm font-mono text-paper/50">7 documents ingested. Document viewer available in evidence panel.</p>
    </div>
  )
}

function AuditPage() {
  return (
    <div>
      <h1 className="text-2xl font-mono text-amber mb-6">Audit Trail</h1>
      <p className="text-sm font-mono text-paper/50">Audit events logged. Full ledger available in the API.</p>
    </div>
  )
}

export default App
