'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search, Star, MapPin, Briefcase, Users, Filter,
  Heart, MessageCircle, Share2, Image as ImageIcon,
  Video, Send, MoreHorizontal, DollarSign, Repeat,
  Play, FileText, Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SocialPost {
  id: string
  user_id: string
  content: string
  media_urls: string[]
  media_type: 'image' | 'video' | 'none'
  likes_count: number
  comments_count: number
  shares_count: number
  reposts_count: number
  original_post_id?: string
  created_at: string
  user: {
    full_name: string
    avatar_url: string
    el_space_id: string
  }
  original_post?: SocialPost
}

export default function FeedPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [postContent, setPostContent] = useState('')
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none')
  const [mediaUrl, setMediaUrl] = useState('')

  useEffect(() => {
    if (!authLoading) {
      fetchPosts()
    }
  }, [authLoading, user])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (originalPostId?: string) => {
    if (!postContent.trim() && !mediaUrl || !user) return

    try {
      setIsSubmittingPost(true)
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userId: user.id,
          content: postContent,
          mediaUrls: mediaUrl ? [mediaUrl] : [],
          mediaType: mediaType,
          originalPostId
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(originalPostId ? 'Reposted!' : 'Post shared!')
        setPostContent('')
        setMediaUrl('')
        setMediaType('none')
        fetchPosts()
      }
    } catch (error) {
      toast.error('Failed to post')
    } finally {
      setIsSubmittingPost(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!user) return
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          postId,
          userId: user.id
        })
      })
      const data = await response.json()
      if (data.success) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleShare = async (postId: string) => {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'share', postId })
      })
      toast.success('Link copied to clipboard!')
      fetchPosts()
    } catch (error) {}
  }

  const handleDeletePost = async (postId: string) => {
    if (!user) return
    if (!confirm('Eliminate this record from the Nexus?')) return

    try {
      const response = await fetch(`/api/posts?id=${postId}&userId=${user.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Post purged.')
        setPosts(posts.filter(p => p.id !== postId))
      } else {
        toast.error(data.error || 'Failed to purge post')
      }
    } catch (error) {
      toast.error('Purge failed')
    }
  }

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const PostCard = ({ post, isRepost = false }: { post: SocialPost, isRepost?: boolean }) => (
    <div className={`bg-card border border-border rounded-[2rem] p-6 ${!isRepost && 'hover:border-slate-700/20 transition-all shadow-lg shadow-black/5'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12 border-2 border-border shadow-sm">
            <AvatarImage src={post.user?.avatar_url} />
            <AvatarFallback className="bg-muted text-slate-700 font-black uppercase">
              {(post.user?.full_name || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-foreground font-black tracking-tight">{post.user?.full_name}</h4>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{post.user?.el_space_id} • {new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        {!isRepost && (
          <div className="flex gap-2">
            {user?.id === post.user_id && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <p className="text-foreground font-medium text-lg leading-relaxed mb-6 whitespace-pre-wrap">
        {post.content}
      </p>

      {post.media_type === 'image' && post.media_urls?.[0] && (
        <div className="rounded-[2rem] overflow-hidden mb-6 border border-border relative h-[500px] shadow-inner bg-muted">
          <Image src={post.media_urls[0]} alt="Post media" fill className="object-cover" />
        </div>
      )}

      {post.media_type === 'video' && post.media_urls?.[0] && (
        <div className="rounded-[2rem] overflow-hidden mb-6 border border-border bg-black aspect-video flex items-center justify-center relative group cursor-pointer shadow-2xl">
           <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-all border border-white/20">
              <Play className="w-8 h-8 text-white fill-white" />
           </div>
           <p className="absolute bottom-4 left-4 text-white font-black text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg">Data Transmission Active</p>
        </div>
      )}

      {post.original_post && (
        <div className="mt-4 mb-6 border-l-4 border-slate-700/20 pl-6 py-2">
          <PostCard post={post.original_post} isRepost={true} />
        </div>
      )}

      {!isRepost && (
        <div className="flex items-center gap-8 pt-6 border-t border-border/50">
          <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest">
            <Heart className="w-5 h-5" /> {post.likes_count}
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-slate-700 transition-all font-black text-[10px] uppercase tracking-widest">
            <MessageCircle className="w-5 h-5" /> {post.comments_count}
          </button>
          <button onClick={() => handleCreatePost(post.id)} className="flex items-center gap-2 text-muted-foreground hover:text-slate-500 transition-all font-black text-[10px] uppercase tracking-widest">
            <Repeat className="w-5 h-5" /> {post.reposts_count}
          </button>
          <button onClick={() => handleShare(post.id)} className="flex items-center gap-2 text-muted-foreground hover:text-slate-500 transition-all font-black text-[10px] uppercase tracking-widest">
            <Share2 className="w-5 h-5" /> {post.shares_count}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="space-y-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase">
              The <span className="text-slate-700">Nexus</span>
            </h1>
            <p className="text-muted-foreground font-medium mt-2 text-lg">Strategic network broadcast and industry intelligence.</p>
          </div>
          <Button onClick={() => router.push('/feed/manage')} variant="outline" className="bg-card border-border text-muted-foreground hover:text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 shadow-sm">
            <FileText className="w-4 h-4 mr-2" /> Data Stream
          </Button>
        </div>

        {/* Create Post */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl shadow-black/5">
           <div className="flex gap-6">
              <Avatar className="w-14 h-14 border-2 border-border shadow-md">
                 <AvatarImage src={user?.avatar_url} />
                 <AvatarFallback className="bg-muted text-slate-700 font-black">
                    {(user?.full_name || 'U').charAt(0)}
                 </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-6">
                 <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Broadcast your operational status..."
                    className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground/30 resize-none focus:ring-0 text-xl font-medium min-h-[120px]"
                 />
                 {mediaUrl && (
                   <div className="p-4 bg-muted/50 border border-border rounded-2xl text-[10px] text-slate-700 font-black uppercase tracking-widest truncate shadow-inner">
                     {mediaType.toUpperCase()} Link: {mediaUrl}
                   </div>
                 )}
                 <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div className="flex gap-4">
                       <Button onClick={() => {setMediaType('image'); setMediaUrl('https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800')}} variant="ghost" size="sm" className={`text-muted-foreground hover:text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest ${mediaType === 'image' && 'text-slate-700 bg-slate-700/10'}`}>
                          <ImageIcon className="w-5 h-5 mr-2" /> Image
                       </Button>
                       <Button onClick={() => {setMediaType('video'); setMediaUrl('https://example.com/demo.mp4')}} variant="ghost" size="sm" className={`text-muted-foreground hover:text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest ${mediaType === 'video' && 'text-slate-500 bg-slate-500/10'}`}>
                          <Video className="w-5 h-5 mr-2" /> Video
                       </Button>
                    </div>
                    <Button
                       onClick={() => handleCreatePost()}
                       disabled={(!postContent.trim() && !mediaUrl) || isSubmittingPost}
                       className="bg-slate-700 hover:bg-slate-700/90 text-slate-700-foreground font-black px-10 h-14 rounded-[2rem] shadow-xl shadow-primary/20 uppercase tracking-widest text-xs transition-all active:scale-95"
                    >
                       {isSubmittingPost ? 'Syncing...' : 'Initiate Broadcast'} <Send className="w-4 h-4 ml-2" />
                    </Button>
                 </div>
              </div>
           </div>
        </div>

        {/* Posts List */}
        <div className="space-y-8">
           {loading ? (
             <div className="text-center py-20 text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Global Nexus...</div>
           ) : posts.length > 0 ? posts.map((post) => (
             <PostCard key={post.id} post={post} />
           )) : (
             <div className="text-center py-32 bg-card/50 border-2 border-dashed border-border rounded-[3rem] shadow-inner">
                <Users className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
                <p className="text-foreground font-black text-xl uppercase tracking-tight">Signal Flat</p>
                <p className="text-muted-foreground font-medium mt-2">No community transmissions detected. Be the first to initiate contact.</p>
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  )
}
