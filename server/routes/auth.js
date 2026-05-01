const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const FIXED_ADMIN = {
  name: process.env.ADMIN_NAME || 'Symponify Admin',
  email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD || '',
}

const normalizeEmail = (value = '') => value.trim().toLowerCase()

const isFixedAdminConfigured = () => Boolean(FIXED_ADMIN.email && FIXED_ADMIN.password)
const isFixedAdminLogin = (email, password) => isFixedAdminConfigured() && normalizeEmail(email) === FIXED_ADMIN.email && password === FIXED_ADMIN.password

const createToken = (user, isAdminOverride = Boolean(user.isAdmin)) =>
  jwt.sign(
    {
      id: user._id,
      isAdmin: isAdminOverride,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

const serializeUser = (user, isAdminOverride = Boolean(user.isAdmin)) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: isAdminOverride,
})

const ensureFixedAdminUser = async () => {
  let user = await User.findOne({ email: FIXED_ADMIN.email })

  if (!user) {
    return User.create({
      name: FIXED_ADMIN.name,
      email: FIXED_ADMIN.email,
      password: FIXED_ADMIN.password,
      isAdmin: true,
    })
  }

  const passwordMatches = await bcrypt.compare(FIXED_ADMIN.password, user.password)

  user.name = FIXED_ADMIN.name
  user.isAdmin = true

  if (!passwordMatches) {
    user.password = FIXED_ADMIN.password
  }

  await user.save()
  return user
}

router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body
    const email = normalizeEmail(req.body.email)

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, isAdmin: false })
    const token = createToken(user, false)

    res.status(201).json({
      token,
      user: serializeUser(user, false),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body
    const email = normalizeEmail(req.body.email)
    const isFixedAdminAttempt = isFixedAdminLogin(email, password)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = isFixedAdminAttempt ? await ensureFixedAdminUser() : await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const matches = await bcrypt.compare(password, user.password)
    if (!matches) {
      return res.status(400).json({ message: 'Wrong password' })
    }

    const adminSession = isFixedAdminAttempt
    const token = createToken(user, adminSession)

    res.json({
      token,
      user: serializeUser(user, adminSession),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/make-admin', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email)

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOneAndUpdate({ email }, { isAdmin: isFixedAdminConfigured() && email === FIXED_ADMIN.email }, { new: true })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: user.isAdmin ? `${user.email} is now admin` : `${user.email} is not allowed admin access`,
      user: serializeUser(user, user.isAdmin),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/admin-access', async (req, res) => {
  try {
    const { password } = req.body
    const email = normalizeEmail(req.body.email)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (!isFixedAdminConfigured()) {
      return res.status(503).json({ message: 'Admin access is not configured on the server.' })
    }

    if (!isFixedAdminLogin(email, password)) {
      return res.status(403).json({ message: 'Access denied. Admin page is only available for the approved admin credentials.' })
    }

    const user = await ensureFixedAdminUser()
    const token = createToken(user, true)

    res.json({
      token,
      user: serializeUser(user, true),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
