'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Search, Star, MapPin, Briefcase, Users, Filter,
  Heart, MessageCircle, Share2, Image as ImageIcon,
  Video, Send, MoreHorizontal, DollarSign
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Freelancer {
  id: string
  name: string
  title: string
  rate: number
  rating: number
  reviews: number
  skills: string[]
  bio: string
  image?: string
  location?: string
  availability: string
}

interface Project {
  id: string
  title: string
  description: string
  budget: number
  timeline: string
  skills: string[]
  postedBy: string
  image?: string
  proposals: number
}

interface SocialPost {
  id: string
  user_id: string
  content: string
  media_urls: string[]
  media_type: 'image' | 'video' | 'none'
  likes_count: number
  comments_count: number
  created_at: string
  user: {
    full_name: string
    avatar_url: string
    el_space_id: string
  }
}

export default function FeedPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('social')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)

  // Post creation state
  const [postContent, setPostContent] = useState('')
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      fetchFeedData()
      fetchPosts()
    }
  }, [authLoading, user])

  const fetchFeedData = async () => {
    try {
      // Fetch freelancers
      const freelancerResponse = await fetch(`/api/freelancers?limit=10`)
      const freelancerData = await freelancerResponse.json()
      setFreelancers(freelancerData.freelancers || [])

      // Fetch projects
      const projectResponse = await fetch(`/api/projects?limit=10&status=open`)
      const projectData = await projectResponse.json()
      setProjects(projectData.projects || [])
    } catch (error) {
      console.error('Error fetching feed data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handleCreatePost = async () => {
    if (!postContent.trim() || !user) return

    try {
      setIsSubmittingPost(true)
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          user_id: user.id,
          content: postContent,
          media_type: 'none'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Post shared with the community!')
        setPostContent('')
        fetchPosts()
      } else {
        toast.error(data.error || 'Failed to share post')
      }
    } catch (error) {
      toast.error('Something went wrong')
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
        fetchPosts() // Refresh to update counts
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'My Applications', href: '/applications' },
    { label: 'Messages', href: '/messages' },
  ]

  return (
    <DashboardLayout userType={(user?.user_type === "freelancer" ? "freelancer" : "client")} navItems={navItems}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              EL <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Nexus</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">
              Connect, share, and discover the next big thing.
            </p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300 rounded-xl">
                <Users className="w-4 h-4 mr-2" /> Community
             </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-900/50 border border-slate-800 p-1 rounded-2xl mb-8">
            <TabsTrigger value="social" className="rounded-xl px-8 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              Social Feed
            </TabsTrigger>
            <TabsTrigger value="discover" className="rounded-xl px-8 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              {user?.user_type === 'client' ? 'Find Talent' : 'Opportunities'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-6">
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
                     <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex gap-2">
                           <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl">
                              <ImageIcon className="w-5 h-5 mr-2" /> Image
                           </Button>
                           <Button variant="ghost" size="sm" className="text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-xl">
                              <Video className="w-5 h-5 mr-2" /> Video
                           </Button>
                        </div>
                        <Button
                           onClick={handleCreatePost}
                           disabled={!postContent.trim() || isSubmittingPost}
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
               {posts.length > 0 ? posts.map((post) => (
                 <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 hover:border-slate-700 transition-all">
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
                       <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-full">
                          <MoreHorizontal className="w-5 h-5" />
                       </Button>
                    </div>

                    <p className="text-slate-200 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                       {post.content}
                    </p>

                    {post.media_type === 'image' && post.media_urls?.[0] && (
                       <div className="rounded-2xl overflow-hidden mb-6 border border-slate-800">
                          <img src={post.media_urls[0]} alt="Post media" className="w-full object-cover max-h-[500px]" />
                       </div>
                    )}

                    <div className="flex items-center gap-8 pt-4 border-t border-slate-800">
                       <button
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm"
                       >
                          <Heart className="w-5 h-5" /> {post.likes_count}
                       </button>
                       <button className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-bold text-sm">
                          <MessageCircle className="w-5 h-5" /> {post.comments_count}
                       </button>
                       <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-bold text-sm">
                          <Share2 className="w-5 h-5" /> Share
                       </button>
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-20 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
                    <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No community posts yet. Be the first to share!</p>
                 </div>
               )}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
             {/* Search and Filter */}
            <div className="flex gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                     type="text"
                     placeholder={user?.user_type === 'client' ? 'Recruit specialized talent...' : 'Scan available missions...'}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-14 h-14 bg-slate-900 border-slate-800 text-white placeholder-slate-500 rounded-2xl focus:ring-cyan-500"
                  />
               </div>
               <Button variant="outline" className="h-14 border-slate-800 bg-slate-900 text-slate-400 rounded-2xl px-6">
                  <Filter className="w-5 h-5 mr-2" /> Parameters
               </Button>
            </div>

            {user?.user_type === 'client' ? (
              <div className="space-y-4">
                {freelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-cyan-500/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-2xl text-cyan-400">
                              {(freelancer.name || 'U').charAt(0)}
                           </div>
                           <div>
                              <h3 className="text-2xl font-black text-white tracking-tight">{freelancer.name}</h3>
                              <p className="text-cyan-400 font-black text-sm uppercase tracking-widest">{freelancer.title}</p>
                           </div>
                        </div>

                        <p className="text-slate-300 mb-6 line-clamp-2 leading-relaxed">{freelancer.bio}</p>

                        <div className="flex flex-wrap gap-2 mb-8">
                          {freelancer.skills.map((skill) => (
                            <Badge key={skill} className="bg-slate-800 text-slate-400 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
                          <div className="flex items-center gap-2">
                             <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                             <span className="text-white">{freelancer.rating}</span> ({freelancer.reviews})
                          </div>
                          <div className="flex items-center gap-2">
                             <MapPin className="w-4 h-4" />
                             {freelancer.location || 'Remote'}
                          </div>
                          <div className="flex items-center gap-2">
                             <DollarSign className="w-4 h-4 text-emerald-500" />
                             <span className="text-white">${freelancer.rate}/HR</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          className="bg-white hover:bg-cyan-500 text-slate-950 hover:text-white font-black px-8 h-12 rounded-xl transition-all"
                          onClick={() => router.push(`/freelancer/${freelancer.id}`)}
                        >
                          View Dossier
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-slate-400 hover:text-white font-black h-12 rounded-xl"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" /> Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                           <Badge className="bg-purple-500/10 text-purple-400 border-none font-black text-[10px] uppercase tracking-widest">ACTIVE MISSION</Badge>
                           <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">Posted by {project.postedBy}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight mb-4 group-hover:text-purple-400 transition-colors">{project.title}</h3>
                        <p className="text-slate-300 mb-8 line-clamp-2 leading-relaxed">{project.description}</p>

                        <div className="flex items-center gap-10">
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Budget Allocation</p>
                              <p className="text-2xl font-black text-emerald-400 tracking-tighter">${project.budget.toLocaleString()}</p>
                           </div>
                           <div className="w-px h-10 bg-slate-800" />
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Timeline</p>
                              <p className="text-white font-black tracking-tight">{project.timeline}</p>
                           </div>
                           <div className="w-px h-10 bg-slate-800" />
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Competition</p>
                              <p className="text-white font-black tracking-tight">{project.proposals} Proposals</p>
                           </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          className="bg-white hover:bg-purple-500 text-slate-950 hover:text-white font-black px-10 h-14 rounded-2xl transition-all shadow-xl shadow-slate-950"
                          onClick={() => router.push(`/jobs/${project.id}`)}
                        >
                          Analyze Intel
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => toggleFavorite(project.id)}
                          className={favorites.includes(project.id) ? 'text-red-400' : 'text-slate-500'}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(project.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
