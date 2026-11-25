import { Router } from 'express'
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import User from '../models/User.js'
import Session from '../models/Session.js'

const router = Router()
const scrypt = promisify(scryptCallback)

async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const derivedKey = await scrypt(password, salt, 64)
  return { salt, hash: derivedKey.toString('hex') }
}

function publicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar || '',
    bio: user.bio || '',
    phone: user.phone || '',
    location: user.location || '',
    settings: {
      theme: user.settings?.theme || 'light',
      onlineStatus: user.settings?.onlineStatus !== false,
      readReceipts: user.settings?.readReceipts !== false,
    },
  }
}

function isValidAvatar(avatar) {
  return typeof avatar === 'string' && avatar.length <= 4_500_000 &&
    /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(avatar)
}

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, avatar } = req.body
    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields.' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }
    if (avatar && !isValidAvatar(avatar)) {
      return res.status(400).json({ message: 'Please upload a valid image up to 3 MB.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const { salt, hash } = await hashPassword(password)
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: `${salt}:${hash}`,
      ...(avatar ? { avatar } : {}),
    })
    return res.status(201).json({ message: 'Account created successfully.', user: publicUser(user) })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }
    console.error('Registration error:', error)
    return res.status(500).json({ message: 'Unable to create your account right now.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash')
    if (!user) return res.status(401).json({ message: 'Email or password is incorrect.' })

    const [salt, savedHash] = user.passwordHash.split(':')
    const { hash } = await hashPassword(password, salt)
    const saved = Buffer.from(savedHash, 'hex')
    const supplied = Buffer.from(hash, 'hex')
    if (saved.length !== supplied.length || !timingSafeEqual(saved, supplied)) {
      return res.status(401).json({ message: 'Email or password is incorrect.' })
    }

    if (req.body.avatar) {
      if (!isValidAvatar(req.body.avatar)) return res.status(400).json({ message: 'Please upload a valid image up to 3 MB.' })
      user.avatar = req.body.avatar
      await user.save()
    }

    const token = randomBytes(32).toString('hex')
    await Session.create({
      user: user._id,
      tokenHash: createHash('sha256').update(token).digest('hex'),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastActive: new Date(),
    })
    return res.json({ message: 'Login successful.', user: publicUser(user), token })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Unable to log in right now.' })
  }
})

export default router
