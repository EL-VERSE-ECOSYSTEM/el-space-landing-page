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
  const [loading, setLoading] = useState(true)

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Reputation <span className="text-cyan-500">Index</span></h1>
          <p className="text-slate-400 font-medium">Historical audit of your deployment excellence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-900 border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Elite Consensus</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">0.0</h3>
              <p className="text-slate-600 text-xs font-bold mt-2">Zero reviews finalized</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 text-slate-800" />)}
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Impact</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">0</h3>
              <p className="text-slate-600 text-xs font-bold mt-2">No missions completed yet</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-slate-600" />
            </div>
          </Card>
        </div>

        <div className="py-24 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
          <User className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">No reputation data detected. Complete your first mission to begin.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
