'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Rocket, DollarSign, Clock, CheckCircle,
  Search, Bell, Settings, Filter, ArrowUpRight,
  TrendingUp, Activity, MessageSquare, Star,
  Zap, Briefcase, Globe, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'

export default function FreelancerHub() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeJobs: 0,
    pendingPayments: 0,
    jobSuccess: 0
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/applications?freelancerId=${user?.id}`)
      const data = await res.json()
      if (data.success) {
        setApplications(data.applications || [])
        // Mock stats for UI demonstration
        setStats({
          totalEarnings: 8450,
          activeJobs: 3,
          pendingPayments: 1200,
          jobSuccess: 98
        })
      }
    } catch (err) {
      toast.error('Failed to sync network data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><ELLoader /></div>

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Premium Navbar */}
      <header className="h-20 bg-slate-900/30 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-8 cursor-pointer" onClick={() => router.push('/')}>
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-white font-bold text-sm">Dashboard</button>
            <button onClick={() => router.push('/jobs')} className="text-slate-400 hover:text-white transition-colors text-sm">Opportunities</button>
            <button onClick={() => router.push('/wallet')} className="text-slate-400 hover:text-white transition-colors text-sm">Wallet</button>
            <button onClick={() => router.push('/messages')} className="text-slate-400 hover:text-white transition-colors text-sm">Messages</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => router.push('/jobs')} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 rounded-full hidden sm:flex">
             Find Work
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-full">
             <div className="w-2 h-2 bg-emerald-500 rounded-full" />
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Available</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
             {user?.avatar_url ? <Image src={user.avatar_url} alt="" width={40} height={40} /> : <div className="font-bold text-xs">{(user?.full_name || 'U').charAt(0)}</div>}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-10">
        {/* Profile Snapshot */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-cyan-900/10 to-purple-900/10 p-8 rounded-[2rem] border border-white/5">
           <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-white/10 flex items-center justify-center font-black text-3xl text-cyan-400 shadow-2xl shadow-cyan-500/20">
              {(user?.full_name || 'U').charAt(0)}
           </div>
           <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                 <h1 className="text-4xl font-black text-white tracking-tight">{user?.full_name}</h1>
                 <Badge className="w-fit mx-auto md:mx-0 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] font-black uppercase tracking-widest">
                   ELITE FREELANCER
                 </Badge>
              </div>
              <p className="text-slate-400 mt-2 font-medium flex items-center justify-center md:justify-start gap-4">
                 <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.98 (124 reviews)</span>
                 <span className="h-1 w-1 bg-slate-700 rounded-full" />
                 <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-cyan-400" /> Top 1% of Network</span>
              </p>
           </div>
           <div className="flex gap-3">
              <Button onClick={() => router.push('/settings')} variant="outline" className="border-white/10 bg-white/5 text-white font-bold">Edit Profile</Button>
              <Button className="bg-white text-slate-950 font-bold px-8">Share Profile</Button>
           </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Total Earnings', value: `$${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
             { label: 'Active Pipeline', value: stats.activeJobs, icon: Briefcase, color: 'blue' },
             { label: 'In Escrow', value: `$${stats.pendingPayments.toLocaleString()}`, icon: Clock, color: 'orange' },
             { label: 'Job Success', value: `${stats.jobSuccess}%`, icon: CheckCircle, color: 'cyan' }
           ].map((stat, i) => (
             <Card key={i} className="bg-slate-900/40 border-white/5 hover:border-white/10 transition-all group overflow-hidden">
                <CardContent className="p-6">
                   <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                         <stat.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="border-white/5 text-slate-500 font-mono text-[10px]">REAL-TIME</Badge>
                   </div>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                   <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Active Operations</h2>
                <button className="text-cyan-400 text-xs font-bold uppercase tracking-widest hover:underline" onClick={() => router.push('/applications')}>View All Applications</button>
             </div>

             <div className="space-y-4">
                {applications.length > 0 ? applications.map((app) => (
                  <Card key={app.id} className="bg-slate-900/40 border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group">
                     <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                              <Rocket className="w-8 h-8 text-purple-500" />
                           </div>
                           <div>
                              <h4 className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">{app.project?.title || 'Unknown Project'}</h4>
                              <div className="flex items-center gap-4 mt-1">
                                 <p className="text-slate-500 text-sm">Status: <span className="text-cyan-400 font-bold uppercase text-[10px] tracking-widest ml-1">{app.status}</span></p>
                                 <div className="h-1 w-1 bg-slate-700 rounded-full" />
                                 <p className="text-slate-500 text-sm">{new Date(app.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                     </CardContent>
                  </Card>
                )) : (
                  <div className="py-20 text-center bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
                     <Rocket className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                     <p className="text-slate-500 font-medium">No active applications found.</p>
                     <Button onClick={() => router.push('/jobs')} className="mt-6 bg-white text-slate-950 font-bold px-8">Find Opportunities</Button>
                  </div>
                )}
             </div>
          </div>

          <div className="space-y-8">
             <Card className="bg-slate-900/40 border-white/5">
                <CardHeader>
                   <CardTitle className="text-white text-lg">Network Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="p-4 bg-white/5 rounded-xl border-l-4 border-cyan-500">
                      <p className="text-white text-sm font-bold">New Project Match</p>
                      <p className="text-slate-400 text-xs mt-1">"NextJS/Tailwind Expert" matches your skill profile perfectly.</p>
                      <button className="text-cyan-400 text-[10px] font-black uppercase mt-3 tracking-widest hover:underline">View Project</button>
                   </div>
                   <div className="p-4 bg-white/5 rounded-xl border-l-4 border-purple-500">
                      <p className="text-white text-sm font-bold">Payment Cleared</p>
                      <p className="text-slate-400 text-xs mt-1">Your payment for "UI Design" of $450 is now available in your wallet.</p>
                      <button className="text-purple-400 text-[10px] font-black uppercase mt-3 tracking-widest hover:underline">Withdraw Funds</button>
                   </div>
                </CardContent>
             </Card>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl text-center hover:bg-white/5 transition-colors cursor-pointer" onClick={() => router.push('/messages')}>
                   <MessageSquare className="w-8 h-8 text-cyan-500 mx-auto mb-3" />
                   <p className="text-white font-bold text-sm">Chats</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl text-center hover:bg-white/5 transition-colors cursor-pointer" onClick={() => router.push('/wallet')}>
                   <DollarSign className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                   <p className="text-white font-bold text-sm">Wallet</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
