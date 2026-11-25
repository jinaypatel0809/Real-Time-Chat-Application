import { Router } from 'express'
import User from '../models/User.js'
import Message from '../models/Message.js'
import Session from '../models/Session.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

function serializeUser(user, latestMessage) {
  const lastMessage = latestMessage
    ? {
        text: latestMessage.text,
        time: latestMessage.createdAt,
        senderId: String(latestMessage.sender),
      }
    : null
  return {
    id: String(user._id),
    name: user.fullName,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=ece9fe&color=5d35e8`,
    role: 'Chat member',
    online: false,
    showOnlineStatus: user.settings?.onlineStatus !== false,
    lastMessage: lastMessage ? lastMessage.text : 'Start a new conversation',
    lastTime: lastMessage ? lastMessage.createdAt : '',
    lastSenderId: lastMessage ? String(latestMessage.sender) : null,
    unread: 0,
    dateDivider: '',
    messages: [],
  }
}

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select('fullName email avatar settings').sort({ fullName: 1 })
    const recentMessages = await Message.find({ $or: [{ sender: req.userId }, { recipient: req.userId }] })
      .sort({ createdAt: -1 })
      .select('sender recipient text createdAt')

    const latestByUser = new Map()
    for (const message of recentMessages) {
      const peerId = String(message.sender) === String(req.userId) ? String(message.recipient) : String(message.sender)
      if (!latestByUser.has(peerId)) latestByUser.set(peerId, message)
    }

    const onlineCutoff = new Date(Date.now() - 30_000)
    const onlineIds = await Session.distinct('user', {
      user: { $in: users.filter((user) => user.settings?.onlineStatus !== false).map((user) => user._id) },
      expiresAt: { $gt: new Date() },
      lastActive: { $gt: onlineCutoff },
    })
    const onlineSet = new Set(onlineIds.map(String))

    return res.json({ users: users.map((user) => ({
      ...serializeUser(user, latestByUser.get(String(user._id))),
      online: onlineSet.has(String(user._id)),
    })) })
  } catch (error) {
    console.error('Fetch users error:', error)
    return res.status(500).json({ message: 'Unable to load users.' })
  }
})

router.get('/messages/:userId', async (req, res) => {
  try {
    if (!await User.exists({ _id: req.params.userId })) {
      return res.status(404).json({ message: 'User not found.' })
    }
    const conversation = {
      $or: [
        { sender: req.userId, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.userId },
      ],
    }
    await Message.updateMany(
      { sender: req.params.userId, recipient: req.userId, readAt: null },
      { $set: { readAt: new Date() } }
    )
    const [messages, peer] = await Promise.all([
      Message.find(conversation).sort({ createdAt: 1 }),
      User.findById(req.params.userId).select('settings.readReceipts'),
    ])

    return res.json({ messages: messages.map((message) => ({
      id: String(message._id),
      sender: String(message.sender) === String(req.userId) ? 'me' : 'them',
      text: message.text,
      time: message.createdAt,
      read: String(message.sender) === String(req.userId) &&
        peer?.settings?.readReceipts !== false && Boolean(message.readAt),
    })) })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return res.status(500).json({ message: 'Unable to load this conversation.' })
  }
})

router.post('/messages/:userId', async (req, res) => {
  try {
    const text = req.body.text?.trim()
    if (!text) return res.status(400).json({ message: 'Message cannot be empty.' })
    if (text.length > 5000) return res.status(400).json({ message: 'Message must be 5000 characters or fewer.' })
    if (String(req.userId) === req.params.userId) return res.status(400).json({ message: 'You cannot message yourself.' })
    if (!await User.exists({ _id: req.params.userId })) return res.status(404).json({ message: 'User not found.' })

    const message = await Message.create({ sender: req.userId, recipient: req.params.userId, text })
    return res.status(201).json({ message: {
      id: String(message._id),
      sender: 'me',
      text: message.text,
      time: message.createdAt,
    } })
  } catch (error) {
    console.error('Send message error:', error)
    return res.status(500).json({ message: 'Unable to send your message.' })
  }
})

export default router
