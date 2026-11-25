import { useEffect, useState } from 'react'
import { Camera, Mail, Phone, MapPin, Check } from 'lucide-react'

export default function ProfileView({ user, onSaveProfile }) {
  const [form, setForm] = useState(user)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => setForm(user), [user])

  const handlePhoto = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 3 * 1024 * 1024) {
      setError('Choose an image smaller than 3 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, avatar: reader.result }))
    reader.onerror = () => setError('Could not read this image.')
    reader.readAsDataURL(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)
    try {
      await onSaveProfile(form)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2000)
    } catch (saveError) {
      setError(saveError.message || 'Unable to save profile changes.')
    } finally {
      setSaving(false)
    }
  }

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F8FD] p-7">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#ECEEF6] bg-white p-7 shadow-xs">
        <h2 className="text-[22px] font-bold text-[#141526]">My Profile</h2>
        <p className="mt-0.5 text-[13.5px] text-[#6B6E88]">Manage your personal information and status</p>

        <div className="mt-6 flex items-center gap-5 rounded-2xl bg-[#F4F2FF] p-5">
          <label className="relative cursor-pointer" title="Change profile photo">
            <img src={form.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&background=ece9fe&color=5d35e8`} alt={form.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-white" />
            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#6C3CE9] text-white shadow">
              <Camera className="h-3.5 w-3.5" />
            </span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(e) => handlePhoto(e.target.files?.[0])} />
          </label>
          <div>
            <h3 className="text-[18px] font-bold text-[#141526]">{form.name}</h3>
            <p className="text-[13px] text-[#6B6E88]">{form.email}</p>
            {user.settings?.onlineStatus && <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#22C55E]/15 px-3 py-0.5 text-[12px] font-medium text-[#16A34A]">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> Active Now
            </span>}
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-[#3A3D54]">Full Name</label>
            <input required type="text" value={form.name || ''} onChange={(e) => setField('name', e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-[#DCE0EC] px-4 text-[14px] outline-none focus:border-[#6C3CE9]" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-[#3A3D54]">Bio</label>
            <textarea rows="2" value={form.bio || ''} onChange={(e) => setField('bio', e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#DCE0EC] p-3.5 text-[14px] outline-none focus:border-[#6C3CE9]" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#3A3D54]"><Mail className="h-4 w-4 text-[#6C3CE9]" /> Email</label>
              <input required type="email" value={form.email || ''} onChange={(e) => setField('email', e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-[#DCE0EC] px-4 text-[14px] outline-none focus:border-[#6C3CE9]" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#3A3D54]"><Phone className="h-4 w-4 text-[#6C3CE9]" /> Phone</label>
              <input type="text" value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-[#DCE0EC] px-4 text-[14px] outline-none focus:border-[#6C3CE9]" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#3A3D54]"><MapPin className="h-4 w-4 text-[#6C3CE9]" /> Location</label>
            <input type="text" value={form.location || ''} onChange={(e) => setField('location', e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-[#DCE0EC] px-4 text-[14px] outline-none focus:border-[#6C3CE9]" />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="mt-2 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#5D35E8] to-[#7448F5] px-6 text-[14px] font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-60">
            {saved && <Check className="h-4 w-4" />}
            <span>{saving ? 'Saving...' : saved ? 'Profile Updated!' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
