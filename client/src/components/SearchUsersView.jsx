import { Search, MessageCircle, UserPlus, Check } from 'lucide-react'
import { useState } from 'react'

export default function SearchUsersView({
  users,
  searchQuery,
  setSearchQuery,
  onStartChat,
}) {
  const [filter, setFilter] = useState('all')
  const [sentRequests, setSentRequests] = useState({})

  const filteredUsers = users.filter((u) => {
    const matchesText =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    if (filter === 'online') return matchesText && u.online
    return matchesText
  })

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F8FD] p-7">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-[#141526]">Search Users</h2>
            <p className="mt-0.5 text-[13.5px] text-[#6B6E88]">
              Find people and start a real-time conversation
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 rounded-xl bg-white p-1 border border-[#E5E7F2]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#6C3CE9] text-white'
                  : 'text-[#6B6E88] hover:text-[#141526]'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('online')}
              className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition cursor-pointer ${
                filter === 'online'
                  ? 'bg-[#6C3CE9] text-white'
                  : 'text-[#6B6E88] hover:text-[#141526]'
              }`}
            >
              Online ({users.filter((u) => u.online).length})
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A7D96]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="h-12 w-full rounded-2xl border border-[#E5E7F2] bg-white pl-12 pr-4 text-[14px] text-[#141526] placeholder-[#8A8EA6] shadow-xs outline-none focus:border-[#6C3CE9]"
          />
        </div>

        {/* User Cards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((person) => {
            const isConnected = sentRequests[person.id]
            return (
              <div
                key={person.id}
                className="flex flex-col justify-between rounded-2xl border border-[#ECEEF6] bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    {person.showOnlineStatus && <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        person.online ? 'bg-[#22C55E]' : 'bg-gray-400'
                      }`}
                    />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15.5px] font-bold text-[#141526]">
                      {person.name}
                    </h3>
                    <p className="truncate text-[12.5px] font-medium text-[#6C3CE9]">
                      {person.role}
                    </p>
                    <p className="truncate text-[12px] text-[#8A8EA6]">{person.email}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onStartChat(person)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#5D35E8] to-[#7448F5] py-2.5 text-[13px] font-semibold text-white transition hover:opacity-95 cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSentRequests((prev) => ({ ...prev, [person.id]: !prev[person.id] }))
                    }
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border transition cursor-pointer ${
                      isConnected
                        ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]'
                        : 'border-[#DCE0EC] bg-white text-[#3A3D54] hover:bg-[#F5F6FB]'
                    }`}
                    title={isConnected ? 'Connected' : 'Add Friend'}
                  >
                    {isConnected ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
