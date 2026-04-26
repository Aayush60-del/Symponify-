require('dotenv').config()

const mongoose = require('mongoose')
const Song = require('./models/Song')

const songs = [
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    genre: 'Pop',
    emoji: '🎸',
    color: 'linear-gradient(135deg, #ff5c35, #f0a500)',
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:23',
    genre: 'Pop',
    emoji: '🪩',
    color: 'linear-gradient(135deg, #1a3c5e, #4a90d9)',
  },
  {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: 'Divide',
    duration: '3:53',
    genre: 'Pop',
    emoji: '🔥',
    color: 'linear-gradient(135deg, #ff5c35, #ff8c00)',
  },
  {
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: '3:20',
    genre: 'Pop',
    emoji: '🌸',
    color: 'linear-gradient(135deg, #7b2d8b, #c77dff)',
  },
  {
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: '2:54',
    genre: 'Pop',
    emoji: '🍉',
    color: 'linear-gradient(135deg, #2d6a4f, #74c69d)',
  },
  {
    title: 'Midnight Jazz',
    artist: 'The Quartet',
    album: 'Jazz Nights',
    duration: '4:12',
    genre: 'Jazz',
    emoji: '🎺',
    color: 'linear-gradient(135deg, #1a1a1a, #555)',
  },
  {
    title: 'Neon Dreams',
    artist: 'RetroFuture',
    album: 'Electric Dreams',
    duration: '3:45',
    genre: 'Electronic',
    emoji: '🌌',
    color: 'linear-gradient(135deg, #0d1b3e, #3d1a6e)',
  },
  {
    title: 'Deep Sea',
    artist: 'Marina',
    album: 'Ocean',
    duration: '3:30',
    genre: 'Chill',
    emoji: '🌊',
    color: 'linear-gradient(135deg, #0d3b5e, #2196f3)',
  },
]

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Song.deleteMany({})
    await Song.insertMany(songs)
    console.log('Seeded songs successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
