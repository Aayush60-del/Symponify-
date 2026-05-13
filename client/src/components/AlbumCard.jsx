import { useNavigate } from 'react-router-dom'
import useViewport from '../hooks/useViewport'
import CoverArt from './CoverArt'

export default function AlbumCard({ album, onSelect, active = false, onOpen }) {
  const navigate = useNavigate()
  const { isMobile, isWide } = useViewport()
  const handleClick = () => {
    if (onSelect) {
      onSelect(album)
      return
    }

    if (onOpen) {
      onOpen(album)
      return
    }

    navigate(`/search?q=${encodeURIComponent(album.title)}`)
  }

  return (
    <button type="button" style={{ ...styles.card, opacity: active ? 1 : 0.96, padding: isMobile ? '2px' : 0, gap: isWide ? '0.5rem' : styles.card.gap }} onClick={handleClick}>
      <CoverArt
        src={album.coverUrl}
        alt={`${album.title} cover`}
        containerStyle={{
          ...styles.art,
          background: album.coverUrl ? 'var(--surface-2)' : album.color || 'linear-gradient(135deg, #333, #666)',
          outline: active ? '3px solid rgba(255, 92, 53, 0.28)' : 'none',
          fontSize: isMobile ? '34px' : isWide ? '46px' : styles.art.fontSize,
        }}
        imgStyle={styles.image}
        fallback={album.emoji || 'Music'}
      />
      <div style={styles.title}>{album.title}</div>
      <div style={styles.artist}>{album.artist || 'Symponify Radio'}</div>
    </button>
  )
}

const styles = {
  card: {
    width: '100%',
    minWidth: 0,
    textAlign: 'left',
    background: 'transparent',
    cursor: 'pointer',
    display: 'grid',
    gap: '0.35rem',
  },
  art: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '20px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '42px',
    marginBottom: '12px',
    boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  artist: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}
