import {
  MessageSquare,
  Search,
  User,
  Settings,
  LogOut,
  Send,
  Heart,
  ChevronRight,
} from 'lucide-react'

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'search', label: 'Search Users', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col justify-between bg-gradient-to-b from-[#231B54] via-[#1C1645] to-[#171238] px-3.5 py-6 text-white select-none">
      {/* Top Logo & Nav */}
      <div>
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-inner">
            <svg width="42" height="36" viewBox="0 0 88 72" fill="none">
              <path
                d="M12 36C12 24.9543 21.8497 16 34 16C46.1503 16 56 24.9543 56 36C56 47.0457 46.1503 56 34 56C30.4 56 27.01 55.22 23.98 53.83L13.5 57.5L16.4 48.1C13.64 44.74 12 40.55 12 36Z"
                fill="#5A9CF8"
              />
              <path
                d="M32 31C32 18.8497 42.3007 9 55 9C67.6993 9 78 18.8497 78 31C78 43.1503 67.6993 53 55 53C51.1 53 47.43 52.09 44.18 50.47L33 54.5L36.1 44.4C33.52 40.66 32 36.02 32 31Z"
                fill="#7C52F6"
              />
              <circle cx="46.5" cy="31" r="2.8" fill="#FFFFFF" />
              <circle cx="55" cy="31" r="2.8" fill="#FFFFFF" />
              <circle cx="63.5" cy="31" r="2.8" fill="#FFFFFF" />
            </svg>
          </div>
          <h1 className="mt-2.5 text-[21px] font-bold tracking-tight text-white">
            ChatApp
          </h1>
          <p className="mt-0.5 text-[10.5px] text-[#A8A3D1]">
            Chat &bull; Connect &bull; Share
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-7 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#5D35E8] to-[#7448F5] text-white shadow-[0_6px_18px_rgba(108,60,233,0.45)]'
                    : 'text-[#C8C4E8] hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </button>
            )
          })}

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] font-medium text-[#C8C4E8] transition hover:bg-red-500/15 hover:text-red-300 cursor-pointer"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Bottom Stay Connected Card & User Footer */}
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-white/5 px-3 py-4 text-center border border-white/10">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#6C3CE9]/30 text-[#A78BFA]">
            <Send className="h-5 w-5 -rotate-12" />
          </div>
          <h3 className="mt-2.5 text-[13px] font-semibold text-white">
            Stay Connected
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[#A8A3D1]">
            Chat with your friends anytime!
          </p>
          <Heart className="mx-auto mt-2.5 h-4 w-4 fill-[#D8D4F8] text-[#D8D4F8]" />
        </div>

        {/* Logged-in User Pill */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className="flex w-full items-center justify-between rounded-xl border-t border-white/10 pt-3 text-left transition hover:opacity-90 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#6C3CE9]"
              />
              {user.settings?.onlineStatus !== false && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#171238] bg-[#22C55E]" />}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white leading-tight">
                {user.name}
              </p>
              {user.settings?.onlineStatus !== false && <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#A8A3D1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" /> Online
              </p>}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#A8A3D1]" />
        </button>
      </div>
    </aside>
  )
}
