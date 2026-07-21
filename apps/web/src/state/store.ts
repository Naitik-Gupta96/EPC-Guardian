import { create } from 'zustand'
import { api } from '../api/client'

export interface DeviationData {
  id: string
  requirement_id: string
  submittal_id: string
  status: string
  delta: number
  severity: string
  normalized_unit: string
  calculation: string
  confidence: number
  affected_activity_ids: string[]
  affected_test_ids: string[]
  required_value_normalized: number
  submitted_value_normalized: number
  operator: string
  generated_at: string
}

export interface ProjectData {
  id: string
  name: string
  description: string
  status: string
  created_at: string
}

export interface GraphData {
  deviation_id: string
  nodes: { id: string; type: string; label: string; status: string }[]
  edges: { id: string; source: string; target: string; type: string; label: string }[]
  summary: string
}

export interface SimulationResult {
  baseline: Record<string, string>
  impacted: Record<string, string>
  total_delay_days: number
  critical_path: string[]
  activity_floats: Record<string, number>
  scenario_inputs: { extra_delay_days: number }
}

export interface WorkflowResult {
  deviation_id: string
  rfi: any
  ncr: any
  risk_entry: any
}

export interface DocumentData {
  id: string
  filename: string
  document_type: string
  parse_status: string
}

export interface AuditEventData {
  timestamp: string
  action: string
  actor: string
  object_id: string
  details: Record<string, any>
}

export interface BenchmarkResult {
  total_cases: number
  true_positives: number
  false_positives: number
  false_negatives: number
  precision: number
  recall: number
  f1: number
  results: any[]
}

interface DeviationFilters {
  severity: string
  status: string
  equipment: string
  search: string
}

interface Toast {
  id: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
}

interface AppState {
  project: ProjectData | null
  projectLoading: boolean
  deviations: DeviationData[]
  deviationsLoading: boolean
  selectedDeviation: DeviationData | null
  graphData: GraphData | null
  simulationResult: SimulationResult | null
  simulationLoading: boolean
  workflowResult: WorkflowResult | null
  workflowLoading: boolean
  benchmarkResult: BenchmarkResult | null
  benchmarkLoading: boolean
  documents: DocumentData[]
  auditEvents: AuditEventData[]
  filters: DeviationFilters
  sidebarOpen: boolean
  toasts: Toast[]
  globalSearchOpen: boolean

  setProjectId: (id: string) => Promise<void>
  fetchDeviations: () => Promise<void>
  setSelectedDeviation: (id: string | null) => Promise<void>
  setFilters: (f: Partial<DeviationFilters>) => void
  clearFilters: () => void
  runSimulation: (deviationId: string, extraDays: number) => Promise<void>
  generateWorkflow: (deviationId: string) => Promise<void>
  runBenchmark: () => Promise<void>
  fetchDocuments: () => Promise<void>
  fetchAudit: () => Promise<void>
  toggleSidebar: () => void
  addToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  setGlobalSearchOpen: (open: boolean) => void
}

const defaultFilters: DeviationFilters = { severity: '', status: '', equipment: '', search: '' }

export const useStore = create<AppState>((set, get) => ({
  project: null,
  projectLoading: false,
  deviations: [],
  deviationsLoading: false,
  selectedDeviation: null,
  graphData: null,
  simulationResult: null,
  simulationLoading: false,
  workflowResult: null,
  workflowLoading: false,
  benchmarkResult: null,
  benchmarkLoading: false,
  documents: [],
  auditEvents: [],
  filters: defaultFilters,
  sidebarOpen: true,
  toasts: [],
  globalSearchOpen: false,

  setProjectId: async (id: string) => {
    set({ projectLoading: true })
    try {
      const project = await api.getProject(id)
      set({ project, projectLoading: false })
    } catch {
      set({ projectLoading: false })
    }
  },

  fetchDeviations: async () => {
    set({ deviationsLoading: true })
    try {
      const { filters } = get()
      const params = new URLSearchParams()
      if (filters.severity) params.set('severity', filters.severity)
      if (filters.status) params.set('status', filters.status)
      const res = await api.getDeviations('DC-TIER3-DEMO-001', params.toString())
      set({ deviations: res.deviations || [], deviationsLoading: false })
    } catch {
      set({ deviationsLoading: false })
    }
  },

  setSelectedDeviation: async (id: string | null) => {
    if (!id) { set({ selectedDeviation: null, graphData: null, simulationResult: null, workflowResult: null }); return }
    try {
      const [deviation, graph] = await Promise.all([
        api.getDeviation(id),
        api.getImpactGraph(id),
      ])
      set({ selectedDeviation: deviation, graphData: graph })
    } catch { /* ignore */ }
  },

  setFilters: (f: Partial<DeviationFilters>) => {
    set((s) => ({ filters: { ...s.filters, ...f } }))
  },

  clearFilters: () => set({ filters: defaultFilters }),

  runSimulation: async (deviationId: string, extraDays: number) => {
    set({ simulationLoading: true })
    try {
      const result = await api.simulate(deviationId, extraDays)
      set({ simulationResult: result, simulationLoading: false })
    } catch { set({ simulationLoading: false }) }
  },

  generateWorkflow: async (deviationId: string) => {
    set({ workflowLoading: true })
    try {
      const result = await api.generateWorkflow(deviationId)
      set({ workflowResult: result, workflowLoading: false })
    } catch { set({ workflowLoading: false }) }
  },

  runBenchmark: async () => {
    set({ benchmarkLoading: true })
    try {
      const result = await api.getBenchmark('DC-TIER3-DEMO-001')
      set({ benchmarkResult: result, benchmarkLoading: false })
    } catch { set({ benchmarkLoading: false }) }
  },

  fetchDocuments: async () => {
    try {
      const res = await api.getDocuments('DC-TIER3-DEMO-001')
      set({ documents: res.documents || [] })
    } catch { /* ignore */ }
  },

  fetchAudit: async () => {
    try {
      const res = await api.getAudit('DC-TIER3-DEMO-001')
      set({ auditEvents: res.events || [] })
    } catch { /* ignore */ }
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  addToast: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: Math.random().toString(36).slice(2) }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
}))
