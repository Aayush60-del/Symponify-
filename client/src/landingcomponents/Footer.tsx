import { useNavigate } from 'react-router-dom'
import Waveform from './Waveform'

const links = {
  Product: [
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Changelog', path: '/changelog' },
    { label: 'Roadmap', path: '/roadmap' }
  ],
  Developer: [
    { label: 'API Docs', path: '/api-docs' },
    { label: 'GitHub', path: 'https://github.com/symponify', external: true },
    { label: 'Self-host guide', path: '/self-host' },
    { label: 'Status', path: '/status' }
  ],
  Company: [
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' }
  ],
  Legal: [
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
    { label: 'Cookie policy', path: '/cookie-policy' }
  ]
}

export default function Footer() {
  const navigate = useNavigate()

  const handleNavigation = (path, external) => {
    if (external) {
      window.open(path, '_blank')
    } else {
      navigate(path)
    }
  }

  return (
    <footer className="py-16 px-4" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
          {/* Brand column */}
          <div className="md:col-span-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-2.5 mb-4 hover:opacity-70 transition-opacity">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              >
                <WaveIcon />
              </span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '22px' }}>Symponify</span>
            </button>
            <p className="text-sm max-w-xs mb-6 leading-relaxed" style={{ color: 'var(--text-2)' }}>
              A full-stack music streaming platform built with React, Express, MongoDB, and Cloudinary. Open-source at heart.
            </p>
            {/* Mini waveform */}
            <div className="max-w-[180px]">
              <Waveform barCount={24} height={28} color="var(--accent)" playing />
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p
                className="text-xs font-bold uppercase tracking-[0.12em] mb-4"
                style={{ color: 'var(--text-3)' }}
              >
                {category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => handleNavigation(item.path, item.external)}
                      className="text-sm hover:opacity-70 transition-opacity text-left"
                      style={{ color: 'var(--text-2)' }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            © 2026 Symponify. Built with ❤️ and too many late nights.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/symponify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-3)' }}
            >
              GitHub
            </a>
            <a href="#" className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-3)' }}>
              Twitter
            </a>
            <a href="#" className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-3)' }}>
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function WaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 8 Q3 4 5 8 Q7 12 9 8 Q11 4 13 8 Q15 12 15 8"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}