import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import SearchUsersView from '../components/SearchUsersView'
import ProfileView from '../components/ProfileView'
import SettingsView from '../components/SettingsView'
import { currentUser } from '../data/mockData'
import { apiUrl, readApiResponse } from '../api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('chats')
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(sessionStorage.getItem('chatUser') || 'null')
    return savedUser ? { ...currentUser, id: savedUser.id, name: savedUser.fullName, email: savedUser.email } : currentUser
  })
  const [chats, setChats] = useState([])
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [settings, setSettings] = useState({ theme: 'light', onlineStatus: true, readReceipts: true })

  const apiFetch = useCallback((url, options = {}) => fetch(apiUrl(url), {
    ...options,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('chatToken') || ''}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  }), [])

  const loadUsers = useCallback(async () => {
    const response = await apiFetch('/api/chat/users')
    if (response.status === 401) {
      sessionStorage.removeItem('chatUser')
      sessionStorage.removeItem('chatToken')
      navigate('/login')
      return
    }
    const result = await readApiResponse(response)
    if (!response.ok) throw new Error(result.message || 'Unable to load users.')
    setChats(result.users)
    setSelectedChatId((selectedId) => selectedId || result.users[0]?.id || null)
  }, [apiFetch, navigate])

  useEffect(() => {
    apiFetch('/api/account/me')
      .then(async (response) => {
        if (response.status === 401) throw new Error('Your session expired. Please sign in again.')
        const result = await readApiResponse(response)
        if (!response.ok) throw new Error(result.message || 'Unable to load your account.')
        const account = result.user
        setUser((previous) => ({
          ...previous,
          id: account.id,
          name: account.fullName,
          email: account.email,
          avatar: account.avatar || previous.avatar,
          bio: account.bio,
          phone: account.phone,
          location: account.location,
          settings: account.settings,
        }))
        setSettings(account.settings)
        setDarkMode(account.settings.theme === 'dark')
        document.documentElement.dataset.theme = account.settings.theme
      })
      .catch((error) => {
        console.error(error)
        if (error.message.includes('session expired')) {
          sessionStorage.removeItem('chatUser')
          sessionStorage.removeItem('chatToken')
          navigate('/login')
        }
      })
  }, [apiFetch, navigate])

  useEffect(() => {
    loadUsers().catch((error) => console.error(error))
    const interval = window.setInterval(() => loadUsers().catch((error) => console.error(error)), 5000)
    return () => window.clearInterval(interval)
  }, [loadUsers])

  useEffect(() => {
    if (!selectedChatId || activeTab !== 'chats') return undefined
    let active = true
    const loadMessages = async () => {
      try {
        const response = await apiFetch(`/api/chat/messages/${selectedChatId}`)
        if (response.status === 401) {
          sessionStorage.removeItem('chatUser')
          sessionStorage.removeItem('chatToken')
          navigate('/login')
          return
        }
        const result = await readApiResponse(response)
        if (!response.ok) throw new Error(result.message || 'Unable to load messages.')
        if (active) {
          setChats((current) => current.map((chat) =>
            chat.id === selectedChatId ? { ...chat, messages: result.messages } : chat
          ))
        }
      } catch (error) {
        console.error(error)
      }
    }
    loadMessages()
    const interval = window.setInterval(loadMessages, 2500)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [activeTab, apiFetch, navigate, selectedChatId])

  const selectedChat = chats.find((c) => c.id === selectedChatId)

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId)
    setActiveTab('chats')
  }

  const handleSendMessage = async (chatId, text) => {
    const response = await apiFetch(`/api/chat/messages/${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    const result = await readApiResponse(response)
    if (!response.ok) throw new Error(result.message || 'Unable to send message.')
    setChats((prev) => prev.map((chat) => chat.id === chatId
      ? {
          ...chat,
          lastMessage: result.message.text,
          lastTime: result.message.time,
          messages: [...chat.messages, result.message],
        }
      : chat
    ))
    loadUsers().catch((error) => console.error(error))
  }

  const handleStartChatFromSearch = (person) => {
    setSelectedChatId(person.id)
    setActiveTab('chats')
  }

  const saveProfile = async (form) => {
    const response = await apiFetch('/api/account/me', {
      method: 'PATCH',
      body: JSON.stringify({
        fullName: form.name,
        email: form.email,
        bio: form.bio,
        phone: form.phone,
        location: form.location,
        ...(form.avatar?.startsWith('data:image/') ? { avatar: form.avatar } : {}),
      }),
    })
    const result = await readApiResponse(response)
    if (!response.ok) throw new Error(result.message || 'Unable to save profile.')
    const account = result.user
    const nextUser = {
      ...user,
      id: account.id,
      name: account.fullName,
      email: account.email,
      avatar: account.avatar || user.avatar,
      bio: account.bio,
      phone: account.phone,
      location: account.location,
      settings: account.settings,
    }
    setUser(nextUser)
    sessionStorage.setItem('chatUser', JSON.stringify({ id: account.id, fullName: account.fullName, email: account.email }))
  }

  const saveSettings = async (changes) => {
    const response = await apiFetch('/api/account/me', {
      method: 'PATCH',
      body: JSON.stringify({ settings: changes }),
    })
    const result = await readApiResponse(response)
    if (!response.ok) throw new Error(result.message || 'Unable to save settings.')
    const nextSettings = result.user.settings
    setSettings(nextSettings)
    setUser((previous) => ({ ...previous, settings: nextSettings }))
    const isDark = nextSettings.theme === 'dark'
    setDarkMode(isDark)
    document.documentElement.dataset.theme = nextSettings.theme
  }

  const toggleTheme = () => saveSettings({ theme: darkMode ? 'light' : 'dark' }).catch((error) => console.error(error))

  const handleLogout = () => {
    sessionStorage.removeItem('chatUser')
    sessionStorage.removeItem('chatToken')
    document.documentElement.dataset.theme = 'light'
    navigate('/login')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#eef0ff]">
      {/* Fixed Left Purple Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Right Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onOpenSearchTab={() => setActiveTab('search')}
          onOpenProfileTab={() => setActiveTab('profile')}
        />

        {/* Dynamic Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {activeTab === 'chats' && (
            <>
              <ChatList
                chats={chats}
                selectedChatId={selectedChatId}
                onSelectChat={handleSelectChat}
                onNewChat={() => setActiveTab('search')}
              />
              <ChatWindow key={selectedChat?.id || 'empty-chat'} chat={selectedChat} onSendMessage={handleSendMessage} />
            </>
          )}

          {activeTab === 'search' && (
            <SearchUsersView
              users={chats}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onStartChat={handleStartChatFromSearch}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView user={user} onSaveProfile={saveProfile} />
          )}

          {activeTab === 'settings' && <SettingsView settings={settings} onSaveSettings={saveSettings} />}
        </div>
      </div>
    </div>
  )
}
