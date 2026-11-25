import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    settings: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      onlineStatus: { type: Boolean, default: true },
      readReceipts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
