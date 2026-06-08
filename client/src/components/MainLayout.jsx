import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import PlayerBar from './PlayerBar'
import Sidebar from './Sidebar'
import useViewport from '../hooks/useViewport'
import { pageVariants, drawerVariants, backdropVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'

export default function MainLayout() {
  const { isCompact, isTabletOrBelow, isWide } = useViewport()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isCompact) {
      setIsSidebarOpen(false)
    }
  }, [isCompact])

  const layoutStyles = {
    shell: {
      display: isCompact ? 'flex' : 'grid',
      flexDirection: isCompact ? 'column' : undefined,
      gridTemplateColumns: isCompact ? undefined : isWide ? '320px minmax(0, 1fr)' : '280px minmax(0, 1fr)',
      gridTemplateRows: isCompact ? undefined : '1fr auto',
      gap: isCompact ? '12px' : '18px',
      height: '100dvh',
      overflow: 'hidden',
      padding: 'var(--page-pad)',
      width: 'min(100%, var(--page-max))',
      marginInline: 'auto',
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
      width: '100%',
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(18, 16, 12, 0.22)',
      zIndex: 39,
    },
  }

  const pageVariantsWithReducedMotion = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : pageVariants

  return (
    <div style={layoutStyles.shell} className="app-shell">
      {isCompact && isSidebarOpen && (
        <motion.button
          type="button"
          aria-label="Close navigation menu"
          style={layoutStyles.overlay}
          onClick={() => setIsSidebarOpen(false)}
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      )}
      <Sidebar isCompact={isCompact} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div style={layoutStyles.mainPanel}>
        <Navbar showMenuButton={isCompact} onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        <motion.div
          style={layoutStyles.content}
          variants={pageVariantsWithReducedMotion}
          initial="initial"
          animate="animate"
          exit="exit"
          key={location.pathname}
        >
          <Outlet />
        </motion.div>
      </div>
      <PlayerBar />
    </div>
  )
}
