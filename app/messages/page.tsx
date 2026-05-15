'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Send, Plus, MoreVertical, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: boolean
  image?: string
  online?: boolean
}

interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
  read: boolean
}

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [userType] = useState<'client' | 'freelancer'>('client')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      fetchConversations()
    }
  }, [authLoading, user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const userId = user?.id || ''
      const response = await fetch(`/api/messages?userId=${userId}`)
      const data = await response.json()
      
      if (data.success && data.conversations) {
        setConversations(data.conversations)
        if (data.conversations.length > 0) {
          setSelectedConversation(data.conversations[0].id)
        }
      } else {
        setConversations([])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const userId = user?.id || ''
      const response = await fetch(`/api/messages?userId=${userId}&conversationId=${conversationId}`)
      const data = await response.json()
      
      if (data.success && data.messages) {
        setMessages(data.messages)
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    }
  }

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      try {
        console.log('Sending message:', messageInput)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300))
        toast.success('Message sent successfully!')
        setMessageInput('')
      } catch (error) {
        toast.error('Failed to send message')
      }
    }
  }

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <DashboardLayout userType={userType} navItems={navItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
            <p className="text-slate-400">Connect and collaborate with your team</p>
          </div>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>

        {/* Main Chat Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-4 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${
                    selectedConversation === conv.id ? 'bg-slate-700 border-l-2 border-l-cyan-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {conv.name.charAt(0)}
                      </div>
                      {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-slate-800" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white text-sm">{conv.name}</h3>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {conv.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conv.unread ? 'text-white font-medium' : 'text-slate-400'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {conversations.find(c => c.id === selectedConversation)?.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {conversations.find(c => c.id === selectedConversation)?.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'You'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-cyan-100' : 'text-slate-500'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
