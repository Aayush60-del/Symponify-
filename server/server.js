const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const connectDB = require('./config/db')

const app = express()
connectDB()
app.set('trust proxy', 1)

const mediaRoot = path.join(__dirname, 'public/songs')
const legacyMediaRoot = path.join(__dirname, '../Songs')
const legacyMediaAliases = {
  'ambarsaria/cover.webp': path.join(legacyMediaRoot, 'Ambarsaria Lyrics Navaan Sandhu ft Homeboy Kaater The Finest 2024.webp'),
  'ambarsaria/audio.mp3': path.join(legacyMediaRoot, 'Ambarsaria - Navaan Sandhu.mp3'),
  'billi jeans/cover.webp': path.join(mediaRoot, 'Billie Jean', 'cover.webp'),
  'billi jeans/audio.mp3': path.join(mediaRoot, 'Billie Jean', 'audio.mp3'),
}

const resolveCaseInsensitivePath = (rootDir, relativePath) => {
  const cleanSegments = relativePath.split('/').filter(Boolean)
  let currentDir = rootDir

  for (const segment of cleanSegments) {
    if (!fs.existsSync(currentDir) || !fs.statSync(currentDir).isDirectory()) return ''

    const nextEntry = fs.readdirSync(currentDir).find((entry) => entry.toLowerCase() === segment.toLowerCase())
    if (!nextEntry) return ''

    currentDir = path.join(currentDir, nextEntry)
  }

  return currentDir
}

const tryServeLegacyMedia = (req, res, next) => {
  const requestedPath = req.path.replace(/^\/+/, '')
  const aliasPath = legacyMediaAliases[requestedPath.toLowerCase()]

  if (aliasPath && fs.existsSync(aliasPath)) {
    res.sendFile(aliasPath)
    return
  }

  const resolvedPath = resolveCaseInsensitivePath(mediaRoot, requestedPath)
  if (resolvedPath && fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    res.sendFile(resolvedPath)
    return
  }

  next()
}

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('CORS blocked for this origin'))
    },
    credentials: true,
  })
)
app.use(express.json())
app.get("/", (req, res) => {
  res.send("Symponify Backend Running 🚀")
})
app.use('/songs', express.static(mediaRoot))
app.use('/songs', tryServeLegacyMedia)



app.get('/api/health', (_, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/songs', require('./routes/songs'))
app.use('/api/playlists', require('./routes/playlists'))

app.use((err, _req, res, _next) => {
  console.error(err)
  const status = err.status || err.statusCode || (err.name === 'MulterError' ? 400 : 500)
  res.status(status).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Symponify server running on port ${PORT}`)
})
