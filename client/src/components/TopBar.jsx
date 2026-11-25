import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react'

export default function TopBar({
  searchQuery,
  setSearchQuery,
  user,
  darkMode,
  onToggleTheme,
  onOpenSearchTab,
  onOpenProfileTab,
}) {
  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#ECEEF6] bg-white px-6">
      {/* Search Input */}
      <div className="relative w-full max-w-[440px]">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7D96]" />
        <input
          type="text"
          value={searchQuery}
          onFocus={onOpenSearchTab}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            onOpenSearchTab()
          }}
          placeholder="Search for users..."
          className="h-10 w-full rounded-xl bg-[#F3F4F9] pl-10 pr-4 text-[13.5px] text-[#141526] placeholder-[#8A8EA6] outline-none transition focus:ring-2 focus:ring-[#6C3CE9]/30"
        />
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-3.5">
        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F6FB] text-[#2B2E44] transition hover:bg-[#ECEEF8] cursor-pointer"
        >
          <Bell className="h-[19px] w-[19px]" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white">
            2
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F6FB] text-[#F59E0B] transition hover:bg-[#ECEEF8] cursor-pointer"
          aria-label="Toggle theme"
        >
          {darkMode ? <Moon className="h-[19px] w-[19px] text-[#6C3CE9]" /> : <Sun className="h-[19px] w-[19px]" />}
        </button>

        {/* User Avatar Dropdown */}
        <button
          type="button"
          onClick={onOpenProfileTab}
          className="flex items-center gap-1.5 rounded-full p-1 transition hover:bg-[#F5F6FB] cursor-pointer"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover"
          />
          <ChevronDown className="h-4 w-4 text-[#5F627A]" />
        </button>
      </div>
    </header>
  )
}
