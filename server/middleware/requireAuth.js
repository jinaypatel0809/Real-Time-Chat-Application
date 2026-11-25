import { createHash } from 'node:crypto'
import Session from '../models/Session.js'

export default async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.' })

    const tokenHash = createHash('sha256').update(token).digest('hex')
    const session = await Session.findOneAndUpdate(
      { tokenHash, expiresAt: { $gt: new Date() } },
      { lastActive: new Date() },
      { new: true }
    ).select('user')
    if (!session) return res.status(401).json({ message: 'Your session has expired. Please sign in again.' })
    req.userId = session.user
    return next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ message: 'Unable to verify your session.' })
  }
}
