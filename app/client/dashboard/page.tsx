'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase, Users, Plus, ChevronRight,
  Search, Bell, Settings, Filter, ArrowUpRight,
  TrendingUp, Clock, Activity, MessageSquare, User as LucideUser
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'

export default function ClientHub() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalSpent: 0,
    hiredFreelancers: 0,
    pendingApplications: 0
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/projects?clientId=${user?.id}`)
      const data = await res.json()
      if (data.success) {
        setProjects(data.projects || [])
        // Mock stats for UI demonstration, in real app these come from API
        setStats({
          activeProjects: data.projects?.length || 0,
          totalSpent: 12500,
          hiredFreelancers: 8,
          pendingApplications: 24
        })
      }
    } catch (err) {
      toast.error('Failed to sync workspace')
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
            <button className="text-white font-bold text-sm">Workspace</button>
            <button onClick={() => router.push('/jobs')} className="text-slate-400 hover:text-white transition-colors text-sm">Marketplace</button>
            <button onClick={() => router.push('/messages')} className="text-slate-400 hover:text-white transition-colors text-sm">Messages</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => router.push('/jobs/post')} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 rounded-full hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" /> Post Project
          </Button>
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
             {user?.avatar_url ? <Image src={user.avatar_url} alt="" width={40} height={40} /> : <LucideUser className="w-5 h-5 text-slate-500" />}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Client Hub</h1>
            <p className="text-slate-400 mt-2 font-medium">Managing operations for <span className="text-cyan-400">{user?.full_name}</span></p>
          </div>
          <div className="flex gap-3">
             <Badge className="bg-white/5 border-white/10 text-slate-400 px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase">
               Premium Tier Access
             </Badge>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Active Projects', value: stats.activeProjects, icon: Briefcase, color: 'cyan' },
             { label: 'Total Investment', value: `$${stats.totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
             { label: 'Active Talent', value: stats.hiredFreelancers, icon: Users, color: 'purple' },
             { label: 'Incoming Bids', value: stats.pendingApplications, icon: Activity, color: 'orange' }
           ].map((stat, i) => (
             <Card key={i} className="bg-slate-900/40 border-white/5 hover:border-cyan-500/20 transition-all group overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500/50`} />
                <CardContent className="p-6">
                   <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                         <stat.icon className="w-6 h-6" />
                      </div>
                   </div>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                   <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-white">Your Pipeline</h2>
               <button className="text-cyan-400 text-xs font-bold uppercase tracking-widest hover:underline">View History</button>
            </div>

            <div className="space-y-4">
               {projects.length > 0 ? projects.map((project) => (
                 <Card key={project.id} className="bg-slate-900/40 border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer group" onClick={() => router.push(`/jobs/${project.id}`)}>
                    <CardContent className="p-6 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                             <Briefcase className="w-8 h-8 text-cyan-500" />
                          </div>
                          <div>
                             <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">{project.title}</h4>
                             <div className="flex items-center gap-4 mt-1">
                                <p className="text-slate-500 text-sm font-medium">Budget: <span className="text-emerald-400">${project.budget_min} - ${project.budget_max}</span></p>
                                <div className="h-1 w-1 bg-slate-700 rounded-full" />
                                <p className="text-slate-500 text-sm">{project.category}</p>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="hidden md:block text-right">
                             <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Status</p>
                             <Badge className="mt-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{project.status}</Badge>
                          </div>
                          <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                       </div>
                    </CardContent>
                 </Card>
               )) : (
                 <div className="py-20 text-center bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
                    <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No active projects found.</p>
                    <Button onClick={() => router.push('/jobs/post')} className="mt-6 bg-white text-slate-950 font-bold px-8">Post First Job</Button>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-white/5 overflow-hidden">
                <CardHeader>
                   <CardTitle className="text-white text-lg">Platform Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">Recommended Action</p>
                      <p className="text-white text-sm">You have <span className="text-cyan-400 font-bold">12 new applications</span> for your Mobile App project. Review them to keep momentum.</p>
                      <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 border-white/10 text-white font-bold text-xs uppercase tracking-widest">Review Applications</Button>
                   </div>

                   <div className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-slate-300 text-sm">System Health</span>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold uppercase">Optimal</span>
                   </div>
                </CardContent>
             </Card>

             <div className="space-y-4">
                <h3 className="text-white font-bold px-2">Marketplace Shortcuts</h3>
                <Button className="w-full justify-between bg-slate-900/40 border-white/5 hover:bg-white/5 text-slate-400 px-6 py-8">
                   <div className="flex items-center gap-4">
                      <Search className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-bold">Find Talent</span>
                   </div>
                   <ArrowUpRight className="w-5 h-5" />
                </Button>
                <Button className="w-full justify-between bg-slate-900/40 border-white/5 hover:bg-white/5 text-slate-400 px-6 py-8">
                   <div className="flex items-center gap-4">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-bold">Messaging</span>
                   </div>
                   <ArrowUpRight className="w-5 h-5" />
                </Button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
