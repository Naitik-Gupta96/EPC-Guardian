import { create } from 'zustand'

interface AppState {
  projectId: string
  selectedDeviationId: string | null
  mode: string
  setProjectId: (id: string) => void
  setSelectedDeviation: (id: string | null) => void
}

export const useStore = create<AppState>((set) => ({
  projectId: 'DC-TIER3-DEMO-001',
  selectedDeviationId: null,
  mode: 'seeded',
  setProjectId: (id) => set({ projectId: id }),
  setSelectedDeviation: (id) => set({ selectedDeviationId: id }),
}))
