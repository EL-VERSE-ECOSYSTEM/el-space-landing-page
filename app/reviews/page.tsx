'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Star, MessageCircle, Shield,
  ChevronRight, ArrowLeft, Send,
  CheckCircle, Filter, Zap, Globe, Briefcase
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Review {
  id: string
  rating: number
  comment: string
  reviewer_role: 'client' | 'freelancer'
  created_at: string
  project_id: string
  reviewee_id: string
  project?: {
    title: string
  }
  reviewer?: {
    full_name: string
    avatar_url?: string
  }
}

export default function ReviewsPage() {
  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const router = useRouter()
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [newReview, setNewReview] = useState({
    projectId: '',
    revieweeId: '',
    rating: 5,
    comment: '',
    isPublic: true
  })

  useEffect(() => {
    if (user) {
      fetchReviews()
    }
  }, [user])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?userId=${user?.id}`)
      const data = await response.json()
      if (data.reviews) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!newReview.projectId || !newReview.comment) {
      toast.error('Please complete all review fields')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReview,
          authorId: user?.id
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Review submitted to the Reputation Matrix')
        setShowSubmitModal(false)
        fetchReviews()
      } else {
        toast.error(data.error || 'Failed to submit review')
      }
    } catch (err) {
      toast.error('Reputation sync failed')
    } finally {
      setLoading(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="min-h-screen text-slate-200 pb-20">
        <main className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <h1 className="text-6xl font-black text-white tracking-tighter">
                Reputation <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Matrix</span>
              </h1>
              <p className="text-slate-400 mt-2 text-lg font-medium">Historical performance metrics and community feedback.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 shadow-2xl shadow-slate-950">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Elite Rating</p>
                  <div className="flex items-center gap-2">
                     <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                     <span className="text-4xl font-black text-white tracking-tighter">{avgRating}</span>
                  </div>
               </div>
               <div className="w-px h-12 bg-slate-800" />
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Reports</p>
                  <p className="text-4xl font-black text-white tracking-tighter">{reviews.length}</p>
               </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-6">
             {loading ? (
               <div className="flex justify-center py-20">
                  <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full"></div>
               </div>
             ) : reviews.length > 0 ? reviews.map((review) => (
               <Card key={review.id} className="bg-slate-900 border-slate-800 rounded-[3rem] overflow-hidden hover:border-amber-500/30 transition-all">
                  <CardContent className="p-10">
                     <div className="flex flex-col md:flex-row gap-10">
                        <div className="shrink-0">
                           <Avatar className="w-20 h-20 border-2 border-slate-800 shadow-2xl">
                              <AvatarImage src={review.reviewer?.avatar_url} />
                              <AvatarFallback className="bg-slate-800 text-amber-500 font-black text-2xl uppercase">
                                 {(review.reviewer?.full_name || 'U').charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                        </div>

                        <div className="flex-1 space-y-6">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h4 className="text-2xl font-black text-white tracking-tight">{review.reviewer?.full_name || 'Anonymous Operative'}</h4>
                                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                                    {review.reviewer_role === 'client' ? 'Client Review' : 'Specialist Review'} • {new Date(review.created_at).toLocaleDateString()}
                                 </p>
                              </div>
                              <div className="flex gap-1">
                                 {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-800'}`} />
                                 ))}
                              </div>
                           </div>

                           <div className="bg-slate-950/50 rounded-[2rem] p-8 border border-slate-800">
                              <p className="text-lg text-slate-300 leading-relaxed font-medium">"{review.comment}"</p>
                           </div>

                           <div className="flex items-center gap-6 pt-2">
                              <div className="flex items-center gap-2 text-slate-600">
                                 <Briefcase className="w-4 h-4 text-cyan-500" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">DEPLOYMENT: {review.project?.title || 'Classified Mission'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                 <Shield className="w-4 h-4 text-emerald-500" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">VERIFIED SUCCESS</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
             )) : (
               <div className="text-center py-32 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[4rem]">
                  <Star className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                  <p className="text-slate-500 font-black text-2xl">Reputation Records Null</p>
                  <p className="text-slate-600 font-medium mt-2">No historical performance data currently indexed in the Nexus.</p>
                  <Button onClick={() => router.push('/jobs')} className="mt-10 bg-white text-slate-950 font-black h-14 rounded-xl px-10">Start Your First Mission</Button>
               </div>
             )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
