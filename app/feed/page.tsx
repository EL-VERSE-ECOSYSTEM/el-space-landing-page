'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search, Star, MapPin, Briefcase, Users, Filter,
  Heart, MessageCircle, Share2, Image as ImageIcon,
  Video, Send, MoreHorizontal, DollarSign, Repeat,
  Play, FileText
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

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const PostCard = ({ post, isRepost = false }: { post: SocialPost, isRepost?: boolean }) => (
    <div className={`bg-slate-900 border border-slate-800 rounded-[2rem] p-6 ${!isRepost && 'hover:border-slate-700 transition-all shadow-xl'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12 border-2 border-slate-800">
            <AvatarImage src={post.user?.avatar_url} />
            <AvatarFallback className="bg-slate-800 text-cyan-400 font-black uppercase">
              {(post.user?.full_name || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-white font-black tracking-tight">{post.user?.full_name}</h4>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{post.user?.el_space_id} • {new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        {!isRepost && (
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-full">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        )}
      </div>

      <p className="text-slate-200 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
        {post.content}
      </p>

      {post.media_type === 'image' && post.media_urls?.[0] && (
        <div className="rounded-2xl overflow-hidden mb-6 border border-slate-800">
          <img src={post.media_urls[0]} alt="Post media" className="w-full object-cover max-h-[500px]" />
        </div>
      )}

      {post.media_type === 'video' && post.media_urls?.[0] && (
        <div className="rounded-2xl overflow-hidden mb-6 border border-slate-800 bg-black aspect-video flex items-center justify-center relative group cursor-pointer">
           <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-all">
              <Play className="w-8 h-8 text-white fill-white" />
           </div>
           <p className="absolute bottom-4 left-4 text-white font-bold text-xs uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full">Video Attachment</p>
        </div>
      )}

      {post.original_post && (
        <div className="mt-4 mb-6 border-l-4 border-slate-800 pl-6 py-2">
          <PostCard post={post.original_post} isRepost={true} />
        </div>
      )}

      {!isRepost && (
        <div className="flex items-center gap-8 pt-4 border-t border-slate-800">
          <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm">
            <Heart className="w-5 h-5" /> {post.likes_count}
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-bold text-sm">
            <MessageCircle className="w-5 h-5" /> {post.comments_count}
          </button>
          <button onClick={() => handleCreatePost(post.id)} className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors font-bold text-sm">
            <Repeat className="w-5 h-5" /> {post.reposts_count}
          </button>
          <button onClick={() => handleShare(post.id)} className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-bold text-sm">
            <Share2 className="w-5 h-5" /> {post.shares_count}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              EL <span className="text-cyan-500">Nexus</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Connect, share, and discover the next big thing.</p>
          </div>
          <Button onClick={() => router.push('/feed/manage')} variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 rounded-xl">
            <FileText className="w-4 h-4 mr-2" /> Data Table
          </Button>
        </div>

        {/* Create Post */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl">
           <div className="flex gap-4">
              <Avatar className="w-12 h-12 border-2 border-slate-800">
                 <AvatarImage src={user?.avatar_url} />
                 <AvatarFallback className="bg-slate-800 text-cyan-400 font-black">
                    {(user?.full_name || 'U').charAt(0)}
                 </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                 <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What's happening in your workspace?"
                    className="w-full bg-transparent border-none text-white placeholder-slate-500 resize-none focus:ring-0 text-lg min-h-[100px]"
                 />
                 {mediaUrl && (
                   <div className="p-3 bg-slate-800 rounded-xl text-xs text-cyan-400 font-mono truncate">
                     {mediaType.toUpperCase()}: {mediaUrl}
                   </div>
                 )}
                 <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex gap-2">
                       <Button onClick={() => {setMediaType('image'); setMediaUrl('https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800')}} variant="ghost" size="sm" className={`text-slate-400 hover:text-cyan-400 rounded-xl ${mediaType === 'image' && 'text-cyan-400 bg-cyan-400/10'}`}>
                          <ImageIcon className="w-5 h-5 mr-2" /> Image
                       </Button>
                       <Button onClick={() => {setMediaType('video'); setMediaUrl('https://example.com/demo.mp4')}} variant="ghost" size="sm" className={`text-slate-400 hover:text-purple-400 rounded-xl ${mediaType === 'video' && 'text-purple-400 bg-purple-400/10'}`}>
                          <Video className="w-5 h-5 mr-2" /> Video
                       </Button>
                    </div>
                    <Button
                       onClick={() => handleCreatePost()}
                       disabled={(!postContent.trim() && !mediaUrl) || isSubmittingPost}
                       className="bg-cyan-500 hover:bg-cyan-600 text-white font-black px-8 rounded-xl"
                    >
                       {isSubmittingPost ? 'Posting...' : 'Share'} <Send className="w-4 h-4 ml-2" />
                    </Button>
                 </div>
              </div>
           </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
           {loading ? (
             <div className="text-center py-20 text-slate-500 font-bold">Synchronizing Nexus...</div>
           ) : posts.length > 0 ? posts.map((post) => (
             <PostCard key={post.id} post={post} />
           )) : (
             <div className="text-center py-20 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No community posts yet. Be the first to share!</p>
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  )
}
