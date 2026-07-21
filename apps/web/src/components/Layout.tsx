import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { ToastContainer } from './ui/Toast'
import { useStore } from '../state/store'

export function Layout() {
  const { setProjectId, fetchDeviations } = useStore()

  useEffect(() => {
    setProjectId('DC-TIER3-DEMO-001')
    fetchDeviations()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-primary text-text-primary">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
