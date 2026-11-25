import { useEffect, useState } from 'react'
import { Eye, Moon, Shield, Sun } from 'lucide-react'

export default function SettingsView({ settings, onSaveSettings }) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [values, setValues] = useState(settings)

  useEffect(() => setValues(settings), [settings])

  const update = async (changes) => {
    const next = { ...values, ...changes }
    setValues(next)
    setSaving(true)
    setMessage('')
    try {
      await onSaveSettings(changes)
      setMessage('Settings saved.')
    } catch (error) {
      setValues(values)
      setMessage(error.message || 'Unable to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const items = [
    { key: 'onlineStatus', title: 'Show Online Status', desc: 'Let other users see when you are online', icon: Shield },
    { key: 'readReceipts', title: 'Read Receipts', desc: 'Let senders know when you have read their messages', icon: Eye },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F8FD] p-7">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#ECEEF6] bg-white p-7 shadow-xs">
        <h2 className="text-[22px] font-bold text-[#141526]">Settings</h2>
        <p className="mt-0.5 text-[13.5px] text-[#6B6E88]">Choose your theme and privacy options</p>

        <section className="mt-6">
          <h3 className="text-[15px] font-semibold text-[#141526]">Theme</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[['light', 'Light', Sun], ['dark', 'Dark', Moon]].map(([theme, label, Icon]) => (
              <button
                key={theme}
                type="button"
                disabled={saving}
                onClick={() => values.theme !== theme && update({ theme })}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  values.theme === theme ? 'border-[#6C3CE9] bg-[#F3F0FF] text-[#6C3CE9]' : 'border-[#DCE0EC] text-[#3A3D54]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7 divide-y divide-[#ECEEF6] border-t border-[#ECEEF6]">
          {items.map((item) => {
            const Icon = item.icon
            const active = values[item.key]
            return (
              <div key={item.key} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6C3CE9]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[14.5px] font-semibold text-[#141526]">{item.title}</h4>
                    <p className="text-[12.5px] text-[#6B6E88]">{item.desc}</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  aria-label={item.title}
                  disabled={saving}
                  onClick={() => update({ [item.key]: !active })}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${active ? 'bg-[#6C3CE9]' : 'bg-[#D1D5E8]'}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${active ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            )
          })}
        </section>
        {message && <p role="status" className="mt-3 text-sm text-[#6C3CE9]">{message}</p>}
      </div>
    </div>
  )
}
