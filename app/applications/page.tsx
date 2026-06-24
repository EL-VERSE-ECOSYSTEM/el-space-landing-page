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
      <div className="max-w-5xl mx-auto space-y-8 text-foreground">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Mission <span className="text-slate-700">Proposals</span></h1>
          <p className="text-muted-foreground font-medium">Track your technical deployment requests.</p>
        </div>

        <div className="space-y-4">
          {apps.length > 0 ? apps.map((app) => (
            <Card key={app.id} className="bg-card border border-border rounded-[2rem] overflow-hidden hover:border-slate-700/20 transition-all group shadow-lg">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-[2rem] bg-muted flex items-center justify-center border border-border group-hover:bg-slate-700 transition-colors">
                    <Rocket className="w-6 h-6 text-slate-700 group-hover:text-slate-700-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">{app.project?.title || 'Nexus Operation'}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Submitted {new Date(app.created_at).toLocaleDateString()}</p>
                      <div className="w-1 h-1 bg-border rounded-full" />
                      <p className="text-slate-700 font-black text-[10px] uppercase tracking-widest">${app.proposed_rate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <Badge className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border-none ${
                    app.status === 'pending' ? 'bg-slate-500/10 text-slate-500' :
                    app.status === 'accepted' ? 'bg-slate-500/10 text-slate-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {app.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : !loading && (
            <div className="py-24 text-center bg-card border-2 border-dashed border-border rounded-[3rem]">
              <div className="w-20 h-20 bg-muted rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-foreground font-black text-xl uppercase">Nexus List Clear</p>
              <p className="text-muted-foreground font-medium mt-2">No active proposals detected. Start scouting the board.</p>
              <Button onClick={() => router.push('/jobs')} className="mt-10 bg-slate-700 hover:bg-slate-700/90 text-slate-700-foreground font-black rounded-2xl h-14 px-10 shadow-xl shadow-primary/20">Browse Missions</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
