import { useState } from 'react'
import {
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Send,
  CheckCheck,
} from 'lucide-react'

export default function ChatWindow({ chat, onSendMessage }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  if (!chat) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#F8F9FE] text-[#7A7D96]">
        Select a conversation to start messaging
      </div>
    )
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setError('')
    setSending(true)
    try {
      await onSendMessage(chat.id, text.trim())
      setText('')
    } catch (sendError) {
      setError(sendError.message || 'Unable to send message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F7F8FD]">
      {/* Chat Header */}
      <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-[#ECEEF6] bg-white px-6">
        <div className="flex items-center gap-3.5">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-[#141526]">{chat.name}</h3>
              {chat.showOnlineStatus && chat.online && <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />}
            </div>
            {chat.showOnlineStatus && <p className="text-[12.5px] text-[#6B6E88]">{chat.online ? 'Online' : 'Offline'}</p>}
          </div>
        </div>

        {/* Call & Options Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7F2] bg-white text-[#3A3D54] transition hover:bg-[#F5F6FB] cursor-pointer"
          >
            <Phone className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7F2] bg-white text-[#3A3D54] transition hover:bg-[#F5F6FB] cursor-pointer"
          >
            <Video className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7F2] bg-white text-[#3A3D54] transition hover:bg-[#F5F6FB] cursor-pointer"
          >
            <MoreVertical className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 space-y-4 overflow-y-auto px-6 py-5"
        style={{
          backgroundImage:
            'radial-gradient(#dcdff2 1px, transparent 1px), radial-gradient(#e4e6f6 1px, #f7f8fd 1px)',
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      >
        {/* Date Pill */}
        {chat.dateDivider && <div className="flex justify-center">
          <span className="rounded-full bg-[#E8EAF6] px-4 py-1 text-[12px] font-medium text-[#5A5E78]">
            {chat.dateDivider}
          </span>
        </div>}

        {chat.messages.map((msg) => {
          const isMe = msg.sender === 'me'
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}

              <div
                className={`flex max-w-[65%] items-end gap-2.5 rounded-2xl px-4 py-2.5 text-[14px] shadow-xs ${
                  isMe
                    ? 'rounded-br-sm bg-gradient-to-r from-[#5D35E8] to-[#7448F5] text-white'
                    : 'rounded-bl-sm bg-white text-[#141526]'
                }`}
              >
                <span>{msg.text}</span>
                <span
                  className={`flex shrink-0 items-center gap-1 text-[10.5px] ${
                    isMe ? 'text-white/80' : 'text-[#8A8EA6]'
                  }`}
                >
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <CheckCheck className={`h-3.5 w-3.5 ${msg.read ? 'text-sky-300' : ''}`} />}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Message Input Bar */}
      <form onSubmit={handleSend} className="bg-transparent px-6 pb-5 pt-2">
        {error && <p role="alert" className="mb-2 text-sm text-red-600">{error}</p>}
        <div className="flex h-[54px] items-center gap-3 rounded-2xl border border-[#E5E7F2] bg-white px-4 shadow-[0_6px_24px_rgba(20,21,38,0.05)]">
          <button
            type="button"
            className="text-[#686C85] hover:text-[#6C3CE9] cursor-pointer"
          >
            <Smile className="h-5 w-5" />
          </button>

          <input
            type="text"
            maxLength={5000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-[14px] text-[#141526] placeholder-[#8A8EA6] outline-none"
          />

          <button
            type="button"
            className="text-[#686C85] hover:text-[#6C3CE9] cursor-pointer"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="text-[#686C85] hover:text-[#6C3CE9] cursor-pointer"
          >
            <ImageIcon className="h-5 w-5" />
          </button>

          <button
            type="submit"
            disabled={sending}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#5D35E8] to-[#7448F5] text-white shadow-[0_4px_12px_rgba(108,60,233,0.35)] transition hover:opacity-95 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
