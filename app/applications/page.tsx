'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rocket, Clock, CheckCircle, XCircle, ChevronRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ApplicationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchApps()
  }, [user])

  const fetchApps = async () => {
    try {
      const res = await fetch(`/api/applications?freelancerId=${user?.id}`)
      const data = await res.json()
      if (data.success) setApps(data.applications || [])
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
          <h1 className="text-4xl font-black text-white tracking-tighter">Mission <span className="text-cyan-500">Proposals</span></h1>
          <p className="text-slate-400 font-medium">Track your technical deployment requests.</p>
        </div>

        <div className="space-y-4">
          {apps.length > 0 ? apps.map((app) => (
            <Card key={app.id} className="bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden hover:border-slate-700 transition-all group">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:bg-slate-700 transition-colors">
                    <Rocket className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{app.project?.title || 'Nexus Operation'}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Submitted {new Date(app.created_at).toLocaleDateString()}</p>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <p className="text-cyan-400 font-black text-xs uppercase tracking-widest">${app.proposed_rate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <Badge className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${
                    app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {app.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-full">
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : !loading && (
            <div className="py-24 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
              <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No proposals found. Start scouting the board.</p>
              <Button onClick={() => router.push('/jobs')} className="mt-8 bg-white text-slate-950 font-black rounded-xl h-12 px-8">Browse Missions</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
