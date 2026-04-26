import { NavLink, useNavigate } from 'react-router-dom'
import { FiDisc, FiEdit3, FiGrid, FiHeart, FiLogOut, FiPlusCircle, FiSearch, FiX } from 'react-icons/fi'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const styles = {
  sidebar: {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--line)',
    borderRadius: '32px',
    padding: '28px 22px',
    boxShadow: 'var(--shadow)',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--serif)',
    fontSize: '28px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
    boxShadow: '0 0 18px rgba(255, 92, 53, 0.35)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    paddingInline: '10px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '18px',
    color: 'var(--text-2)',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  cta: {
    marginTop: 'auto',
    padding: '18px',
    borderRadius: '24px',
    background: 'linear-gradient(160deg, #1f1635, #4b265a 58%, #ff5c35)',
    color: '#fff',
  },
  ctaTitle: {
    fontSize: '20px',
    fontFamily: 'var(--serif)',
    marginBottom: '8px',
  },
  ctaText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '13px',
    lineHeight: 1.5,
    marginBottom: '14px',
  },
  ctaButton: {
    padding: '12px 16px',
    borderRadius: '999px',
    background: '#fff',
    color: '#1f1635',
    fontWeight: 700,
    cursor: 'pointer',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  closeButton: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'var(--surface-2)',
    color: 'var(--text)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
}

export default function Sidebar({ isCompact = false, isOpen = false, onClose }) {
  const navigate = useNavigate()
  const { user } = usePlayer()
  const { isMobile, isTabletOrBelow, isWide } = useViewport()

  const links = [
    { to: '/', label: 'Home', icon: FiGrid, end: true },
    { to: '/search', label: 'Search', icon: FiSearch },
    { to: '/library', label: 'Library', icon: FiDisc },
    { to: '/liked', label: 'Liked Songs', icon: FiHeart },
  ]

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('authchange'))
    navigate('/login', { replace: true })
    onClose?.()
  }

  const sidebarStyle = {
    ...styles.sidebar,
    gridRow: isCompact ? 'auto' : '1 / span 2',
    position: isCompact ? 'fixed' : 'relative',
    top: isCompact ? '12px' : 'auto',
    left: isCompact ? '12px' : 'auto',
    bottom: isCompact ? '12px' : 'auto',
    maxWidth: isCompact ? '100%' : 'none',
    transform: isCompact ? `translateX(${isOpen ? '0' : '-120%'})` : 'none',
    transition: 'transform 0.25s ease',
    zIndex: isCompact ? 40 : 'auto',
    overflowY: 'auto',
    padding: isTabletOrBelow ? '20px 18px' : styles.sidebar.padding,
    borderRadius: isTabletOrBelow ? '24px' : styles.sidebar.borderRadius,
    minHeight: isCompact ? 'calc(100dvh - 24px)' : '100%',
    maxHeight: isCompact ? 'calc(100dvh - 24px)' : 'none',
    width: isCompact ? 'min(320px, calc(100vw - 24px))' : isWide ? '320px' : 'auto',
  }

  return (
    <aside style={sidebarStyle} aria-hidden={isCompact ? !isOpen : false}>
      <div style={styles.topRow}>
        <div style={styles.brand}>
          <span style={styles.dot} />
          Symponify
        </div>
        {isCompact ? (
          <button type="button" style={styles.closeButton} aria-label="Close menu" onClick={onClose}>
            <FiX />
          </button>
        ) : null}
      </div>

      <div style={styles.section}>
        <span style={styles.sectionLabel}>Browse</span>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => {
              if (isCompact) onClose?.()
            }}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? 'var(--text)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-2)',
              boxShadow: isActive ? '0 8px 20px rgba(26,26,24,0.15)' : 'none',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        {user?.isAdmin ? (
          <>
            <NavLink
              to="/add-song"
              onClick={() => {
                if (isCompact) onClose?.()
              }}
              style={({ isActive }) => ({
                ...styles.link,
                marginTop: '4px',
                background: isActive ? 'var(--text)' : '#1a1a18',
                color: '#fff',
                boxShadow: '0 8px 20px rgba(26,26,24,0.15)',
                borderRadius: '999px',
              })}
            >
              <FiPlusCircle size={18} />
              Add Song
            </NavLink>
            <NavLink
              to="/manage-songs"
              onClick={() => {
                if (isCompact) onClose?.()
              }}
              style={({ isActive }) => ({
                ...styles.link,
                background: isActive ? 'var(--text)' : '#2d2d2a',
                color: '#fff',
                boxShadow: '0 8px 20px rgba(26,26,24,0.12)',
                borderRadius: '999px',
              })}
            >
              <FiEdit3 size={18} />
              Manage Songs
            </NavLink>
          </>
        ) : null}
      </div>

      <div style={styles.cta}>
        <div style={styles.ctaTitle}>Curated daily</div>
        <p style={styles.ctaText}>A bright mix of synth, soul, and intimate acoustic sessions picked for you.</p>
        <button style={{ ...styles.ctaButton, width: isMobile ? '100%' : 'auto' }} onClick={logout}>
          <FiLogOut style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Logout
        </button>
      </div>
    </aside>
  )
}
