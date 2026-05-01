import { useEffect, useRef, useState } from 'react'
import api from '../lib/api'
import { useSearchParams } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

const initialForm = {
  title: '',
  artist: '',
  album: '',
  duration: '',
  genre: '',
  emoji: '🎵',
  color: 'linear-gradient(135deg,#FF5C35,#F0A500)',
}

const genres = ['Pop', 'Rock', 'Jazz', 'Bollywood', 'Electronic', 'Chill', 'Hip-Hop', 'Classical']
const emojis = ['🎸', '🎤', '🎹', '🥁', '🎺', '🎻', '🌊', '🔥', '🌸', '🌿', '🌌', '✨']
const colors = [
  'linear-gradient(135deg,#FF5C35,#F0A500)',
  'linear-gradient(135deg,#1a3c5e,#4a90d9)',
  'linear-gradient(135deg,#2D6A4F,#74C69D)',
  'linear-gradient(135deg,#7B2D8B,#C77DFF)',
  'linear-gradient(135deg,#1a1a1a,#555555)',
  'linear-gradient(135deg,#C9184A,#FF758F)',
  'linear-gradient(135deg,#0d1b3e,#3d1a6e)',
  'linear-gradient(135deg,#B5500A,#F0A500)',
]

const styles = {
  page: {
    padding: '28px',
    overflowY: 'auto',
    height: '100%',
  },
  hero: {
    marginBottom: '22px',
    padding: '26px 28px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, rgba(255,92,53,0.14), rgba(240,165,0,0.22))',
    border: '1px solid rgba(255,92,53,0.12)',
  },
  eyebrow: {
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-3)',
    fontWeight: 700,
    marginBottom: '8px',
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: '38px',
    marginBottom: '10px',
  },
  copy: {
    color: 'var(--text-2)',
    lineHeight: 1.6,
    maxWidth: '60ch',
  },
  heroMeta: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  pill: {
    padding: '9px 14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(26,26,24,0.06)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-2)',
  },
  card: {
    maxWidth: '860px',
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--line)',
    borderRadius: '30px',
    padding: '28px',
    boxShadow: 'var(--shadow)',
  },
  heading: {
    fontSize: '22px',
    fontWeight: 800,
    marginBottom: '22px',
  },
  msg: {
    padding: '13px 16px',
    borderRadius: '14px',
    fontSize: '13px',
    marginBottom: '18px',
    border: '1px solid',
  },
  uploadRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  uploadSection: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: '10px',
    alignItems: 'stretch',
  },
  uploadBox: {
    border: '2px dashed #ddd',
    borderRadius: '18px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    minHeight: '160px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  uploadAction: {
    width: '44px',
    minWidth: '44px',
    height: '44px',
    borderRadius: '14px',
    border: '1px solid var(--line)',
    background: '#fff',
    color: 'var(--text-2)',
    cursor: 'pointer',
    fontWeight: 700,
    alignSelf: 'center',
  },
  uploadIcon: {
    fontSize: '26px',
    marginBottom: '10px',
    fontWeight: 800,
    letterSpacing: '0.06em',
  },
  uploadLabel: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '6px',
  },
  uploadSub: {
    fontSize: '12px',
    color: 'var(--text-3)',
    wordBreak: 'break-word',
  },
  progressWrap: {
    marginBottom: '20px',
  },
  progressLabel: {
    fontSize: '12px',
    color: 'var(--text-2)',
    marginBottom: '6px',
    fontWeight: 700,
  },
  progressBar: {
    height: '8px',
    background: 'var(--surface-3)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
    marginBottom: '16px',
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
    padding: '13px 14px',
    background: 'var(--surface-2)',
    border: '1px solid transparent',
    borderRadius: '14px',
    color: 'var(--text)',
    outline: 'none',
  },
  emojiRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  emojiButton: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    border: '1px solid var(--line)',
    fontSize: '18px',
    cursor: 'pointer',
  },
  colorRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
  },
  preview: {
    borderRadius: '22px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    minHeight: '96px',
  },
  previewImage: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  previewEmoji: {
    fontSize: '38px',
  },
  previewTitle: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#fff',
  },
  previewSub: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '4px',
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 180px)',
    gap: '12px',
    marginTop: '10px',
  },
  button: {
    width: '100%',
    padding: '15px 18px',
    borderRadius: '999px',
    background: 'var(--text)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    padding: '15px 18px',
    borderRadius: '999px',
    background: 'var(--surface-2)',
    color: 'var(--text)',
    fontWeight: 700,
    cursor: 'pointer',
    border: '1px solid var(--line)',
  },
}

export default function AddSong() {
  const { user } = usePlayer()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(initialForm)
  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [newAlbumName, setNewAlbumName] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [audioName, setAudioName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState({ text: '', type: '' })
  const audioRef = useRef(null)
  const coverRef = useRef(null)
  const { isCompact, isMobile: isPhone, isWide } = useViewport()
  const preselectedAlbum = searchParams.get('album') || ''

  useEffect(() => {
    api
      .get('/api/songs/albums')
      .then((response) => setAlbums(response.data))
      .catch(() => setAlbums([]))
  }, [])

  useEffect(() => {
    if (!preselectedAlbum) return

    setSelectedAlbum(preselectedAlbum)
    setNewAlbumName('')
    setForm((prev) => ({
      ...prev,
      album: preselectedAlbum,
    }))
  }, [preselectedAlbum])

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const resetAudio = () => {
    setAudioFile(null)
    setAudioName('')
    setForm((prev) => ({ ...prev, duration: '' }))
    if (audioRef.current) audioRef.current.value = ''
  }

  const resetCover = () => {
    if (coverPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(null)
    setCoverPreview(null)
    if (coverRef.current) coverRef.current.value = ''
  }

  const resetForm = () => {
    resetAudio()
    resetCover()
    setForm(initialForm)
    setSelectedAlbum('')
    setNewAlbumName('')
    setProgress(0)
    setMessage({ text: '', type: '' })
  }

  const pickAudio = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.size) {
      setMessage({ text: 'The selected audio file is empty. Choose a valid MP3 or WAV file.', type: 'error' })
      if (audioRef.current) audioRef.current.value = ''
      return
    }

    setAudioFile(file)
    setAudioName(file.name)
    setMessage({ text: '', type: '' })

    const previewAudio = new Audio(URL.createObjectURL(file))
    previewAudio.onloadedmetadata = () => {
      const minutes = Math.floor(previewAudio.duration / 60)
      const seconds = Math.floor(previewAudio.duration % 60)
      setForm((prev) => ({ ...prev, duration: `${minutes}:${seconds.toString().padStart(2, '0')}` }))
      URL.revokeObjectURL(previewAudio.src)
    }
  }

  const pickCover = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.size) {
      setMessage({ text: 'The selected cover image is empty. Choose a valid image file.', type: 'error' })
      if (coverRef.current) coverRef.current.value = ''
      return
    }

    if (coverPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview)
    }

    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setMessage({ text: '', type: '' })
  }

  const submit = async () => {
    if (!form.title.trim() || !form.artist.trim()) {
      setMessage({ text: 'Title and artist are required.', type: 'error' })
      return
    }

    if (!audioFile) {
      setMessage({ text: 'Please select an audio file.', type: 'error' })
      return
    }

    const token = localStorage.getItem('token')
    const finalAlbum = newAlbumName.trim() || selectedAlbum || form.album.trim()
    const formData = new FormData()

    formData.append('title', form.title)
    formData.append('artist', form.artist)
    formData.append('album', finalAlbum)
    formData.append('duration', form.duration)
    formData.append('genre', form.genre)
    formData.append('emoji', form.emoji)
    formData.append('color', form.color)
    formData.append('audio', audioFile)

    if (coverFile) {
      formData.append('cover', coverFile)
    }

    try {
      setUploading(true)
      setProgress(0)
      setMessage({ text: '', type: '' })

      await api.post('/api/songs/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (!event.total) return
          setProgress(Math.round((event.loaded / event.total) * 100))
        },
      })

      resetForm()
      setMessage({ text: 'Song uploaded successfully.', type: 'success' })
    } catch (error) {
      setMessage({
        text: `Upload failed: ${error.response?.data?.message || error.message}`,
        type: 'error',
      })
    } finally {
      setUploading(false)
    }
  }

  if (!user?.isAdmin) {
    return (
      <div style={styles.page} className="scrollbar-hidden">
        <section style={styles.hero}>
          <div style={styles.eyebrow}>Admin Tools</div>
          <h1 style={styles.title}>Admin access only</h1>
          <p style={styles.copy}>The Add Song page is available only to admin users. Sign in again after your account has been granted admin access.</p>
        </section>
      </div>
    )
  }

  return (
    <div
      style={{
        ...styles.page,
        padding: isPhone ? '16px' : isCompact ? '22px' : styles.page.padding,
        width: '100%',
        maxWidth: isWide ? '1320px' : '100%',
        marginInline: 'auto',
      }}
      className="scrollbar-hidden"
    >
      <section
        style={{
          ...styles.hero,
          padding: isPhone ? '20px' : styles.hero.padding,
        }}
      >
        <div style={styles.eyebrow}>Admin Tools</div>
        <h1 style={{ ...styles.title, fontSize: isPhone ? '28px' : styles.title.fontSize }}>Upload a new song</h1>
        <div style={styles.heroMeta}>
          <span style={styles.pill}>Audio upload</span>
          <span style={styles.pill}>Cover preview</span>
          <span style={styles.pill}>Instant metadata</span>
        </div>
      </section>

      <section
        style={{
          ...styles.card,
          padding: isPhone ? '20px' : styles.card.padding,
          borderRadius: isPhone ? '24px' : styles.card.borderRadius,
          width: '100%',
        }}
      >
        <h2 style={styles.heading}>Add New Song</h2>

        {message.text ? (
          <div
            style={{
              ...styles.msg,
              background: message.type === 'success' ? '#f0fff4' : '#fff5f5',
              borderColor: message.type === 'success' ? '#86efac' : '#fca5a5',
              color: message.type === 'success' ? '#166534' : '#991b1b',
            }}
          >
            {message.text}
          </div>
        ) : null}

        <div
          style={{
            ...styles.uploadRow,
            gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : styles.uploadRow.gridTemplateColumns,
          }}
        >
          <div
            style={{
              ...styles.uploadSection,
              gridTemplateColumns: isPhone ? 'minmax(0, 1fr)' : styles.uploadSection.gridTemplateColumns,
            }}
          >
            <button
              type="button"
              style={{
                ...styles.uploadBox,
                borderColor: audioFile ? 'var(--accent)' : '#ddd',
                background: audioFile ? '#fff8f5' : 'var(--surface-2)',
              }}
              onClick={() => audioRef.current?.click()}
            >
              <input ref={audioRef} type="file" accept=".mp3,.wav,.ogg,.m4a" style={{ display: 'none' }} onChange={pickAudio} />
              <div style={styles.uploadIcon}>{audioFile ? 'OK' : 'AUDIO'}</div>
              <div style={styles.uploadLabel}>{audioFile ? 'Audio selected' : 'Upload audio'}</div>
              <div style={styles.uploadSub}>{audioName || 'MP3, WAV, OGG, M4A - max 50MB'}</div>
            </button>
            {audioFile ? (
              <button type="button" style={styles.uploadAction} onClick={resetAudio} aria-label="Remove audio">
                x
              </button>
            ) : null}
          </div>

          <div
            style={{
              ...styles.uploadSection,
              gridTemplateColumns: isPhone ? 'minmax(0, 1fr)' : styles.uploadSection.gridTemplateColumns,
            }}
          >
            <button
              type="button"
              style={{
                ...styles.uploadBox,
                borderColor: coverFile ? 'var(--accent)' : '#ddd',
                background: coverFile ? '#fff8f5' : 'var(--surface-2)',
                overflow: 'hidden',
                padding: coverPreview ? 0 : '24px',
              }}
              onClick={() => coverRef.current?.click()}
            >
              <input ref={coverRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={pickCover} />
              {coverPreview ? (
                <img src={coverPreview} alt="cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <div style={styles.uploadIcon}>COVER</div>
                  <div style={styles.uploadLabel}>Upload cover</div>
                  <div style={styles.uploadSub}>JPG, PNG, WEBP - recommended 500x500</div>
                </>
              )}
            </button>
            {coverFile ? (
              <button type="button" style={styles.uploadAction} onClick={resetCover} aria-label="Remove cover">
                x
              </button>
            ) : null}
          </div>
        </div>

        {uploading ? (
          <div style={styles.progressWrap}>
            <div style={styles.progressLabel}>Uploading... {progress}%</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        <div
          style={{
            ...styles.grid,
            gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : styles.grid.gridTemplateColumns,
          }}
        >
          <div style={styles.field}>
            <label style={styles.label}>Song Title *</label>
            <input style={styles.input} name="title" placeholder="e.g. Tum Hi Ho" value={form.title} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Artist *</label>
            <input style={styles.input} name="artist" placeholder="e.g. Arijit Singh" value={form.artist} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Album Name</label>
            <input style={styles.input} name="album" placeholder="e.g. Aashiqui 2" value={form.album} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Duration</label>
            <input style={styles.input} name="duration" placeholder="e.g. 4:22" value={form.duration} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Genre</label>
            <select style={styles.input} name="genre" value={form.genre} onChange={handleChange}>
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Add To Existing Album</label>
            <select
              style={styles.input}
              value={selectedAlbum}
              onChange={(event) => {
                const value = event.target.value
                setSelectedAlbum(value)
                if (value) {
                  setForm((prev) => ({ ...prev, album: value }))
                  setNewAlbumName('')
                }
              }}
              disabled={Boolean(newAlbumName.trim())}
            >
              <option value="">No album selected</option>
              {albums.map((album) => (
                <option key={album.title} value={album.title}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Create New Album</label>
            <input
              style={styles.input}
              placeholder="e.g. Chill Collection"
              value={newAlbumName}
              onChange={(event) => {
                const value = event.target.value
                setNewAlbumName(value)
                setForm((prev) => ({ ...prev, album: value }))
                if (event.target.value.trim()) {
                  setSelectedAlbum('')
                }
              }}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Emoji Icon</label>
          <div style={styles.emojiRow}>
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                style={{
                  ...styles.emojiButton,
                  background: form.emoji === emoji ? 'var(--text)' : 'var(--surface-2)',
                  color: form.emoji === emoji ? '#fff' : 'var(--text)',
                }}
                onClick={() => setForm((prev) => ({ ...prev, emoji }))}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Card Color</label>
          <div style={styles.colorRow}>
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                style={{
                  ...styles.colorButton,
                  background: color,
                  border: form.color === color ? '3px solid var(--text)' : '3px solid transparent',
                }}
                onClick={() => setForm((prev) => ({ ...prev, color }))}
                aria-label="Select color"
              />
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Preview</label>
          <div
            style={{
              ...styles.preview,
              background: form.color,
              flexDirection: isPhone ? 'column' : 'row',
              alignItems: isPhone ? 'flex-start' : styles.preview.alignItems,
            }}
          >
            {coverPreview ? <img src={coverPreview} alt="cover preview" style={styles.previewImage} /> : <span style={styles.previewEmoji}>{form.emoji}</span>}
            <div>
              <div style={styles.previewTitle}>{form.title || 'Song Title'}</div>
              <div style={styles.previewSub}>{form.artist || 'Artist Name'}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            ...styles.actions,
            gridTemplateColumns: isPhone ? 'minmax(0, 1fr)' : styles.actions.gridTemplateColumns,
          }}
        >
          <button style={{ ...styles.button, opacity: uploading ? 0.6 : 1 }} onClick={submit} disabled={uploading}>
            {uploading ? `Uploading... ${progress}%` : 'Upload Song'}
          </button>
          <button type="button" style={styles.secondaryButton} onClick={resetForm} disabled={uploading}>
            Reset Form
          </button>
        </div>
      </section>
    </div>
  )
}
