import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { songsService, albumsService } from '../lib/services'
import { pageVariants } from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'
import AlbumCard from '../components/AlbumCard'
import FeaturedCard from '../components/FeaturedCard'
import SongRow from '../components/SongRow'
import Loader from '../components/Loader'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const Icon = ({ name, size = 20, style: extraStyle }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, lineHeight: 1, ...extraStyle }}>{name}</span>
)

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
    display: 'flex',
    flexDirection: 'column',
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
    whiteSpace: 'normal',
    wordBreak: 'break-word',
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
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '16px',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
  },
  carouselWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    color: 'var(--text)',
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
  const { error: showError } = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { isMobile, isTabletOrBelow, isCompact, isWide } = useViewport()
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const carouselRef = useRef(null)

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = isMobile ? 200 : 400
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    let ignore = false

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [songsData, albumsData] = await Promise.all([
          songsService.getAll({ limit: 100 }),
          albumsService.getAll(),
        ])
        if (ignore) return
        setSongs(songsData)
        setAlbums(albumsData)
      } catch (err) {
        if (ignore) return
        const errorMsg = 'Failed to load songs and albums. Please try again.'
        setSongs([])
        setAlbums([])
        setError(errorMsg)
        showError(errorMsg)
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [showError])

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

  const pageVariantsWithAccessibility = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : pageVariants

  return (
    <motion.div
      style={{ ...styles.page, padding: isMobile ? '16px' : isTabletOrBelow ? '20px' : styles.page.padding, width: '100%', maxWidth: isWide ? '1500px' : '100%', marginInline: 'auto' }}
      className="scrollbar-hidden"
      variants={pageVariantsWithAccessibility}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <section style={{ ...styles.section, flexShrink: 0 }}>
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

      <section style={{ ...styles.section, flexShrink: 0 }}>
        <div style={{ ...styles.sectionHead, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '20px' : styles.sectionTitle.fontSize }}>Recommended for You</h2>
          <button type="button" style={styles.sectionAction} onClick={() => navigate('/library')}>
            Fresh picks
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : albums.length ? (
          <>
            <p style={styles.helper}>
              {selectedAlbum ? `${selectedAlbum} selected. Click again to clear the filter.` : 'Select an album to view its songs below.'}
            </p>
            <div style={styles.carouselWrap}>
              {!isMobile && (
                <button
                  style={{ ...styles.scrollButton, left: '-20px' }}
                  onClick={() => scrollCarousel('left')}
                  aria-label="Scroll left"
                >
                  <Icon name="chevron_left" size={24} />
                </button>
              )}
              <div
                ref={carouselRef}
                className="scrollbar-hidden"
                style={styles.albumRow}
              >
                {albums.map((album, index) => (
                  <div key={`${album.title}-${index}`} style={{ flex: `0 0 ${isMobile ? '132px' : isWide ? '180px' : '144px'}`, scrollSnapAlign: 'start' }}>
                    <AlbumCard
                      album={album}
                      active={selectedAlbum === album.title}
                      onSelect={handleAlbumSelect}
                    />
                  </div>
                ))}
              </div>
              {!isMobile && (
                <button
                  style={{ ...styles.scrollButton, right: '-20px' }}
                  onClick={() => scrollCarousel('right')}
                  aria-label="Scroll right"
                >
                  <Icon name="chevron_right" size={24} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={styles.empty}>No recommended albums are available yet. Upload songs to start seeing albums here.</div>
        )}
      </section>

      <section style={{ ...styles.section, display: 'flex', flexDirection: 'column', flex: 1, minHeight: '40vh', marginBottom: 0 }}>
        <div style={{ ...styles.sectionHead, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center', flexShrink: 0 }}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '20px' : styles.sectionTitle.fontSize }}>Your Library</h2>
          <button type="button" style={styles.sectionAction} onClick={() => navigate('/liked')}>
            Recently played
          </button>
        </div>

        <div className="scrollbar-hidden" style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '4px' }}>
          {error ? (
            <div style={styles.empty}>{error}</div>
          ) : visibleSongs.length ? (
            visibleSongs.map((song, index) => (
              <SongRow key={song._id || `${song.title}-${index}`} song={song} index={index + 1} onPlay={(selectedSong) => playSong(selectedSong, visibleSongs)} />
            ))
          ) : (
            <div style={styles.empty}>
              {selectedAlbum ? 'No songs were found for this album yet.' : 'Your library is empty right now. Upload songs from the Add Song page to fill this list.'}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}
