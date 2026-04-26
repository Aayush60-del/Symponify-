const router = require('express').Router()
const Playlist = require('../models/Playlist')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).populate('songs')
    res.json(playlists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, songs = [] } = req.body
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Folder name is required' })
    }

    const existing = await Playlist.findOne({ user: req.user.id, name: name.trim() })
    if (existing) {
      return res.status(400).json({ message: 'Folder already exists' })
    }

    const playlist = await Playlist.create({ name, songs, user: req.user.id })
    res.status(201).json(playlist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/:id/songs', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.body
    if (!songId) {
      return res.status(400).json({ message: 'Song id is required' })
    }

    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user.id })
    if (!playlist) {
      return res.status(404).json({ message: 'Folder not found' })
    }

    if (!playlist.songs.some((item) => item.toString() === songId)) {
      playlist.songs.push(songId)
      await playlist.save()
    }

    await playlist.populate('songs')
    res.json(playlist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
