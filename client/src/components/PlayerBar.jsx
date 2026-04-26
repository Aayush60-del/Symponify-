import { useRef, useState } from 'react'
import { FiHeart, FiPause, FiPlay, FiRepeat, FiShuffle, FiSkipBack, FiSkipForward, FiVolume2 } from 'react-icons/fi'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const formatSeconds = (value) => {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const styles = {
  bar: {
    gridColumn: '2 / 3',
    display: 'grid',
    gridTemplateColumns: '260px minmax(0, 1fr) 180px',
    alignItems: 'center',
    gap: '20px',
    padding: '18px 24px',
    borderRadius: '28px',
    background: 'rgba(255,255,255,0.86)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow)',
    backdropFilter: 'blur(12px)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
  },
  cover: {
    width: '58px',
    height: '58px',
    borderRadius: '18px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '22px',
    color: '#fff',
    flexShrink: 0,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
  },
  artist: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
  },
  iconButton: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--text-2)',
    flexShrink: 0,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  play: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: 'var(--text)',
    color: '#fff',
    cursor: 'pointer',
  },
  progressRow: {
    display: 'grid',
    gridTemplateColumns: '40px minmax(0, 1fr) 40px',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  time: {
    fontSize: '11px',
    fontFamily: 'var(--mono)',
    color: 'var(--text-3)',
  },
  progressTrack: {
    position: 'relative',
    height: '6px',
    borderRadius: '999px',
    background: 'var(--surface-3)',
    cursor: 'pointer',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
    borderRadius: '999px',
  },
  progressDot: {
    position: 'absolute',
    top: '50%',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#fff',
    border: '2px solid var(--accent)',
    boxShadow: '0 4px 12px rgba(255, 92, 53, 0.28)',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.12s linear',
    pointerEvents: 'none',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  volume: {
    width: '110px',
    accentColor: 'var(--text)',
  },
}

export default function PlayerBar() {
  const { isCompact, isTabletOrBelow } = useViewport()
  const { currentTrack, isPlaying, liked, shuffle, repeatMode, progress, progressPercent, duration, durationLabel, playbackError, seek, setVolume, toggleLike, togglePlay, playNext, playPrevious, toggleShuffle, cycleRepeatMode } = usePlayer()
  const progressTrackRef = useRef(null)
  const [dragPercent, setDragPercent] = useState(null)
  const track = currentTrack || {
    title: 'Pick a song',
    artist: 'Symponify',
    duration: '0:00',
    emoji: null,
    color: 'linear-gradient(135deg, #ff5c35, #f0a500)',
  }
  const hasCover = Boolean(track.coverUrl)
  const activeProgressPercent = dragPercent ?? progressPercent

  const getRatioFromClientX = (clientX) => {
    const bounds = progressTrackRef.current?.getBoundingClientRect()
    if (!bounds || !bounds.width) return 0
    return Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width))
  }

  const commitSeek = (ratio) => {
    if (!duration) return
    seek(ratio * duration)
  }

  const handlePointerDown = (event) => {
    if (!duration) return

    const ratio = getRatioFromClientX(event.clientX)
    setDragPercent(ratio * 100)
    commitSeek(ratio)

    const handlePointerMove = (moveEvent) => {
      const nextRatio = getRatioFromClientX(moveEvent.clientX)
      setDragPercent(nextRatio * 100)
      commitSeek(nextRatio)
    }

    const handlePointerUp = (upEvent) => {
      const nextRatio = getRatioFromClientX(upEvent.clientX)
      setDragPercent(null)
      commitSeek(nextRatio)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const computedStyles = {
    bar: {
      ...styles.bar,
      gridColumn: isCompact ? 'auto' : styles.bar.gridColumn,
      display: isCompact ? 'flex' : 'grid',
      flexDirection: isCompact ? 'column' : undefined,
      gridTemplateColumns: isCompact ? undefined : styles.bar.gridTemplateColumns,
      gap: isCompact ? '16px' : styles.bar.gap,
      padding: isTabletOrBelow ? '16px' : styles.bar.padding,
      borderRadius: isTabletOrBelow ? '22px' : styles.bar.borderRadius,
      alignItems: isCompact ? 'stretch' : styles.bar.alignItems,
    },
    left: {
      ...styles.left,
      justifyContent: isTabletOrBelow ? 'space-between' : 'flex-start',
      gap: isTabletOrBelow ? '12px' : styles.left.gap,
    },
    center: {
      ...styles.center,
      alignItems: 'stretch',
    },
    controls: {
      ...styles.controls,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    progressRow: {
      ...styles.progressRow,
      gridTemplateColumns: isTabletOrBelow ? '44px minmax(0, 1fr) 44px' : styles.progressRow.gridTemplateColumns,
      gap: isTabletOrBelow ? '8px' : styles.progressRow.gap,
    },
    right: {
      ...styles.right,
      justifyContent: isCompact ? 'space-between' : styles.right.justifyContent,
      width: isCompact ? '100%' : 'auto',
    },
    leftMeta: {
      minWidth: 0,
      flex: 1,
    },
    volume: {
      ...styles.volume,
      width: isTabletOrBelow ? '100%' : styles.volume.width,
      flex: isCompact ? 1 : 'unset',
    },
  }

  return (
    <footer style={computedStyles.bar}>
      <div style={computedStyles.left}>
        <div style={{ ...styles.cover, background: hasCover ? 'var(--surface-2)' : track.color || 'linear-gradient(135deg, #ff5c35, #f0a500)' }}>
          {hasCover ? <img src={track.coverUrl} alt={`${track.title} cover`} style={styles.coverImage} /> : track.emoji || <FiPlay />}
        </div>
        <div style={computedStyles.leftMeta}>
          <div style={styles.title}>{track.title}</div>
          <div style={styles.artist}>{track.artist}</div>
          {playbackError ? <div style={{ ...styles.artist, color: '#c54d2b' }}>{playbackError}</div> : null}
        </div>
        <button style={styles.iconButton} onClick={() => toggleLike(track)} aria-label="Like current track">
          <FiHeart fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div style={computedStyles.center}>
        <div style={computedStyles.controls}>
          <button style={{ ...styles.iconButton, color: shuffle ? 'var(--accent)' : styles.iconButton.color }} aria-label="Shuffle" onClick={toggleShuffle}>
            <FiShuffle />
          </button>
          <button style={styles.iconButton} aria-label="Previous track" onClick={playPrevious}>
            <FiSkipBack />
          </button>
          <button style={styles.play} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button style={styles.iconButton} aria-label="Next track" onClick={playNext}>
            <FiSkipForward />
          </button>
          <button
            style={{ ...styles.iconButton, color: repeatMode === 'off' ? styles.iconButton.color : 'var(--accent)' }}
            aria-label={`Repeat mode ${repeatMode}`}
            onClick={cycleRepeatMode}
          >
            <FiRepeat />
          </button>
        </div>
        <div style={computedStyles.progressRow}>
          <span style={styles.time}>{formatSeconds(progress)}</span>
          <div
            ref={progressTrackRef}
            style={styles.progressTrack}
            onPointerDown={handlePointerDown}
          >
            <div style={{ ...styles.progressFill, width: `${activeProgressPercent}%` }} />
            <div style={{ ...styles.progressDot, left: `${activeProgressPercent}%` }} />
          </div>
          <span style={styles.time}>{durationLabel || track.duration || formatSeconds(duration)}</span>
        </div>
      </div>

      <div style={computedStyles.right}>
        <FiVolume2 color="var(--text-2)" />
        <input type="range" min="0" max="100" defaultValue="70" style={computedStyles.volume} onChange={(event) => setVolume(Number(event.target.value))} />
      </div>
    </footer>
  )
}
