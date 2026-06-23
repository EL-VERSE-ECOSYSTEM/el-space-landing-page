'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users, Star, MapPin, DollarSign,
  Filter, Search, MessageCircle, ChevronRight,
  TrendingUp, Zap, Globe
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { ELLoader } from '@/components/ui/el-loader'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Input } from '@/components/ui/input'

export default function FreelancersHub() {
  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [freelancers, setFreelancers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchFreelancers()
  }, [])

  const fetchFreelancers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/freelancers?limit=20')
      const data = await res.json()
      if (data.freelancers) {
        setFreelancers(data.freelancers)
      }
    } catch (err) {
      console.error('Failed to sync network data')
    } finally {
      setLoading(false)
    }
  }

  if (loading && freelancers.length === 0) return <div className="min-h-screen bg-background flex items-center justify-center"><ELLoader /></div>

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="min-h-screen text-foreground pb-20">
        <main className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
               <h1 className="text-6xl font-black text-foreground tracking-tighter">
                  Elite <span className="bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent">Vanguard</span>
               </h1>
               <p className="text-muted-foreground mt-2 text-xl font-medium">Vetted technical specialists for critical deployments.</p>
            </div>
            <div className="flex gap-3">
               <Badge className="bg-slate-700/10 text-slate-700 border border-slate-700/20 px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase">
                  {freelancers.length} SPECIALISTS ONLINE
               </Badge>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                   type="text"
                   placeholder="Identify specialists by skill, stack, or designation..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-16 h-20 bg-card border-border text-foreground placeholder:text-muted-foreground/50 rounded-[2rem] focus:ring-primary text-lg shadow-2xl"
                />
             </div>
             <Button className="h-20 bg-card border border-border hover:border-slate-700 text-muted-foreground rounded-[2rem] px-10">
                <Filter className="w-6 h-6 mr-2" /> Parameters
             </Button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {freelancers.length > 0 ? freelancers.map((freelancer) => (
               <Card
                  key={freelancer.id}
                  className="bg-card border border-border rounded-[3rem] overflow-hidden hover:border-slate-700/50 transition-all group relative cursor-pointer shadow-lg"
                  onClick={() => router.push(`/freelancer/${freelancer.user_id}`)}
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-700/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-slate-700/10 transition-all" />
                  <CardContent className="p-10">
                     <div className="flex justify-between items-start mb-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-muted border border-border flex items-center justify-center font-black text-3xl text-slate-700 shadow-2xl">
                           {(freelancer.user?.full_name || 'U').charAt(0)}
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Success Rate</p>
                           <p className="text-2xl font-black text-foreground tracking-tighter">98%</p>
                        </div>
                     </div>

                     <div className="space-y-2 mb-8">
                        <h3 className="text-2xl font-black text-foreground tracking-tight group-hover:text-slate-700 transition-colors">{freelancer.user?.full_name}</h3>
                        <p className="text-slate-700/80 font-black text-[10px] uppercase tracking-widest">{freelancer.title || 'Technical Specialist'}</p>
                     </div>

                     <p className="text-muted-foreground font-medium text-sm line-clamp-2 mb-8 leading-relaxed">
                        {freelancer.bio || 'Highly specialized operative with expertise in decentralized systems and rapid deployment protocols.'}
                     </p>

                     <div className="flex flex-wrap gap-2 mb-10">
                        {(freelancer.skills || ['React', 'NodeJS', 'Security']).slice(0, 3).map((skill: string) => (
                          <Badge key={skill} className="bg-muted text-muted-foreground border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1">
                             {skill}
                          </Badge>
                        ))}
                     </div>

                     <div className="flex items-center justify-between pt-8 border-t border-border">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-slate-500 fill-slate-500" />
                              <span className="text-foreground font-black text-sm">{freelancer.avg_rating || '5.0'}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-muted-foreground">
                              <DollarSign className="w-4 h-4 text-slate-500" />
                              <span className="text-foreground font-black text-sm">${freelancer.hourly_rate || '45'}/HR</span>
                           </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-slate-700 group-hover:text-slate-700-foreground transition-all">
                           <ChevronRight className="w-6 h-6" />
                        </div>
                     </div>
                  </CardContent>
               </Card>
             )) : (
               <div className="col-span-full py-32 text-center bg-card border-2 border-dashed border-border rounded-[4rem]">
                  <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                  <p className="text-foreground font-black text-2xl tracking-tight uppercase">Network Silence</p>
                  <p className="text-muted-foreground font-medium mt-2">All specialists currently deployed on high-priority missions.</p>
               </div>
             )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
