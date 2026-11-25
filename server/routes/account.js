import { Router } from 'express'
import User from '../models/User.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

function serializeUser(user) {
  return {
    id: String(user._id),
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

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ user: serializeUser(user) })
  } catch (error) {
    console.error('Load profile error:', error)
    return res.status(500).json({ message: 'Unable to load your profile.' })
  }
})

router.patch('/me', async (req, res) => {
  try {
    const updates = {}
    const { fullName, email, avatar, bio, phone, location, settings } = req.body

    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || !fullName.trim()) {
        return res.status(400).json({ message: 'Name cannot be empty.' })
      }
      updates.fullName = fullName.trim()
    }
    if (email !== undefined) {
      if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
        return res.status(400).json({ message: 'Please enter a valid email address.' })
      }
      updates.email = email.trim().toLowerCase()
    }
    for (const field of ['bio', 'phone', 'location']) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== 'string' || req.body[field].length > 500) {
          return res.status(400).json({ message: `Invalid ${field}.` })
        }
        updates[field] = req.body[field].trim()
      }
    }
    if (avatar !== undefined) {
      if (avatar !== '' && !isValidAvatar(avatar)) {
        return res.status(400).json({ message: 'Please upload a valid image up to 3 MB.' })
      }
      updates.avatar = avatar
    }
    if (settings !== undefined) {
      if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
        return res.status(400).json({ message: 'Invalid settings.' })
      }
      if (settings.theme !== undefined) {
        if (!['light', 'dark'].includes(settings.theme)) return res.status(400).json({ message: 'Invalid theme.' })
        updates['settings.theme'] = settings.theme
      }
      for (const setting of ['onlineStatus', 'readReceipts']) {
        if (settings[setting] !== undefined) {
          if (typeof settings[setting] !== 'boolean') return res.status(400).json({ message: `Invalid ${setting} setting.` })
          updates[`settings.${setting}`] = settings[setting]
        }
      }
    }

    const user = await User.findByIdAndUpdate(req.userId, { $set: updates }, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ message: 'Profile saved.', user: serializeUser(user) })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'That email is already in use.' })
    console.error('Save profile error:', error)
    return res.status(500).json({ message: 'Unable to save your changes.' })
  }
})

export default router
