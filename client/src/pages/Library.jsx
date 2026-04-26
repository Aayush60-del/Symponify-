import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import AlbumCard from '../components/AlbumCard'
import useViewport from '../hooks/useViewport'

const tabs = ['Albums', 'Artists', 'Podcasts']

const podcastItems = [
  { title: 'Studio Notes', artist: 'Creative Talk', emoji: '🎙️', color: 'linear-gradient(135deg, #372248, #7c4dff)' },
  { title: 'Slow Mornings', artist: 'Daily Rituals', emoji: '☕', color: 'linear-gradient(135deg, #67412c, #d88c52)' },
  { title: 'After Midnight', artist: 'Night Stories', emoji: '🌘', color: 'linear-gradient(135deg, #0b132b, #1c2541)' },
]

const styles = {
  page: {
    padding: '28px',
    overflowY: 'auto',
    height: '100%',
  },
  tabs: {
    display: 'inline-flex',
    gap: '10px',
    padding: '8px',
    borderRadius: '999px',
    background: 'var(--surface)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow)',
    marginBottom: '24px',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  tab: {
    padding: '10px 16px',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: 700,
    background: 'transparent',
  },
  hero: {
    borderRadius: '32px',
    padding: '28px',
    background: 'linear-gradient(135deg, rgba(255,92,53,0.12), rgba(240,165,0,0.2))',
    marginBottom: '24px',
    border: '1px solid rgba(255, 92, 53, 0.12)',
  },
  heading: {
    fontFamily: 'var(--serif)',
    fontSize: '38px',
    marginBottom: '8px',
  },
  copy: {
    color: 'var(--text-2)',
    maxWidth: '52ch',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(144px, 1fr))',
    gap: '20px',
  },
  empty: {
    padding: '24px',
    borderRadius: '22px',
    background: 'rgba(255,255,255,0.74)',
    border: '1px solid var(--line)',
    color: 'var(--text-2)',
  },
}

export default function Library() {
  const { isMobile, isTabletOrBelow } = useViewport()
  const [activeTab, setActiveTab] = useState('Albums')
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    axios
      .get('/api/songs')
      .then((response) => setSongs(response.data))
      .catch(() => setSongs([]))

    axios
      .get('/api/songs/albums')
      .then((response) => setAlbums(response.data))
      .catch(() => setAlbums([]))
  }, [])

  const artistItems = useMemo(() => {
    const artistMap = new Map()

    songs.forEach((song) => {
      const key = song.artist?.trim()
      if (!key || artistMap.has(key)) return

      artistMap.set(key, {
        title: key,
        artist: 'Artist Collection',
        emoji: song.emoji || '🎤',
        color: song.color || 'linear-gradient(135deg, #6536d6, #b35fff)',
        coverUrl: song.coverUrl || '',
      })
    })

    return Array.from(artistMap.values()).sort((a, b) => a.title.localeCompare(b.title))
  }, [songs])

  const items = useMemo(() => {
    if (activeTab === 'Albums') return albums
    if (activeTab === 'Artists') return artistItems
    return podcastItems
  }, [activeTab, albums, artistItems])

  return (
    <div style={{ ...styles.page, padding: isMobile ? '16px' : isTabletOrBelow ? '20px' : styles.page.padding }} className="scrollbar-hidden">
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            style={{
              ...styles.tab,
              background: activeTab === tab ? 'var(--text)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-2)',
              width: isMobile ? '100%' : 'auto',
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section style={{ ...styles.hero, padding: isMobile ? '20px' : styles.hero.padding, borderRadius: isMobile ? '24px' : styles.hero.borderRadius }}>
        <h1 style={{ ...styles.heading, fontSize: isMobile ? '28px' : styles.heading.fontSize }}>Your {activeTab.toLowerCase()}</h1>
        <p style={styles.copy}>
          Everything you have saved lives here. Flip between albums, artists, and podcasts without losing the calm, editorial feel of the space.
        </p>
      </section>

      {items.length ? (
        <div style={{ ...styles.grid, gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '132px' : '144px'}, 1fr))` }}>
          {items.map((item, index) => (
            <AlbumCard key={`${item.title}-${index}`} album={item} />
          ))}
        </div>
      ) : (
        <div style={styles.empty}>Abhi is section ke liye real data available nahi hai.</div>
      )}
    </div>
  )
}
