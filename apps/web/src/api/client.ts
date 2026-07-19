const BASE = '/api'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  return res.json()
}

export const api = {
  getProject: (id: string) => get<any>(`/projects/${id}`),
  getDeviations: (projectId: string, filters?: string) =>
    get<any>(`/projects/${projectId}/deviations${filters ? `?${filters}` : ''}`),
  getDeviation: (id: string) => get<any>(`/deviations/${id}`),
  getImpactGraph: (id: string) => get<any>(`/deviations/${id}/impact-graph`),
  simulate: (id: string, extraDays: number) =>
    post<any>(`/deviations/${id}/simulate`, { extra_delay_days: extraDays }),
  generateWorkflow: (id: string) => post<any>(`/deviations/${id}/workflow`),
  getBenchmark: (projectId: string) => get<any>(`/projects/${projectId}/benchmark`),
  getDocuments: (projectId: string) => get<any>(`/projects/${projectId}/documents`),
  getAudit: (projectId: string) => get<any>(`/projects/${projectId}/audit`),
}
