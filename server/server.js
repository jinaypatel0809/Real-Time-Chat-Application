import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import accountRoutes from './routes/account.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/account', accountRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Chat Application API is running...' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
