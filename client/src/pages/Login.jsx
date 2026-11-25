import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, Check, Camera } from 'lucide-react'
import AuthCard from '../components/AuthCard'
import { apiUrl, readApiResponse } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState(location.state?.message || '')
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
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsSubmitting(true)
    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, ...(avatar ? { avatar } : {}) }),
      })
      const result = await readApiResponse(response)
      if (!response.ok) throw new Error(result.message || 'Login failed.')
      localStorage.setItem('chatUser', JSON.stringify({ id: result.user.id, fullName: result.user.fullName, email: result.user.email }))
      localStorage.setItem('chatToken', result.token)
      navigate('/dashboard')
    } catch (error) {
      setMessage(error.message || 'Could not connect to the server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Welcome Back!"
      subtitle="Sign in to your account"
      dividerText="or continue with"
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkTo="/register"
      blobPosition="top-left"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#DCE0EC] p-3 text-sm text-[#3A3D54]">
          {avatar ? <img src={avatar} alt="Profile preview" className="h-9 w-9 rounded-full object-cover" /> : <Camera className="h-5 w-5 text-[#6C3CE9]" />}
          <span>{avatar ? 'Change profile photo' : 'Update profile photo (optional)'}</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(e) => handlePhoto(e.target.files?.[0])} />
        </label>
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

        <div className="relative flex items-center">
          <Lock className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-[#686C85]" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
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
            {showPassword ? <Eye className="h-[18px] w-[18px]" /> : <EyeOff className="h-[18px] w-[18px]" />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-0.5 text-[12.5px]">
          <label className="flex items-center gap-2 select-none cursor-pointer text-[#3A3D54]">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="peer sr-only"
            />
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-[4px] border border-[#C7CCE0] bg-white text-white transition peer-checked:border-[#6C3CE9] peer-checked:bg-[#6C3CE9]">
              {formData.rememberMe && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </span>
            <span>Remember me</span>
          </label>

          <Link to="/forgot-password" className="font-medium text-[#6C3CE9] hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="mt-1 flex h-11.5 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5D35E8] to-[#7448F5] text-[14.5px] font-semibold text-white shadow-[0_8px_20px_rgba(108,60,233,0.3)] transition hover:opacity-95 active:scale-[0.99] cursor-pointer"
        >
          <LogIn className="h-[18px] w-[18px]" />
          <span>{isSubmitting ? 'Please wait...' : 'Sign In'}</span>
        </button>
      </form>
    </AuthCard>
  )
}
