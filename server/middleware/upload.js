const path = require('path')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { cloudinary, ensureCloudinaryConfigured } = require('../config/cloudinary')
const { sanitizeSongTitle } = require('../utils/validation')

/**
 * Determines the folder path in Cloudinary based on the file type.
 * Audio files go to symponify/audio, images go to symponify/covers.
 * @param {Object} file - Multer file object
 * @returns {string} Cloudinary folder path
 */
const getUploadFolder = (file) => {
  if (file.fieldname === 'audio') return 'symponify/audio'
  return 'symponify/covers'
}

/**
 * Cloudinary storage configuration for Multer.
 * Uploads files directly to Cloudinary with proper public IDs and resource types.
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    ensureCloudinaryConfigured()

    const title = sanitizeSongTitle(req.body.title || 'untitled')
    const suffix = file.fieldname === 'audio' ? 'audio' : 'cover'

    return {
      folder: getUploadFolder(file),
      // Public ID format: {title}-{type}-{timestamp} for uniqueness
      public_id: `${title}-${suffix}-${Date.now()}`,
      // Use 'auto' for audio files to automatically detect format
      resource_type: 'auto',
      use_filename: false,
      unique_filename: true,
      overwrite: false,
    }
  },
})

/**
 * Validates file types based on field name.
 * Audio: MP3, WAV, OGG, M4A
 * Images: JPG, PNG, WEBP
 * @param {Object} req - Express request
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
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

/**
 * Multer instance configured for Cloudinary upload.
 * Handles both audio files (up to 50MB) and image files (up to 50MB).
 * Files are stored on Cloudinary, not on the local filesystem.
 */
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
})

