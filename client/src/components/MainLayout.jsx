import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import PlayerBar from './PlayerBar'
import Sidebar from './Sidebar'
import useViewport from '../hooks/useViewport'

export default function MainLayout() {
  const { isCompact, isTabletOrBelow } = useViewport()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isCompact) {
      setIsSidebarOpen(false)
    }
  }, [isCompact])

  const layoutStyles = {
    shell: {
      display: isCompact ? 'flex' : 'grid',
      flexDirection: isCompact ? 'column' : undefined,
      gridTemplateColumns: isCompact ? undefined : '280px minmax(0, 1fr)',
      gridTemplateRows: isCompact ? undefined : '1fr auto',
      gap: isCompact ? '12px' : '18px',
      minHeight: '100dvh',
      padding: isTabletOrBelow ? '12px' : '18px',
    },
    mainPanel: {
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: isCompact ? '12px' : '18px',
      flex: 1,
    },
    content: {
      flex: 1,
      minHeight: isCompact ? 'auto' : 0,
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--line)',
      borderRadius: isTabletOrBelow ? '24px' : '32px',
      boxShadow: 'var(--shadow)',
      overflow: 'hidden',
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(18, 16, 12, 0.22)',
      zIndex: 39,
    },
  }

  return (
    <div style={layoutStyles.shell}>
      {isCompact && isSidebarOpen ? <button type="button" aria-label="Close navigation menu" style={layoutStyles.overlay} onClick={() => setIsSidebarOpen(false)} /> : null}
      <Sidebar isCompact={isCompact} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div style={layoutStyles.mainPanel}>
        <Navbar showMenuButton={isCompact} onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        <div style={layoutStyles.content}>
          <Outlet />
        </div>
      </div>
      <PlayerBar />
    </div>
  )
}
