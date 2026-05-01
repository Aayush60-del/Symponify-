import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import useViewport from '../hooks/useViewport'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
  },
  wrap: {
    width: 'min(1080px, 100%)',
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '24px',
    alignItems: 'stretch',
  },
  hero: {
    borderRadius: '36px',
    padding: '40px',
    background: 'linear-gradient(160deg, #1a102f, #492c58 52%, #ff5c35)',
    color: '#fff',
    minHeight: '620px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 20px 70px rgba(30, 14, 40, 0.22)',
  },
  heroTitle: {
    fontFamily: 'var(--serif)',
    fontSize: '54px',
    lineHeight: 0.96,
    maxWidth: '8ch',
  },
  heroCopy: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: '15px',
    lineHeight: 1.6,
    maxWidth: '36ch',
    marginTop: '18px',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
  },
  metricCard: {
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.12)',
    padding: '18px',
    backdropFilter: 'blur(8px)',
  },
  metricNum: {
    fontFamily: 'var(--mono)',
    fontSize: '22px',
    marginBottom: '8px',
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: '12px',
  },
  card: {
    borderRadius: '36px',
    background: 'rgba(255,255,255,0.9)',
    boxShadow: 'var(--shadow)',
    padding: '42px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '1px solid var(--line)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--serif)',
    fontSize: '28px',
    marginBottom: '10px',
  },
  dot: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    background: 'var(--accent)',
  },
  subtitle: {
    color: 'var(--text-2)',
    fontSize: '14px',
    marginBottom: '28px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    padding: '6px',
    background: 'var(--surface-2)',
    borderRadius: '999px',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    padding: '11px 16px',
    borderRadius: '999px',
    background: 'transparent',
    cursor: 'pointer',
    fontWeight: 700,
    color: 'var(--text-2)',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-2)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'var(--surface-2)',
    border: '1px solid transparent',
    borderRadius: '16px',
    outline: 'none',
  },
  error: {
    color: '#c54d2b',
    fontSize: '13px',
    marginBottom: '12px',
  },
  button: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '999px',
    background: 'var(--text)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
  },
  secondaryButton: {
    width: '100%',
    padding: '13px 18px',
    borderRadius: '999px',
    background: '#fff6ef',
    color: '#a64724',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '12px',
    border: '1px solid rgba(166, 71, 36, 0.14)',
  },
  hint: {
    fontSize: '12px',
    color: 'var(--text-2)',
    marginTop: '12px',
    textAlign: 'center',
  },
}

export default function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { isMobile, isTabletOrBelow, isWide } = useViewport()

  const handleAuthSuccess = (data, nextPath = '/') => {
    localStorage.removeItem('guestAccess')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.dispatchEvent(new Event('authchange'))
    navigate(nextPath, { replace: true })
  }

  const skipToApp = () => {
    setError('')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.setItem('guestAccess', 'true')
    window.dispatchEvent(new Event('authchange'))
    navigate('/', { replace: true })
  }

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const submit = async () => {
    setError('')

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = tab === 'login' ? { email: form.email, password: form.password } : form
      const { data } = await api.post(endpoint, payload)
      handleAuthSuccess(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const openAdminAccess = async () => {
    setError('')
    setTab('login')

    try {
      const { data } = await api.post('/api/auth/admin-access', {
        email: form.email,
        password: form.password,
      })
      handleAuthSuccess(data, '/add-song')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div style={{ ...styles.page, padding: isMobile ? '16px' : '24px' }}>
      <div
        style={{
          ...styles.wrap,
          gridTemplateColumns: isTabletOrBelow ? 'minmax(0, 1fr)' : styles.wrap.gridTemplateColumns,
          gap: isMobile ? '16px' : isWide ? '28px' : styles.wrap.gap,
        }}
      >
        <section style={{ ...styles.hero, minHeight: isTabletOrBelow ? 'auto' : styles.hero.minHeight, padding: isMobile ? '24px' : styles.hero.padding, borderRadius: isMobile ? '28px' : styles.hero.borderRadius }}>
          <div>
            <div style={styles.logo}>
              <span style={styles.dot} />
              Symponify
            </div>
            <h1 style={{ ...styles.heroTitle, fontSize: isMobile ? '38px' : isTabletOrBelow ? '46px' : styles.heroTitle.fontSize }}>A music room with calm energy.</h1>
            <p style={styles.heroCopy}>
              Keep your favorite records, discover textured playlists, and move through your library with a warm minimal interface.
            </p>
          </div>
          <div style={{ ...styles.metrics, gridTemplateColumns: isMobile ? '1fr' : styles.metrics.gridTemplateColumns }}>
            <div style={styles.metricCard}>
              <div style={styles.metricNum}>24/7</div>
              <div style={styles.metricLabel}>always-on personal listening</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricNum}>120+</div>
              <div style={styles.metricLabel}>handpicked moods and mixes</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricNum}>HD</div>
              <div style={styles.metricLabel}>clean interface, clear focus</div>
            </div>
          </div>
        </section>

        <section style={{ ...styles.card, padding: isMobile ? '24px' : styles.card.padding, borderRadius: isMobile ? '28px' : styles.card.borderRadius }}>
          <div style={styles.logo}>
            <span style={styles.dot} />
            Symponify
          </div>
          <p style={styles.subtitle}>Your music, beautifully organized.</p>

          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                background: tab === 'login' ? 'var(--text)' : 'transparent',
                color: tab === 'login' ? '#fff' : 'var(--text-2)',
              }}
              onClick={() => setTab('login')}
            >
              Sign In
            </button>
            <button
              style={{
                ...styles.tab,
                background: tab === 'signup' ? 'var(--text)' : 'transparent',
                color: tab === 'signup' ? '#fff' : 'var(--text-2)',
              }}
              onClick={() => setTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {tab === 'signup' ? (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
            </div>
          ) : null}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              name="password"
              type="password"
              placeholder="........"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error ? <p style={styles.error}>{error}</p> : null}

          <button style={styles.button} onClick={submit}>
            {tab === 'login' ? 'Sign In ->' : 'Create Account ->'}
          </button>
          <button style={styles.secondaryButton} onClick={skipToApp}>
            Skip and Explore
          </button>
          <button style={styles.secondaryButton} onClick={openAdminAccess}>
            Admin Access
          </button>
          <p style={styles.hint}>Skip to browse as a guest, or use approved admin credentials for upload controls.</p>
        </section>
      </div>
    </div>
  )
}
