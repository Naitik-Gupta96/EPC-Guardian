import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { ChatWidget } from './ChatWidget'
import { ToastContainer } from './ui/Toast'
import { useStore } from '../state/store'

export function Layout() {
  const { setProjectId, fetchDeviations } = useStore()

  useEffect(() => {
    setProjectId('DC-TIER3-DEMO-001')
    fetchDeviations()
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col bg-primary text-text-primary overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
      <ToastContainer />
    </div>
  )
}
