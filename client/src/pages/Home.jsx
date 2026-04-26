import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AlbumCard from '../components/AlbumCard'
import FeaturedCard from '../components/FeaturedCard'
import SongRow from '../components/SongRow'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const featuredItems = [
  {
    title: 'Midnight Echoes',
    description: 'The definitive collection of synth-wave and deep house for late evening focus.',
    badge: 'TRENDING NOW',
    background: 'linear-gradient(140deg, #190e2e, #43316b 60%, #ff5c35)',
    large: true,
  },
  {
    title: 'Summer Stage',
    description: 'Experience the front row with bright live sessions.',
    background: 'linear-gradient(140deg, #0f3554, #3f88c5)',
    genre: 'Pop',
  },
  {
    title: 'Acoustic Sessions',
    description: 'Unplugged textures with soft percussive warmth.',
    background: 'linear-gradient(140deg, #4b2f18, #b67339)',
    genre: 'Chill',
  },
]

const styles = {
  page: {
    padding: '28px',
    overflowY: 'auto',
    height: '100%',
  },
  section: {
    marginBottom: '34px',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 800,
  },
  sectionAction: {
    fontSize: '13px',
    color: 'var(--text-3)',
    background: 'transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.25fr) minmax(220px, 0.75fr)',
    gap: '14px',
  },
  featureSide: {
    display: 'grid',
    gap: '14px',
  },
  albumRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(144px, 1fr))',
    gap: '16px',
  },
  helper: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginBottom: '14px',
  },
  empty: {
    padding: '24px',
    borderRadius: '22px',
    background: 'rgba(255,255,255,0.74)',
    border: '1px solid var(--line)',
    color: 'var(--text-2)',
  },
}

export default function Home() {
  const navigate = useNavigate()
  const { playSong } = usePlayer()
  const { isMobile, isTabletOrBelow, isCompact } = useViewport()
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState('')

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

  const playFeaturedMix = () => {
    if (!songs.length) return
    playSong(songs[0], songs)
  }

  const visibleSongs = useMemo(() => {
    if (!selectedAlbum) return songs
    return songs.filter((song) => song.album === selectedAlbum)
  }, [selectedAlbum, songs])

  const handleAlbumSelect = (album) => {
    setSelectedAlbum((prev) => (prev === album.title ? '' : album.title))
  }

  const openFeaturedCollection = (item) => {
    const params = new URLSearchParams()
    if (item.genre) {
      params.set('genre', item.genre)
    }

    navigate(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div style={{ ...styles.page, padding: isMobile ? '16px' : isTabletOrBelow ? '20px' : styles.page.padding }} className="scrollbar-hidden">
      <section style={styles.section}>
        <div style={{ ...styles.sectionHead, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '20px' : styles.sectionTitle.fontSize }}>Featured</h2>
          <button type="button" style={styles.sectionAction} onClick={() => navigate('/search')}>
            See all
          </button>
        </div>

        <div style={{ ...styles.featureGrid, gridTemplateColumns: isTabletOrBelow ? 'minmax(0, 1fr)' : styles.featureGrid.gridTemplateColumns }}>
          <FeaturedCard item={featuredItems[0]} onAction={playFeaturedMix} />
          <div style={{ ...styles.featureSide, gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : undefined }}>
            {featuredItems.slice(1).map((item) => (
              <FeaturedCard key={item.title} item={item} onAction={() => openFeaturedCollection(item)} />
            ))}
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={{ ...styles.sectionHead, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '20px' : styles.sectionTitle.fontSize }}>Recommended for You</h2>
          <button type="button" style={styles.sectionAction} onClick={() => navigate('/library')}>
            Fresh picks
          </button>
        </div>
        {albums.length ? (
          <>
            <p style={styles.helper}>
              {selectedAlbum ? `${selectedAlbum} selected. Click again to clear the filter.` : 'Album par click karo aur niche us album ke songs dekho.'}
            </p>
            <div style={{ ...styles.albumRow, gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '132px' : '144px'}, 1fr))` }}>
              {albums.map((album, index) => (
                <AlbumCard
                  key={`${album.title}-${index}`}
                  album={album}
                  active={selectedAlbum === album.title}
                  onSelect={handleAlbumSelect}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={styles.empty}>Abhi recommended albums available nahi hain. Pehle real songs upload karo, fir yahan albums dikhne lagenge.</div>
        )}
      </section>

      <section style={styles.section}>
        <div style={{ ...styles.sectionHead, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '20px' : styles.sectionTitle.fontSize }}>Your Library</h2>
          <button type="button" style={styles.sectionAction} onClick={() => navigate('/liked')}>
            Recently played
          </button>
        </div>
        {visibleSongs.length ? (
          visibleSongs.map((song, index) => (
            <SongRow key={song._id || `${song.title}-${index}`} song={song} index={index + 1} onPlay={(selectedSong) => playSong(selectedSong, visibleSongs)} />
          ))
        ) : (
          <div style={styles.empty}>
            {selectedAlbum ? `Is album ke liye abhi koi song nahi mila.` : 'Abhi library me real songs nahi hain. Add Song page se upload karne ke baad ye list bhar jayegi.'}
          </div>
        )}
      </section>
    </div>
  )
}
