import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Camera } from 'lucide-react'
import AuthCard from '../components/AuthCard'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatar, setAvatar] = useState('')

  const handlePhoto = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 3 * 1024 * 1024) {
      setMessage('Choose an image smaller than 3 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.onerror = () => setMessage('Could not read this image.')
    reader.readAsDataURL(file)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: formData.fullName, email: formData.email, password: formData.password, avatar }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Registration failed.')
      navigate('/login', { state: { message: 'Account created. Please sign in.' } })
    } catch (error) {
      setMessage(error.message || 'Could not connect to the server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join our community today"
      dividerText="or sign up with"
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkTo="/login"
      blobPosition="bottom-right"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#DCE0EC] p-3 text-sm text-[#3A3D54]">
          {avatar ? <img src={avatar} alt="Profile preview" className="h-10 w-10 rounded-full object-cover" /> : <Camera className="h-5 w-5 text-[#6C3CE9]" />}
          <span>{avatar ? 'Change profile photo' : 'Upload profile photo (optional)'}</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(e) => handlePhoto(e.target.files?.[0])} />
        </label>
        {/* Full Name */}
        <div className="relative flex items-center">
          <User className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-[#686C85]" />
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="h-11 w-full rounded-xl border border-[#DCE0EC] bg-white pl-10.5 pr-4 text-[14px] text-[#141526] placeholder-[#9BA0B8] outline-none transition focus:border-[#6C3CE9]"
          />
        </div>

        {/* Email Address */}
        <div className="relative flex items-center">
          <Mail className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-[#686C85]" />
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="h-11 w-full rounded-xl border border-[#DCE0EC] bg-white pl-10.5 pr-4 text-[14px] text-[#141526] placeholder-[#9BA0B8] outline-none transition focus:border-[#6C3CE9]"
          />
        </div>

        {/* Password */}
        <div className="relative flex items-center">
          <Lock className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-[#686C85]" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="h-11 w-full rounded-xl border border-[#DCE0EC] bg-white pl-10.5 pr-11 text-[14px] text-[#141526] placeholder-[#9BA0B8] outline-none transition focus:border-[#6C3CE9]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 text-[#7A7D96] hover:text-[#141526] cursor-pointer"
          >
            {showPassword ? (
              <Eye className="h-[18px] w-[18px]" />
            ) : (
              <EyeOff className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative flex items-center">
          <Lock className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-[#686C85]" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="h-11 w-full rounded-xl border border-[#DCE0EC] bg-white pl-10.5 pr-11 text-[14px] text-[#141526] placeholder-[#9BA0B8] outline-none transition focus:border-[#6C3CE9]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            className="absolute right-3.5 text-[#7A7D96] hover:text-[#141526] cursor-pointer"
          >
            {showConfirmPassword ? (
              <Eye className="h-[18px] w-[18px]" />
            ) : (
              <EyeOff className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="mt-1.5 flex h-11.5 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5D35E8] to-[#7448F5] text-[14.5px] font-semibold text-white shadow-[0_8px_20px_rgba(108,60,233,0.3)] transition hover:opacity-95 active:scale-[0.99] cursor-pointer"
        >
          <UserPlus className="h-[18px] w-[18px]" />
          <span>{isSubmitting ? 'Please wait...' : 'Sign Up'}</span>
        </button>
      </form>
    </AuthCard>
  )
}
