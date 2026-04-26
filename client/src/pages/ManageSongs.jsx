import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiEdit3, FiMusic, FiPlusCircle, FiSave, FiTrash2, FiUpload, FiX } from 'react-icons/fi'
import { usePlayer } from '../context/PlayerContext'
import useViewport from '../hooks/useViewport'

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
    background: 'linear-gradient(135deg, rgba(15,53,84,0.12), rgba(63,136,197,0.18))',
    border: '1px solid rgba(15,53,84,0.12)',
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
  msg: {
    padding: '13px 16px',
    borderRadius: '14px',
    fontSize: '13px',
    marginBottom: '18px',
    border: '1px solid',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '320px minmax(0, 1fr)',
    gap: '18px',
    alignItems: 'start',
  },
  albumsCard: {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--line)',
    borderRadius: '28px',
    padding: '20px',
    boxShadow: 'var(--shadow)',
  },
  songsCard: {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--line)',
    borderRadius: '28px',
    padding: '20px',
    boxShadow: 'var(--shadow)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 800,
    marginBottom: '14px',
  },
  createAlbumBox: {
    padding: '16px',
    borderRadius: '22px',
    background: 'var(--surface-2)',
    border: '1px solid rgba(26,26,24,0.06)',
    marginBottom: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  field: {
    display: 'grid',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-2)',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    background: 'var(--surface-2)',
    border: '1px solid transparent',
    outline: 'none',
    color: 'var(--text)',
  },
  full: {
    gridColumn: '1 / -1',
  },
  albumList: {
    display: 'grid',
    gap: '10px',
  },
  albumButton: {
    width: '100%',
    textAlign: 'left',
    padding: '14px 16px',
    borderRadius: '18px',
    background: 'var(--surface-2)',
    cursor: 'pointer',
    border: '1px solid transparent',
  },
  albumName: {
    fontSize: '14px',
    fontWeight: 800,
  },
  albumMeta: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
  },
  songsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '16px',
  },
  songsTitle: {
    fontSize: '20px',
    fontWeight: 800,
  },
  songsMeta: {
    fontSize: '12px',
    color: 'var(--text-3)',
  },
  songList: {
    display: 'grid',
    gap: '14px',
  },
  songCard: {
    border: '1px solid rgba(26,26,24,0.06)',
    borderRadius: '22px',
    padding: '16px',
    background: 'rgba(255,255,255,0.76)',
  },
  songTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '14px',
  },
  songInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
  },
  art: {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    fontSize: '22px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  artImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
  songName: {
    fontSize: '15px',
    fontWeight: 800,
  },
  songSub: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '4px',
  },
  controls: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  controlButton: {
    padding: '10px 14px',
    borderRadius: '999px',
    background: 'var(--surface-2)',
    cursor: 'pointer',
    fontWeight: 700,
    color: 'var(--text)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid var(--line)',
  },
  primaryButton: {
    background: 'var(--text)',
    color: '#fff',
  },
  deleteButton: {
    background: '#fff1f2',
    color: '#be123c',
    border: '1px solid rgba(190,18,60,0.12)',
  },
  empty: {
    padding: '24px',
    borderRadius: '22px',
    background: 'rgba(255,255,255,0.74)',
    border: '1px solid var(--line)',
    color: 'var(--text-2)',
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(18, 16, 12, 0.18)',
    zIndex: 40,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(420px, calc(100vw - 32px))',
    background: 'rgba(255,255,255,0.98)',
    border: '1px solid var(--line)',
    borderRadius: '28px',
    boxShadow: '0 24px 60px rgba(18,16,12,0.16)',
    padding: '22px',
    zIndex: 50,
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: 800,
    marginBottom: '8px',
  },
  modalCopy: {
    color: 'var(--text-2)',
    lineHeight: 1.6,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
}

const emptyEdit = {
  title: '',
  artist: '',
  album: '',
  duration: '',
  genre: '',
}

const emptyAlbumForm = {
  title: '',
  artist: '',
}

const albumCountLabel = (count) => `${count} ${count === 1 ? 'song' : 'songs'}`

export default function ManageSongs() {
  const { user } = usePlayer()
  const navigate = useNavigate()
  const { isMobile, isTabletOrBelow, isCompact } = useViewport()
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [editingSongId, setEditingSongId] = useState('')
  const [editForm, setEditForm] = useState(emptyEdit)
  const [createAlbumForm, setCreateAlbumForm] = useState(emptyAlbumForm)
  const [creatingAlbum, setCreatingAlbum] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [songPendingDelete, setSongPendingDelete] = useState(null)
  const [changingAlbumCover, setChangingAlbumCover] = useState(false)
  const [replacingSongId, setReplacingSongId] = useState('')
  const [albumNameDraft, setAlbumNameDraft] = useState('')

  const token = localStorage.getItem('token')

  const loadData = async (preferredAlbum = '') => {
    try {
      const [songsResponse, albumsResponse] = await Promise.all([axios.get('/api/songs'), axios.get('/api/songs/albums')])
      const nextSongs = songsResponse.data
      const nextAlbums = albumsResponse.data

      setSongs(nextSongs)
      setAlbums(nextAlbums)
      setSelectedAlbum((prev) => {
        const available = nextAlbums.map((album) => album.title)
        if (preferredAlbum && available.includes(preferredAlbum)) return preferredAlbum
        if (prev && available.includes(prev)) return prev
        return available[0] || ''
      })
    } catch {
      setSongs([])
      setAlbums([])
      setSelectedAlbum('')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setAlbumNameDraft(selectedAlbum)
  }, [selectedAlbum])

  const visibleSongs = useMemo(() => {
    if (!selectedAlbum) return songs
    return songs.filter((song) => (song.album?.trim() || 'Singles') === selectedAlbum)
  }, [selectedAlbum, songs])

  const selectedAlbumData = useMemo(() => albums.find((album) => album.title === selectedAlbum) || null, [albums, selectedAlbum])
  const selectedAlbumCover = selectedAlbumData?.coverUrl || visibleSongs.find((song) => song.coverUrl)?.coverUrl || ''

  const startEdit = (song) => {
    setEditingSongId(song._id)
    setEditForm({
      title: song.title || '',
      artist: song.artist || '',
      album: song.album || '',
      duration: song.duration || '',
      genre: song.genre || '',
    })
    setMessage({ text: '', type: '' })
  }

  const cancelEdit = () => {
    setEditingSongId('')
    setEditForm(emptyEdit)
  }

  const saveSong = async (songId) => {
    try {
      const { data } = await axios.put(`/api/songs/${songId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await loadData(data.song.album || selectedAlbum)
      setMessage({ text: 'Song updated successfully.', type: 'success' })
      setEditingSongId('')
      setEditForm(emptyEdit)
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Update failed', type: 'error' })
    }
  }

  const deleteSong = async (songId) => {
    try {
      await axios.delete(`/api/songs/${songId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await loadData(selectedAlbum)
      setMessage({ text: 'Song deleted successfully.', type: 'success' })
      setSongPendingDelete(null)
      if (editingSongId === songId) {
        cancelEdit()
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Delete failed', type: 'error' })
    }
  }

  const createAlbum = async () => {
    const title = createAlbumForm.title.trim()
    if (!title) {
      setMessage({ text: 'Album name required hai.', type: 'error' })
      return
    }

    try {
      setCreatingAlbum(true)
      const { data } = await axios.post(
        '/api/songs/albums',
        {
          title,
          artist: createAlbumForm.artist.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setCreateAlbumForm(emptyAlbumForm)
      await loadData(data.album.title)
      setMessage({ text: 'Album create ho gaya. Ab isme songs aur cover baad me add kar sakte ho.', type: 'success' })
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Album create failed', type: 'error' })
    } finally {
      setCreatingAlbum(false)
    }
  }

  const changeAlbumCover = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !selectedAlbum) return

    try {
      setChangingAlbumCover(true)
      const formData = new FormData()
      formData.append('title', selectedAlbum)
      formData.append('cover', file)

      await axios.post(`/api/songs/albums/${encodeURIComponent(selectedAlbum)}/cover`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      await loadData(selectedAlbum)
      setMessage({ text: 'Album cover updated successfully.', type: 'success' })
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Album cover update failed', type: 'error' })
    } finally {
      setChangingAlbumCover(false)
      event.target.value = ''
    }
  }

  const renameAlbum = async () => {
    const nextAlbum = albumNameDraft.trim()
    if (!selectedAlbum || !nextAlbum || nextAlbum === selectedAlbum) return

    try {
      const { data } = await axios.put(
        `/api/songs/albums/${encodeURIComponent(selectedAlbum)}`,
        { album: nextAlbum },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      await loadData(data.album)
      setMessage({ text: 'Album renamed successfully.', type: 'success' })
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Album rename failed', type: 'error' })
    }
  }

  const replaceSongMedia = async (songId, event, field) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.size) {
      setMessage({ text: 'Empty file upload nahi ho sakti. Valid media choose karo.', type: 'error' })
      event.target.value = ''
      return
    }

    try {
      setReplacingSongId(songId)
      const formData = new FormData()
      formData.append(field, file)

      await axios.put(`/api/songs/${songId}/media`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      await loadData(selectedAlbum)
      setMessage({ text: field === 'audio' ? 'Song audio replace ho gaya.' : 'Song cover replace ho gaya.', type: 'success' })
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Media update failed', type: 'error' })
    } finally {
      setReplacingSongId('')
      event.target.value = ''
    }
  }

  if (!user?.isAdmin) {
    return (
      <div style={styles.page} className="scrollbar-hidden">
        <section style={styles.hero}>
          <div style={styles.eyebrow}>Admin Tools</div>
          <h1 style={styles.title}>Admin access only</h1>
          <p style={styles.copy}>Manage Songs page sirf admin ke liye available hai.</p>
        </section>
      </div>
    )
  }

  return (
    <div style={{ ...styles.page, padding: isMobile ? '16px' : isTabletOrBelow ? '20px' : styles.page.padding }} className="scrollbar-hidden">
      <section style={{ ...styles.hero, padding: isMobile ? '20px' : styles.hero.padding }}>
        <div style={styles.eyebrow}>Admin Tools</div>
        <h1 style={{ ...styles.title, fontSize: isMobile ? '28px' : styles.title.fontSize }}>Manage Songs</h1>
        <p style={styles.copy}>Album yahin create karo, cover baad me update karo, aur selected album me direct song add karne ke liye shortcut use karo.</p>
      </section>

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

      <div style={{ ...styles.layout, gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : styles.layout.gridTemplateColumns }}>
        <section style={styles.albumsCard}>
          <h2 style={styles.sectionTitle}>Albums</h2>

          <div style={styles.createAlbumBox}>
            <div style={{ ...styles.sectionTitle, fontSize: '16px', marginBottom: '12px' }}>Create New Album</div>
            <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : styles.formGrid.gridTemplateColumns }}>
              <div style={{ ...styles.field, ...styles.full }}>
                <label style={styles.label}>Album Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Weekend Drafts"
                  value={createAlbumForm.title}
                  onChange={(event) => setCreateAlbumForm((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div style={{ ...styles.field, ...styles.full }}>
                <label style={styles.label}>Album Artist / Owner</label>
                <input
                  style={styles.input}
                  placeholder="Optional"
                  value={createAlbumForm.artist}
                  onChange={(event) => setCreateAlbumForm((prev) => ({ ...prev, artist: event.target.value }))}
                />
              </div>
            </div>
            <div style={{ ...styles.controls, marginTop: '12px' }}>
              <button type="button" style={{ ...styles.controlButton, ...styles.primaryButton }} onClick={createAlbum} disabled={creatingAlbum}>
                <FiPlusCircle />
                {creatingAlbum ? 'Creating...' : 'Create Album'}
              </button>
            </div>
          </div>

          {albums.length ? (
            <div style={styles.albumList}>
              {albums.map((album) => (
                <button
                  key={album.title}
                  type="button"
                  style={{
                    ...styles.albumButton,
                    background: selectedAlbum === album.title ? 'var(--text)' : 'var(--surface-2)',
                    color: selectedAlbum === album.title ? '#fff' : 'var(--text)',
                  }}
                  onClick={() => setSelectedAlbum(album.title)}
                >
                  <div style={styles.albumName}>{album.title}</div>
                  <div style={{ ...styles.albumMeta, color: selectedAlbum === album.title ? 'rgba(255,255,255,0.72)' : styles.albumMeta.color }}>
                    {albumCountLabel(album.songCount || 0)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div style={styles.empty}>Abhi koi album available nahi hai.</div>
          )}
        </section>

        <section style={styles.songsCard}>
          <div style={{ ...styles.songsHeader, flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center' }}>
            <div>
              <div style={styles.songsTitle}>{selectedAlbum || 'Select an album'}</div>
              <div style={styles.songsMeta}>
                {selectedAlbumData ? `${albumCountLabel(selectedAlbumData.songCount || 0)} available for management` : 'Album choose karo ya naya album create karo.'}
              </div>
            </div>
            {selectedAlbum ? (
              <div style={styles.controls}>
                <button type="button" style={{ ...styles.controlButton, ...styles.primaryButton }} onClick={() => navigate(`/add-song?album=${encodeURIComponent(selectedAlbum)}`)}>
                  <FiPlusCircle />
                  Add Song
                </button>
                <label style={styles.controlButton}>
                  <FiEdit3 />
                  {changingAlbumCover ? 'Updating...' : 'Change Cover'}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={changeAlbumCover} disabled={changingAlbumCover} />
                </label>
              </div>
            ) : null}
          </div>

          {selectedAlbum ? (
            <>
              <div style={{ ...styles.songCard, marginBottom: '16px' }}>
                <div style={{ ...styles.songInfo, alignItems: 'center' }}>
                  <div style={{ ...styles.art, width: '72px', height: '72px', borderRadius: '18px', background: selectedAlbumCover ? 'var(--surface-2)' : selectedAlbumData?.color || 'linear-gradient(135deg, #333, #666)', fontSize: '28px' }}>
                    {selectedAlbumCover ? <img src={selectedAlbumCover} alt={`${selectedAlbum} cover`} style={styles.artImage} /> : selectedAlbumData?.emoji || <FiMusic />}
                  </div>
                  <div>
                    <div style={styles.songName}>{selectedAlbum}</div>
                    <div style={styles.songSub}>
                      {selectedAlbumCover ? 'Current album cover' : 'Abhi cover add nahi hua. Change Cover se baad me upload kar sakte ho.'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ ...styles.songCard, marginBottom: '16px' }}>
                <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : styles.formGrid.gridTemplateColumns }}>
                  <div style={{ ...styles.field, ...styles.full }}>
                    <label style={styles.label}>Album Name</label>
                    <input style={styles.input} value={albumNameDraft} onChange={(event) => setAlbumNameDraft(event.target.value)} />
                  </div>
                  <div style={styles.controls}>
                    <button type="button" style={styles.controlButton} onClick={renameAlbum} disabled={!albumNameDraft.trim() || albumNameDraft.trim() === selectedAlbum}>
                      <FiSave />
                      Rename Album
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {selectedAlbum ? (
            visibleSongs.length ? (
              <div style={styles.songList}>
                {visibleSongs.map((song) => {
                  const isEditing = editingSongId === song._id
                  return (
                    <article key={song._id} style={styles.songCard}>
                      <div style={{ ...styles.songTop, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
                        <div style={styles.songInfo}>
                          <div style={{ ...styles.art, background: song.coverUrl ? 'var(--surface-2)' : song.color || 'linear-gradient(135deg, #333, #666)' }}>
                          {song.coverUrl ? <img src={song.coverUrl} alt={`${song.title} cover`} style={styles.artImage} /> : song.emoji || <FiMusic />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={styles.songName}>{song.title}</div>
                          <div style={styles.songSub}>
                            {song.artist} • {song.duration || '0:00'} • {song.genre || 'No genre'}
                          </div>
                          {!song.audioReady ? (
                            <div style={{ ...styles.songSub, color: '#c54d2b' }}>
                              <FiAlertCircle style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                              Audio file missing ya broken hai
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div style={styles.controls}>
                          {isEditing ? (
                            <>
                              <button type="button" style={styles.controlButton} onClick={() => saveSong(song._id)}>
                                <FiSave />
                                Save
                              </button>
                              <button type="button" style={styles.controlButton} onClick={cancelEdit}>
                                <FiX />
                                Cancel
                              </button>
                            </>
                        ) : (
                          <button type="button" style={styles.controlButton} onClick={() => startEdit(song)}>
                            <FiEdit3 />
                            Update
                          </button>
                        )}
                        <label style={styles.controlButton}>
                          <FiUpload />
                          {replacingSongId === song._id ? 'Uploading...' : 'Replace Audio'}
                          <input
                            type="file"
                            accept=".mp3,.wav,.ogg,.m4a"
                            style={{ display: 'none' }}
                            onChange={(event) => replaceSongMedia(song._id, event, 'audio')}
                            disabled={replacingSongId === song._id}
                          />
                        </label>
                        <button type="button" style={{ ...styles.controlButton, ...styles.deleteButton }} onClick={() => setSongPendingDelete(song)}>
                          <FiTrash2 />
                          Delete
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : styles.formGrid.gridTemplateColumns }}>
                          <div style={styles.field}>
                            <label style={styles.label}>Title</label>
                            <input style={styles.input} value={editForm.title} onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))} />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Artist</label>
                            <input style={styles.input} value={editForm.artist} onChange={(event) => setEditForm((prev) => ({ ...prev, artist: event.target.value }))} />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Album</label>
                            <input style={styles.input} value={editForm.album} onChange={(event) => setEditForm((prev) => ({ ...prev, album: event.target.value }))} />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Duration</label>
                            <input style={styles.input} value={editForm.duration} onChange={(event) => setEditForm((prev) => ({ ...prev, duration: event.target.value }))} />
                          </div>
                          <div style={{ ...styles.field, ...styles.full }}>
                            <label style={styles.label}>Genre</label>
                            <input style={styles.input} value={editForm.genre} onChange={(event) => setEditForm((prev) => ({ ...prev, genre: event.target.value }))} />
                          </div>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            ) : (
              <div style={styles.empty}>Is album me abhi songs nahi hain. `Add Song` se is album me tracks add kar do, aur `Change Cover` se cover baad me upload kar sakte ho.</div>
            )
          ) : (
            <div style={styles.empty}>Left side se album select karo ya naya album create karo. Uske baad yahin se rename, cover update, aur song management sab ho jayega.</div>
          )}
        </section>
      </div>

      {songPendingDelete ? (
        <>
          <button type="button" aria-label="Close delete confirmation" style={styles.overlay} onClick={() => setSongPendingDelete(null)} />
          <div style={styles.modal}>
            <div style={styles.modalTitle}>Delete Song?</div>
            <p style={styles.modalCopy}>
              `{songPendingDelete.title}` ko permanently remove karna hai? Ye action baad me undo nahi hoga.
            </p>
            <div style={styles.modalActions}>
              <button type="button" style={styles.controlButton} onClick={() => setSongPendingDelete(null)}>
                Cancel
              </button>
              <button type="button" style={{ ...styles.controlButton, ...styles.deleteButton }} onClick={() => deleteSong(songPendingDelete._id)}>
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
