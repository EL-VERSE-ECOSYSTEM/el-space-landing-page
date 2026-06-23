'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MessageSquare, User, Clock } from 'lucide-react'

export default function ReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<any[]>([])
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchReviews()
    }
  }, [user])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/reviews?userId=${user?.id}`)
      const data = await res.json()
      if (data.reviews) {
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Reputation <span className="text-slate-500">Index</span></h1>
          <p className="text-slate-400 font-medium">Historical audit of your deployment excellence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-900 border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Elite Consensus</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">{stats.averageRating.toFixed(1)}</h3>
              <p className="text-slate-600 text-xs font-bold mt-2">{stats.totalReviews} reviews finalized</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-6 h-6 ${i <= Math.round(stats.averageRating) ? 'text-slate-400 fill-slate-400' : 'text-slate-800'}`} />
              ))}
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Impact</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">{stats.totalReviews}</h3>
              <p className="text-slate-600 text-xs font-bold mt-2">Verified network operations</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-slate-600" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {reviews.length > 0 ? reviews.map((review) => (
            <Card key={review.id} className="bg-slate-900 border-slate-800 rounded-[2rem] p-8 hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'text-slate-400 fill-slate-400' : 'text-slate-800'}`} />
                  ))}
                </div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white font-medium text-lg leading-relaxed mb-4">"{review.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-black text-slate-400 text-xs">
                  {review.reviewer_id?.charAt(0).toUpperCase() || 'E'}
                </div>
                <span className="text-slate-400 text-sm font-bold">Elite Verified Member</span>
              </div>
            </Card>
          )) : !loading && (
            <div className="py-24 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
              <User className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No reputation data detected. Complete your first mission to begin.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
