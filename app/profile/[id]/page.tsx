'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Star, Shield, Zap, Globe, Github,
  Linkedin, Mail, MessageSquare, Briefcase,
  MapPin, Clock, Calendar, ChevronRight, Heart, MessageCircle, Share2, Repeat, Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'
import { useAuth } from '@/components/auth-provider'
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

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchUserPosts()
  }, [params.id])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/profile?userId=${params.id}`)
      const data = await res.json()
      if (data.success) {
        setProfile(data.profile)
      }
    } catch (err) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true)
      const res = await fetch(`/api/posts?userId=${params.id}`)
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (err) {
      console.error('Error fetching user posts:', err)
    } finally {
      setPostsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts?id=${postId}&userId=${currentUser.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Post deleted')
        setPosts(posts.filter(p => p.id !== postId))
      } else {
        toast.error(data.error || 'Failed to delete post')
      }
    } catch (error) {
      toast.error('Deletion failed')
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><ELLoader /></div>
  if (!profile) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Profile not found</div>

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Header Cover Area */}
      <div className="h-64 bg-gradient-to-r from-slate-600/20 via-slate-600/20 to-slate-600/20 relative">
         <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl" />
      </div>

      <main className="max-w-6xl mx-auto px-8 -mt-32 relative z-10 pb-20">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Avatar & Basic Info */}
            <div className="space-y-8">
               <Card className="bg-slate-900/60 backdrop-blur-xl border-white/5 overflow-hidden">
                  <CardContent className="p-8 text-center">
                     <div className="w-32 h-32 rounded-3xl bg-slate-800 border-4 border-slate-950 mx-auto shadow-2xl relative overflow-hidden flex items-center justify-center">
                        {profile.user?.avatar_url ? (
                          <Image src={profile.user.avatar_url} alt="" fill className="object-cover" />
                        ) : (
                          <span className="text-4xl font-black text-slate-400">{(profile.user?.full_name || 'U').charAt(0)}</span>
                        )}
                     </div>
                     <h1 className="mt-6 text-2xl font-black text-white">{profile.user?.full_name}</h1>
                     <div className="flex flex-col items-center gap-1 mt-1">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{profile.user?.user_type} Profile</p>
                        <p className="text-slate-500 font-mono text-[10px] font-bold">{profile.user?.el_space_id}</p>
                     </div>

                     <div className="flex justify-center gap-4 mt-6">
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white bg-white/5"><Github className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white bg-white/5"><Linkedin className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white bg-white/5"><Globe className="w-5 h-5" /></Button>
                     </div>

                     <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-left">
                        <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-500">Location</span>
                           <span className="text-white font-medium flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> New York, USA</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-500">Member Since</span>
                           <span className="text-white font-medium">{new Date(profile.user?.created_at).getFullYear()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-500">Response Time</span>
                           <span className="text-slate-400 font-bold">~2 hours</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Button className="w-full h-14 bg-white text-slate-950 hover:bg-slate-400 hover:text-white font-black text-lg transition-all rounded-2xl shadow-xl shadow-slate-500/20">
                  <MessageSquare className="w-5 h-5 mr-2" /> Message
               </Button>
            </div>

            {/* Middle & Right Column: Details */}
            <div className="lg:col-span-2 space-y-10">
               <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                     <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 px-3 py-1 font-bold">VERIFIED IDENTITY</Badge>
                     <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 px-3 py-1 font-bold">TOP RATED</Badge>
                  </div>
                  <h2 className="text-4xl font-black text-white">Full Stack Software Architect & Product Designer</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                     Highly experienced professional specializing in high-performance web applications and premium UI/UX design. I&apos;ve delivered over 150+ successful projects across various industries, from Fintech to Healthcare.
                  </p>
               </div>

               {/* Key Stats Row */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Job Success', value: '100%' },
                    { label: 'Total Jobs', value: '142' },
                    { label: 'Hours Logged', value: '1,200' },
                    { label: 'Avg. Rating', value: '5.0' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl text-center">
                       <p className="text-white font-black text-2xl">{stat.value}</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                  ))}
               </div>

               {/* Experience & Skills */}
               <div className="space-y-8">
                  <div>
                     <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-slate-400" />
                        Core Expertise
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'AWS', 'UI/UX Design', 'Product Strategy'].map(skill => (
                          <Badge key={skill} className="bg-slate-800 text-slate-300 border-white/5 px-4 py-2 rounded-full font-medium">
                            {skill}
                          </Badge>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-slate-400" />
                        Verification History
                     </h3>
                     <div className="space-y-4">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/[0.08] transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-500/10 rounded-xl flex items-center justify-center">
                                 <Shield className="w-6 h-6 text-slate-400" />
                              </div>
                              <div>
                                 <p className="text-white font-bold">Premium EL ACCESS Holder</p>
                                 <p className="text-slate-500 text-sm">Verified background and financial stability check passed.</p>
                              </div>
                           </div>
                           <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                        </div>
                     </div>
                  </div>

                  {/* User Posts Section */}
                  <div className="pt-10 border-t border-white/5">
                     <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-slate-400" />
                        Feed Activity
                     </h3>

                     {postsLoading ? (
                       <div className="flex justify-center py-10">
                          <div className="animate-spin h-8 w-8 border-2 border-slate-500 border-t-transparent rounded-full"></div>
                       </div>
                     ) : posts.length > 0 ? (
                       <div className="space-y-6">
                          {posts.map((post) => (
                            <Card key={post.id} className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
                               <CardContent className="p-6">
                                  <div className="flex justify-between items-start mb-4">
                                     <div className="flex gap-3">
                                        <Avatar className="w-10 h-10 border border-white/10">
                                           <AvatarImage src={post.user?.avatar_url} />
                                           <AvatarFallback className="bg-slate-800 text-slate-400 text-xs font-black uppercase">
                                              {(post.user?.full_name || 'U').charAt(0)}
                                           </AvatarFallback>
                                        </Avatar>
                                        <div>
                                           <p className="text-white font-bold text-sm">{post.user?.full_name}</p>
                                           <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{new Date(post.created_at).toLocaleDateString()}</p>
                                        </div>
                                     </div>
                                     {currentUser?.id === post.user_id && (
                                       <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-slate-500 hover:text-red-400 h-8 w-8"
                                          onClick={() => handleDeletePost(post.id)}
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </Button>
                                     )}
                                  </div>
                                  <p className="text-slate-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                                  {post.media_urls?.[0] && (
                                    <div className="rounded-xl overflow-hidden mb-4 border border-white/10 relative h-64">
                                       <Image src={post.media_urls[0]} alt="" fill className="object-cover" />
                                    </div>
                                  )}

                                  <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                     <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold"><Heart className="w-4 h-4" /> {post.likes_count}</span>
                                     <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold"><MessageCircle className="w-4 h-4" /> {post.comments_count}</span>
                                     <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold"><Repeat className="w-4 h-4" /> {post.reposts_count}</span>
                                  </div>
                               </CardContent>
                            </Card>
                          ))}
                       </div>
                     ) : (
                       <div className="text-center py-12 bg-white/5 border-2 border-dashed border-white/5 rounded-[2rem]">
                          <p className="text-slate-500 font-bold">No posts shared yet.</p>
                       </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  )
}
