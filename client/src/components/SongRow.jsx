import { FiHeart, FiPlay, FiVolume2 } from 'react-icons/fi'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

export default function SongRow({ song, index, onPlay }) {
  const { currentTrack, isLiked, isPlaying, playSong, toggleLike } = usePlayer()
  const { isMobile, isTabletOrBelow } = useViewport()
  const active = currentTrack?._id === song._id
  const liked = isLiked(song._id)
  const hasCover = Boolean(song.coverUrl)

  const rowStyle = {
    ...styles.row,
    background: active ? 'rgba(255, 92, 53, 0.08)' : 'rgba(255,255,255,0.74)',
    gridTemplateColumns: isMobile ? '52px minmax(0, 1fr) 40px' : isTabletOrBelow ? '32px 52px minmax(0, 1fr) 72px 40px' : styles.row.gridTemplateColumns,
    gridTemplateRows: isMobile ? 'auto auto' : 'auto',
    gap: isMobile ? '10px 12px' : styles.row.gap,
    alignItems: isMobile ? 'start' : styles.row.alignItems,
    padding: isMobile ? '12px' : styles.row.padding,
  }

  return (
    <div style={rowStyle} onClick={() => (onPlay ? onPlay(song) : playSong(song))}>
      {!isMobile ? <div style={styles.index}>{active && isPlaying ? <FiVolume2 size={14} /> : String(index).padStart(2, '0')}</div> : null}
      <div style={{ ...styles.cover, background: hasCover ? 'var(--surface-2)' : song.color || 'var(--surface-2)', gridRow: isMobile ? '1 / span 2' : 'auto' }}>
        {hasCover ? <img src={song.coverUrl} alt={`${song.title} cover`} style={styles.coverImage} /> : song.emoji || <FiPlay />}
      </div>
      <div style={{ ...styles.info, gridColumn: isMobile ? '2 / 3' : 'auto' }}>
        <div style={{ ...styles.title, color: active ? 'var(--accent)' : 'var(--text)' }}>{song.title}</div>
        <div style={styles.sub}>{song.subtitle || `${song.artist} - ${song.duration || '3:20'}`}</div>
      </div>
      <div style={{ ...styles.meta, gridColumn: isMobile ? '2 / 3' : 'auto', justifySelf: isMobile ? 'start' : styles.meta.justifySelf }}>
        {song.duration || song.genre || '3:20'}
      </div>
      <button
        type="button"
        style={{ ...styles.likeButton, color: liked ? '#c9184a' : 'var(--text-3)', gridColumn: isMobile ? '3 / 4' : 'auto', gridRow: isMobile ? '1 / 2' : 'auto' }}
        aria-label={`Like ${song.title}`}
        onClick={(event) => {
          event.stopPropagation()
          toggleLike(song)
        }}
      >
        <FiHeart fill={liked ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}

const styles = {
  row: {
    display: 'grid',
    gridTemplateColumns: '40px 52px minmax(0, 1fr) 90px 40px',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 14px',
    borderRadius: '18px',
    border: '1px solid rgba(26, 26, 24, 0.05)',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  index: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    color: 'var(--text-3)',
    display: 'grid',
    placeItems: 'center',
  },
  cover: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '18px',
    color: '#fff',
    overflow: 'hidden',
    flexShrink: 0,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  info: {
    minWidth: 0,
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
  },
  sub: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    justifySelf: 'end',
    fontSize: '12px',
    color: 'var(--text-2)',
  },
  likeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'transparent',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
  },
}
