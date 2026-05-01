const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const connectDB = require('./config/db')

const app = express()
connectDB()
app.set('trust proxy', 1)

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
app.use('/songs', express.static(path.join(__dirname, 'public/songs')))

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
