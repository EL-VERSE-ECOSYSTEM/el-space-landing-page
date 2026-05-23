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
  TrendingUp, Clock, Activity, MessageSquare, User as LucideUser,
  DollarSign
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
    pendingApplications: 0,
    walletBalance: 0
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [projRes, walletRes] = await Promise.all([
        fetch(`/api/projects?clientId=${user?.id}`),
        fetch(`/api/wallet?userId=${user?.id}`)
      ])

      const data = await projRes.json()
      const walletData = await walletRes.json()

      if (data.success) {
        setProjects(data.projects || [])
        setStats(prev => ({
          ...prev,
          activeProjects: data.projects?.length || 0,
          totalSpent: 12500,
          hiredFreelancers: 8,
          pendingApplications: 24
        }))
      }

      if (walletData.success) {
        setStats(prev => ({ ...prev, walletBalance: walletData.wallet.balance }))
      }
    } catch (err) {
      toast.error('Failed to sync workspace')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><ELLoader /></div>

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-cyan-100 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Premium Navbar */}
      <header className="h-24 bg-white/70 backdrop-blur-2xl border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 transition-all group-hover:scale-110">
              <span className="text-white font-black text-sm">EL</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">WORKSPACE</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button className="text-slate-900 font-black text-sm border-b-2 border-slate-900 pb-1">Cockpit</button>
            <button onClick={() => router.push('/jobs')} className="text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">Pipeline</button>
            <button onClick={() => router.push('/messages')} className="text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">Messages</button>
            <button onClick={() => router.push('/wallet')} className="text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">Vault</button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Button onClick={() => router.push('/jobs/post')} className="bg-slate-900 hover:bg-cyan-600 text-white font-black px-8 h-12 rounded-2xl hidden sm:flex transition-all">
            <Plus className="w-4 h-4 mr-2" /> Launch Project
          </Button>
          <div className="h-12 w-12 rounded-2xl bg-slate-50 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
             {user?.avatar_url ? <Image src={user.avatar_url} alt="" width={48} height={48} /> : <LucideUser className="w-6 h-6 text-slate-300" />}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-12 py-16 space-y-16 relative z-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Client <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Cockpit</span></h1>
            <p className="text-slate-500 mt-4 text-xl font-medium">Strategic oversight for <span className="text-slate-900 font-black">{user?.full_name}</span></p>
          </div>
          <div className="flex gap-3">
             <Badge className="bg-cyan-50 border-cyan-100 text-cyan-700 px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">
               ELITE ENTERPRISE ACCESS
             </Badge>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
           {[
             { label: 'Vault Assets', value: `$${stats.walletBalance.toLocaleString()}`, icon: DollarSign, color: 'bg-slate-900', text: 'text-white' },
             { label: 'Active Operations', value: stats.activeProjects, icon: Briefcase, color: 'bg-cyan-500', text: 'text-cyan-600' },
             { label: 'Total Capital Outlay', value: `$${(stats.totalSpent / 1000).toFixed(1)}k`, icon: TrendingUp, color: 'bg-emerald-500', text: 'text-emerald-600' },
             { label: 'Specialized Talent', value: stats.hiredFreelancers, icon: Users, color: 'bg-purple-500', text: 'text-purple-600' },
             { label: 'Live Proposals', value: stats.pendingApplications, icon: Activity, color: 'bg-amber-500', text: 'text-amber-600' }
           ].map((stat, i) => (
             <Card key={i} className="bg-white border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8">
                   <div className="flex items-center justify-between mb-8">
                      <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                         <stat.icon className="w-6 h-6 text-white" />
                      </div>
                   </div>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main List */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project <span className="text-slate-400 font-medium">Timeline</span></h2>
               <button className="text-slate-500 text-sm font-black uppercase tracking-widest hover:text-slate-900 transition-colors">History Audit</button>
            </div>

            <div className="space-y-6">
               {projects.length > 0 ? projects.map((project) => (
                 <Card key={project.id} className="bg-white border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer group rounded-[2.5rem]" onClick={() => router.push(`/jobs/${project.id}`)}>
                    <CardContent className="p-8 flex items-center justify-between">
                       <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 transition-colors">
                             <Briefcase className="w-8 h-8 text-slate-400 group-hover:text-white" />
                          </div>
                          <div>
                             <h4 className="text-slate-900 font-black text-2xl tracking-tight group-hover:text-cyan-600 transition-colors">{project.title}</h4>
                             <div className="flex items-center gap-6 mt-2">
                                <p className="text-slate-500 font-bold flex items-center gap-2">
                                   <TrendingUp className="w-4 h-4 text-emerald-500" />
                                   <span className="text-slate-900">${project.budget_min}</span> - <span className="text-slate-900">${project.budget_max}</span>
                                </p>
                                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{project.category}</p>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-10">
                          <div className="hidden md:block text-right">
                             <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Status</p>
                             <Badge className="bg-slate-50 text-slate-900 border-slate-100 font-black px-4 py-1 rounded-lg uppercase text-[10px] tracking-widest">{project.status}</Badge>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                             <ChevronRight className="w-6 h-6" />
                          </div>
                       </div>
                    </CardContent>
                 </Card>
               )) : (
                 <div className="py-24 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem]">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                       <Plus className="w-10 h-10 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-black text-2xl tracking-tight">Empty Workspace</p>
                    <p className="text-slate-400 font-medium mt-2">Ready to deploy your next vision?</p>
                    <Button onClick={() => router.push('/jobs/post')} className="mt-10 h-14 bg-slate-900 hover:bg-cyan-600 text-white font-black px-12 rounded-2xl transition-all shadow-xl shadow-slate-200">Post First Job</Button>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
             <Card className="bg-slate-900 rounded-[3rem] overflow-hidden relative shadow-2xl shadow-slate-200">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] -mr-24 -mt-24" />
                <CardHeader className="p-10 pb-0 relative z-10">
                   <CardTitle className="text-white text-2xl font-black tracking-tight">Network Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-10 relative z-10">
                   <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                      <p className="text-[10px] text-cyan-400 mb-4 font-black uppercase tracking-[0.2em]">Hot Insight</p>
                      <p className="text-white font-medium text-lg leading-relaxed">You have <span className="text-white font-black">12 elite applications</span> for your Mobile App project.</p>
                      <Button className="w-full mt-8 h-14 bg-white text-slate-900 hover:bg-cyan-400 hover:text-white font-black text-sm rounded-2xl transition-all">Review Applications</Button>
                   </div>

                   <div className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-4">
                         <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                         <span className="text-white font-black text-sm tracking-widest uppercase">System Optimal</span>
                      </div>
                   </div>
                </CardContent>
             </Card>

             <div className="space-y-6">
                <h3 className="text-slate-900 font-black px-2 text-xl tracking-tight">Direct Actions</h3>
                <button
                  onClick={() => router.push('/freelancers')}
                  className="w-full flex items-center justify-between bg-white border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-100 transition-all p-8 rounded-[2.5rem] group"
                >
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-cyan-50 transition-colors">
                         <Search className="w-6 h-6 text-slate-400 group-hover:text-cyan-600" />
                      </div>
                      <span className="text-slate-900 font-black text-lg tracking-tight">Recruit Talent</span>
                   </div>
                   <ArrowUpRight className="w-6 h-6 text-slate-300 group-hover:text-slate-900 transition-colors" />
                </button>
                <button className="w-full flex items-center justify-between bg-white border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-100 transition-all p-8 rounded-[2.5rem] group">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                         <MessageSquare className="w-6 h-6 text-slate-400 group-hover:text-purple-600" />
                      </div>
                      <span className="text-slate-900 font-black text-lg tracking-tight">Secure Comms</span>
                   </div>
                   <ArrowUpRight className="w-6 h-6 text-slate-300 group-hover:text-slate-900 transition-colors" />
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
