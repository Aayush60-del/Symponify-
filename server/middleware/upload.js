const fs = require('fs')
const path = require('path')
const multer = require('multer')

const sanitizeSongTitle = (value) => {
  const cleaned = value ? value.replace(/[^a-zA-Z0-9 ]/g, '').trim() : ''
  return cleaned || 'unknown'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const songTitle = sanitizeSongTitle(req.body.title)
    const dir = path.join(__dirname, '../public/songs', songTitle)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    cb(null, dir)
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, `audio${path.extname(file.originalname).toLowerCase()}`)
      return
    }

    cb(null, `cover${path.extname(file.originalname).toLowerCase()}`)
  },
})

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()

  if (file.fieldname === 'audio') {
    const allowedAudio = ['.mp3', '.wav', '.ogg', '.m4a']
    if (allowedAudio.includes(ext)) {
      cb(null, true)
      return
    }

    cb(new Error('Only MP3, WAV, OGG, and M4A audio files are allowed.'))
    return
  }

  const allowedImages = ['.jpg', '.jpeg', '.png', '.webp']
  if (allowedImages.includes(ext)) {
    cb(null, true)
    return
  }

  cb(new Error('Only JPG, PNG, and WEBP image files are allowed.'))
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
})
