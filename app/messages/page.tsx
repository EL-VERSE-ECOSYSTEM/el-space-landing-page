'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Send, Plus, MoreVertical, Clock, MessageCircle } from 'lucide-react'
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
    <DashboardLayout userType={user?.user_type || 'freelancer'} navItems={navItems}>
      <div className="space-y-8 text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">Comms <span className="text-primary">Nexus</span></h1>
            <p className="text-muted-foreground font-medium">Real-time strategic synchronization</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 uppercase tracking-widest text-xs transition-all">
            <Plus className="w-4 h-4 mr-2" />
            New Link
          </Button>
        </div>

        {/* Main Chat Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
          {/* Conversations List */}
          <div className="bg-card border border-border rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl shadow-black/5">
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Scan active links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-background border-border text-foreground rounded-2xl h-12 focus:ring-primary/20"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-6 border-b border-border/50 hover:bg-muted/50 transition-all ${
                    selectedConversation === conv.id ? 'bg-muted/80 border-l-[6px] border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-slate-600 flex items-center justify-center text-primary-foreground font-black text-lg shadow-lg">
                        {conv.name.charAt(0)}
                      </div>
                      {conv.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate500 rounded-full border-2 border-background shadow-sm" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-black text-foreground text-sm uppercase tracking-tight">{conv.name}</h3>
                        <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3" />
                          {conv.timestamp}
                        </span>
                      </div>
                      <p className={`text-xs truncate font-medium ${conv.unread ? 'text-primary font-black' : 'text-muted-foreground/60'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-card border border-border rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl shadow-black/5">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-slate-600 flex items-center justify-center text-primary-foreground font-black text-lg shadow-lg">
                      {conversations.find(c => c.id === selectedConversation)?.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-foreground uppercase tracking-tight">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${conversations.find(c => c.id === selectedConversation)?.online ? 'bg-slate500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                        {conversations.find(c => c.id === selectedConversation)?.online ? 'Node Active' : 'Node Idle'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-8 space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} mb-6`}
                    >
                      <div
                        className={`max-w-md px-6 py-4 rounded-[1.5rem] shadow-sm ${
                          msg.sender === 'You'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-muted border border-border text-foreground rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-2 font-black uppercase tracking-widest ${msg.sender === 'You' ? 'text-primary-foreground/60' : 'text-muted-foreground/40'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>

                {/* Input Area */}
                <div className="p-6 border-t border-border bg-muted/10">
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      placeholder="Transmit data packet..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-background border-border text-foreground rounded-2xl h-14 px-6 focus:ring-primary/20 font-medium"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl h-14 w-14 shadow-xl shadow-primary/20 transition-all active:scale-90"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-12">
                <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <MessageCircle className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">System Idle</h3>
                <p className="text-muted-foreground font-medium mt-2 max-w-xs">Select a communication link from the roster to begin data synchronization.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
