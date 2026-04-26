const fs = require('fs')
const router = require('express').Router()
const Album = require('../models/Album')
const Song = require('../models/Song')
const User = require('../models/User')
const upload = require('../middleware/upload')
const authMiddleware = require('../middleware/authMiddleware')

const sanitizeSongTitle = (value) => {
  const cleaned = value ? value.replace(/[^a-zA-Z0-9 ]/g, '').trim() : ''
  return cleaned || 'unknown'
}

const buildMediaUrl = (req, folderName, filename) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`
  return `${baseUrl}/songs/${encodeURIComponent(sanitizeSongTitle(folderName))}/${filename}`
}

const getLocalMediaPath = (mediaUrl) => {
  if (!mediaUrl) return ''

  try {
    const parsed = new URL(mediaUrl)
    const relativePath = decodeURIComponent(parsed.pathname.replace(/^\/songs\//, ''))
    if (!relativePath || relativePath === parsed.pathname) return ''
    return require('path').join(__dirname, '../public/songs', relativePath)
  } catch {
    return ''
  }
}

const withMediaFlags = (song) => {
  const audioPath = getLocalMediaPath(song.audioUrl)
  const coverPath = getLocalMediaPath(song.coverUrl)

  return {
    ...song,
    audioReady: Boolean(audioPath && fs.existsSync(audioPath) && fs.statSync(audioPath).size > 0),
    coverReady: !coverPath || (fs.existsSync(coverPath) && fs.statSync(coverPath).size > 0),
  }
}

const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

const ensureNonEmptyUpload = (file, label) => {
  if (!file) return
  if (file.size > 0) return

  deleteFileIfExists(file.path)
  const error = new Error(`${label} file empty hai. Valid file dobara upload karo.`)
  error.status = 400
  throw error
}

const getAlbumsWithCounts = async () => {
  const [storedAlbums, songs] = await Promise.all([
    Album.find({}).sort({ title: 1 }).lean(),
    Song.find({ album: { $ne: '' } }).select('album artist color emoji coverUrl').sort({ album: 1 }).lean(),
  ])

  const albumMap = new Map()

  storedAlbums.forEach((album) => {
    albumMap.set(album.title, {
      title: album.title,
      artist: album.artist || '',
      color: album.color || 'linear-gradient(135deg, #333, #666)',
      emoji: album.emoji || '🎵',
      coverUrl: album.coverUrl || '',
      songCount: 0,
    })
  })

  songs.forEach((song) => {
    const title = song.album?.trim()
    if (!title) return

    if (!albumMap.has(title)) {
      albumMap.set(title, {
        title,
        artist: song.artist || '',
        color: song.color || 'linear-gradient(135deg, #333, #666)',
        emoji: song.emoji || '🎵',
        coverUrl: song.coverUrl || '',
        songCount: 0,
      })
    }

    const album = albumMap.get(title)
    album.songCount += 1
    if (!album.artist && song.artist) album.artist = song.artist
    if (!album.coverUrl && song.coverUrl) album.coverUrl = song.coverUrl
    if (!album.color && song.color) album.color = song.color
    if (!album.emoji && song.emoji) album.emoji = song.emoji
  })

  return Array.from(albumMap.values()).sort((a, b) => a.title.localeCompare(b.title))
}

const syncAlbumRecord = async ({ title, artist, color, emoji, coverUrl }) => {
  if (!title?.trim()) return null

  const existingAlbum = await Album.findOne({ title: title.trim() })
  const nextAlbum = existingAlbum || new Album({ title: title.trim() })

  if (!nextAlbum.artist && artist) nextAlbum.artist = artist
  if (!nextAlbum.color && color) nextAlbum.color = color
  if (!nextAlbum.emoji && emoji) nextAlbum.emoji = emoji
  if (color && !existingAlbum) nextAlbum.color = color
  if (emoji && !existingAlbum) nextAlbum.emoji = emoji
  if (artist && !existingAlbum) nextAlbum.artist = artist
  if (coverUrl) nextAlbum.coverUrl = coverUrl

  await nextAlbum.save()
  return nextAlbum
}

router.get('/', async (req, res) => {
  try {
    const { genre, search } = req.query
    const query = {}

    if (genre) query.genre = genre

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } },
      ]
    }

    const songs = await Song.find(query).sort({ createdAt: -1 }).limit(50).lean()
    res.json(songs.map(withMediaFlags))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/albums', async (_req, res) => {
  try {
    const albums = await getAlbumsWithCounts()
    res.json(albums)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/liked', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('likedSongs')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.likedSongs.map((song) => withMediaFlags(song.toObject())))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/like/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const song = await Song.findById(req.params.id)
    if (!song) return res.status(404).json({ message: 'Song not found' })

    const alreadyLiked = user.likedSongs.some((id) => id.toString() === req.params.id)
    user.likedSongs = alreadyLiked ? user.likedSongs.filter((id) => id.toString() !== req.params.id) : [...user.likedSongs, song._id]
    await user.save()

    res.json({ liked: !alreadyLiked, likedSongs: user.likedSongs })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/albums', authMiddleware, upload.single('cover'), async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can create albums' })

    ensureNonEmptyUpload(req.file, 'Cover')

    const title = req.body.title?.trim()
    if (!title) return res.status(400).json({ message: 'Album name is required' })

    const [existingAlbum, existingSongs] = await Promise.all([Album.findOne({ title }), Song.exists({ album: title })])
    if (existingAlbum || existingSongs) return res.status(409).json({ message: 'Album already exists' })

    const coverUrl = req.file ? buildMediaUrl(req, title, req.file.filename) : ''
    const album = await Album.create({
      title,
      artist: req.body.artist?.trim() || '',
      color: req.body.color || 'linear-gradient(135deg, #333, #666)',
      emoji: req.body.emoji || '🎵',
      coverUrl,
    })

    res.status(201).json({
      message: 'Album created successfully',
      album: {
        title: album.title,
        artist: album.artist,
        color: album.color,
        emoji: album.emoji,
        coverUrl: album.coverUrl,
        songCount: 0,
      },
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
})

router.post('/add', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can add songs' })

    const { title, artist, album, duration, genre, coverUrl, audioUrl, emoji, color, likes } = req.body
    if (!title || !artist) return res.status(400).json({ message: 'Title and artist are required' })

    const song = await Song.create({ title, artist, album, duration, genre, coverUrl, audioUrl, emoji, color, likes })
    await syncAlbumRecord({ title: album, artist, color, emoji, coverUrl })

    res.status(201).json({ message: 'Song added successfully', song })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post(
  '/upload',
  authMiddleware,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can upload songs' })

      const { title, artist, album, duration, genre, emoji, color } = req.body
      if (!title || !artist) return res.status(400).json({ message: 'Title aur artist zaroori hain!' })

      const audioFile = req.files?.audio?.[0]
      const coverFile = req.files?.cover?.[0]
      if (!audioFile) return res.status(400).json({ message: 'Audio file zaroori hai!' })

      ensureNonEmptyUpload(audioFile, 'Audio')
      ensureNonEmptyUpload(coverFile, 'Cover')

      const albumTitle = album?.trim() || ''
      const existingAlbum = albumTitle ? await Album.findOne({ title: albumTitle }) : null
      const finalCoverUrl = coverFile ? buildMediaUrl(req, title, coverFile.filename) : existingAlbum?.coverUrl || ''

      const song = await Song.create({
        title,
        artist,
        album: albumTitle,
        duration,
        genre,
        emoji,
        color,
        audioUrl: buildMediaUrl(req, title, audioFile.filename),
        coverUrl: finalCoverUrl,
      })

      await syncAlbumRecord({
        title: albumTitle,
        artist: existingAlbum?.artist || artist,
        color: existingAlbum?.color || color,
        emoji: existingAlbum?.emoji || emoji,
        coverUrl: finalCoverUrl,
      })

      res.status(201).json({ message: 'Song uploaded successfully!', song })
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message })
    }
  }
)

router.put(
  '/:id/media',
  authMiddleware,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can update media' })

      const song = await Song.findById(req.params.id)
      if (!song) return res.status(404).json({ message: 'Song not found' })

      const audioFile = req.files?.audio?.[0]
      const coverFile = req.files?.cover?.[0]
      if (!audioFile && !coverFile) return res.status(400).json({ message: 'Audio ya cover file select karo' })

      ensureNonEmptyUpload(audioFile, 'Audio')
      ensureNonEmptyUpload(coverFile, 'Cover')

      if (audioFile) {
        song.audioUrl = buildMediaUrl(req, song.title, audioFile.filename)
      }

      if (coverFile) {
        const coverUrl = buildMediaUrl(req, song.title, coverFile.filename)
        song.coverUrl = coverUrl
        await Song.updateMany({ album: song.album }, { $set: { coverUrl } })
        await syncAlbumRecord({
          title: song.album,
          artist: song.artist,
          color: song.color,
          emoji: song.emoji,
          coverUrl,
        })
      }

      await song.save()
      res.json({ message: 'Song media updated successfully', song })
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message })
    }
  }
)

router.post('/albums/:album/cover', authMiddleware, upload.single('cover'), async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can update album cover' })

    const albumName = decodeURIComponent(req.params.album)
    if (!req.file) return res.status(400).json({ message: 'Cover image is required' })
    ensureNonEmptyUpload(req.file, 'Cover')

    const [existingAlbum, firstSong] = await Promise.all([Album.findOne({ title: albumName }), Song.findOne({ album: albumName })])
    if (!existingAlbum && !firstSong) return res.status(404).json({ message: 'Album not found' })

    const coverUrl = buildMediaUrl(req, req.body.title || albumName, req.file.filename)

    await Promise.all([
      Song.updateMany({ album: albumName }, { $set: { coverUrl } }),
      Album.findOneAndUpdate(
        { title: albumName },
        {
          $set: {
            coverUrl,
            artist: existingAlbum?.artist || firstSong?.artist || '',
            color: existingAlbum?.color || firstSong?.color || 'linear-gradient(135deg, #333, #666)',
            emoji: existingAlbum?.emoji || firstSong?.emoji || '🎵',
          },
          $setOnInsert: { title: albumName },
        },
        { upsert: true, new: true }
      ),
    ])

    res.json({ message: 'Album cover updated successfully', album: albumName, coverUrl })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
})

router.put('/albums/:album', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can rename albums' })

    const currentAlbum = decodeURIComponent(req.params.album)
    const nextAlbum = req.body.album?.trim()
    if (!nextAlbum) return res.status(400).json({ message: 'New album name is required' })

    if (currentAlbum !== nextAlbum) {
      const [duplicateAlbum, duplicateSongs] = await Promise.all([Album.findOne({ title: nextAlbum }), Song.exists({ album: nextAlbum })])
      if (duplicateAlbum || duplicateSongs) return res.status(409).json({ message: 'Album with this name already exists' })
    }

    const [storedAlbum, firstSong] = await Promise.all([Album.findOne({ title: currentAlbum }), Song.findOne({ album: currentAlbum })])
    if (!storedAlbum && !firstSong) return res.status(404).json({ message: 'Album not found' })

    await Promise.all([
      Song.updateMany({ album: currentAlbum }, { $set: { album: nextAlbum } }),
      Album.findOneAndUpdate({ title: currentAlbum }, { $set: { title: nextAlbum } }, { new: true }),
    ])

    res.json({ message: 'Album renamed successfully', album: nextAlbum })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can update songs' })

    const song = await Song.findById(req.params.id)
    if (!song) return res.status(404).json({ message: 'Song not found' })

    const fields = ['title', 'artist', 'album', 'duration', 'genre', 'emoji', 'color']
    fields.forEach((field) => {
      if (typeof req.body[field] === 'string') song[field] = req.body[field]
    })

    await song.save()
    await syncAlbumRecord({ title: song.album, artist: song.artist, color: song.color, emoji: song.emoji, coverUrl: song.coverUrl })

    res.json({ message: 'Song updated successfully', song })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Only admins can delete songs' })

    const song = await Song.findById(req.params.id)
    if (!song) return res.status(404).json({ message: 'Song not found' })

    await Song.deleteOne({ _id: req.params.id })
    await User.updateMany({}, { $pull: { likedSongs: req.params.id } })

    res.json({ message: 'Song deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
