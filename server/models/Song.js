const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, default: '' },
    duration: { type: String, default: '' },
    genre: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    emoji: { type: String, default: '🎵' },
    color: { type: String, default: 'linear-gradient(135deg, #333, #666)' },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'Songs_col',
  }
)

module.exports = mongoose.model('Song', SongSchema)
