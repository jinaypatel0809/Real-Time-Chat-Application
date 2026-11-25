import { SquarePen } from 'lucide-react'

export default function ChatList({ chats, selectedChatId, onSelectChat, onNewChat }) {
  const formatTime = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex h-full w-[310px] shrink-0 flex-col border-r border-[#ECEEF6] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h2 className="text-[20px] font-bold text-[#141526]">Messages</h2>
        <button
          type="button"
          onClick={onNewChat}
          title="Search Users"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#5D35E8] to-[#7448F5] text-white shadow-[0_4px_12px_rgba(108,60,233,0.3)] transition hover:opacity-95 cursor-pointer"
        >
          <SquarePen className="h-4 w-4" />
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {chats.map((chat) => {
          const isSelected = chat.id === selectedChatId
          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => onSelectChat(chat.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition cursor-pointer ${
                isSelected ? 'bg-[#ECE9FE]' : 'hover:bg-[#F7F8FC]'
              }`}
            >
              {/* Avatar with online indicator */}
              <div className="relative shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                {chat.showOnlineStatus && chat.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E]" />
                )}
              </div>

              {/* Name & Last Message */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate text-[14.5px] font-semibold text-[#141526]">
                      {chat.name}
                    </span>
                    {chat.showOnlineStatus && chat.online && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#22C55E]" />
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-[11.5px] ${
                      chat.unread > 0 ? 'font-semibold text-[#6C3CE9]' : 'text-[#8A8EA6]'
                    }`}
                  >
                    {formatTime(chat.lastTime)}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] text-[#6B6E88]">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6C3CE9] text-[11px] font-bold text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
