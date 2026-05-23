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
  Zap, Briefcase, Globe, ChevronRight, Wallet as WalletIcon
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
    jobSuccess: 0,
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
      const [appRes, walletRes] = await Promise.all([
        fetch(`/api/applications?freelancerId=${user?.id}`),
        fetch(`/api/wallet?userId=${user?.id}`)
      ])

      const data = await appRes.json()
      const walletData = await walletRes.json()

      if (data.success) {
        setApplications(data.applications || [])
        setStats(prev => ({
          ...prev,
          totalEarnings: 8450,
          activeJobs: 3,
          pendingPayments: 1200,
          jobSuccess: 98
        }))
      }

      if (walletData.success) {
        setStats(prev => ({ ...prev, walletBalance: walletData.wallet.balance }))
      }
    } catch (err) {
      toast.error('Failed to sync network data')
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
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Freelancer</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button className="text-slate-900 font-black text-sm border-b-2 border-slate-900 pb-1">Dashboard</button>
            <button onClick={() => router.push('/jobs')} className="text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">Opportunities</button>
            <button onClick={() => router.push('/portfolio')} className="text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">Dossier</button>
            <button onClick={() => router.push('/wallet')} className="text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">Vault</button>
            <button onClick={() => router.push('/messages')} className="text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">Messages</button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Button onClick={() => router.push('/jobs')} className="bg-slate-900 hover:bg-cyan-600 text-white font-black px-8 h-12 rounded-2xl hidden sm:flex transition-all">
             Hunt Opportunities
          </Button>
          <div className="h-12 w-12 rounded-2xl bg-slate-50 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
             {user?.avatar_url ? <Image src={user.avatar_url} alt="" width={48} height={48} /> : <div className="font-black text-slate-300 text-xl">{(user?.full_name || 'U').charAt(0)}</div>}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-12 py-16 space-y-16 relative z-10">
        {/* Profile Snapshot */}
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-100/50">
           <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center font-black text-5xl text-cyan-400 shadow-2xl shadow-slate-200">
              {(user?.full_name || 'U').charAt(0)}
           </div>
           <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                 <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{user?.full_name}</h1>
                 <Badge className="w-fit mx-auto md:mx-0 bg-cyan-50 border-cyan-100 text-cyan-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                   TOP-RATED ELITE
                 </Badge>
              </div>
              <p className="text-slate-500 mt-4 text-lg font-medium flex items-center justify-center md:justify-start gap-6">
                 <span className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-400 fill-amber-400" /> <span className="text-slate-900 font-black">4.98</span> (124 reviews)</span>
                 <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                 <span className="flex items-center gap-2 text-cyan-600 font-black tracking-tight"><Zap className="w-5 h-5" /> Elite Vanguard Status</span>
              </p>
           </div>
           <div className="flex gap-4">
              <Button onClick={() => router.push('/settings')} variant="outline" className="h-14 border-2 border-slate-100 text-slate-900 font-black rounded-2xl px-8 hover:bg-slate-50">Workspace Settings</Button>
              <Button className="h-14 bg-slate-900 hover:bg-cyan-600 text-white font-black px-10 rounded-2xl shadow-xl shadow-slate-200">Share Credentials</Button>
           </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
           {[
             { label: 'Vault Balance', value: `$${stats.walletBalance.toLocaleString()}`, icon: WalletIcon, color: 'bg-slate-900' },
             { label: 'Global Yield', value: `$${(stats.totalEarnings / 1000).toFixed(1)}k`, icon: DollarSign, color: 'bg-emerald-500' },
             { label: 'Active Pipeline', value: stats.activeJobs, icon: Briefcase, color: 'bg-blue-500' },
             { label: 'Settlement Escrow', value: `$${stats.pendingPayments.toLocaleString()}`, icon: Clock, color: 'bg-amber-500' },
             { label: 'Mission Success', value: `${stats.jobSuccess}%`, icon: CheckCircle, color: 'bg-cyan-500' }
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
          <div className="lg:col-span-8 space-y-10">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active <span className="text-slate-400 font-medium">Missions</span></h2>
                <button className="text-slate-500 text-sm font-black uppercase tracking-widest hover:text-slate-900 transition-colors" onClick={() => router.push('/applications')}>History Audit</button>
             </div>

             <div className="space-y-6">
                {applications.length > 0 ? applications.map((app) => (
                  <Card key={app.id} className="bg-white border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer group rounded-[2.5rem]">
                     <CardContent className="p-8 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 transition-colors">
                              <Rocket className="w-8 h-8 text-slate-400 group-hover:text-white" />
                           </div>
                           <div>
                              <h4 className="text-slate-900 font-black text-2xl tracking-tight group-hover:text-purple-600 transition-colors">{app.project?.title || 'Unknown Project'}</h4>
                              <div className="flex items-center gap-6 mt-2">
                                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Status: <span className="text-purple-600 ml-2">{app.status}</span></p>
                                 <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                 <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{new Date(app.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                           <ChevronRight className="w-6 h-6" />
                        </div>
                     </CardContent>
                  </Card>
                )) : (
                  <div className="py-24 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem]">
                     <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <Rocket className="w-10 h-10 text-slate-200" />
                     </div>
                     <p className="text-slate-400 font-black text-2xl tracking-tight">Mission Board Empty</p>
                     <p className="text-slate-400 font-medium mt-2">Ready to deploy your technical prowess?</p>
                     <Button onClick={() => router.push('/jobs')} className="mt-10 h-14 bg-slate-900 hover:bg-cyan-600 text-white font-black px-12 rounded-2xl transition-all shadow-xl shadow-slate-200">Scout Opportunities</Button>
                  </div>
                )}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
             <Card className="bg-slate-900 rounded-[3.5rem] overflow-hidden relative shadow-2xl shadow-slate-200">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] -mr-24 -mt-24" />
                <CardHeader className="p-10 pb-0 relative z-10">
                   <CardTitle className="text-white text-2xl font-black tracking-tight">Intelligence Feed</CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-8 relative z-10">
                   <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.08] transition-all cursor-pointer">
                      <p className="text-[10px] text-cyan-400 mb-4 font-black uppercase tracking-[0.2em]">Priority Match</p>
                      <p className="text-white font-medium text-lg leading-relaxed">"NextJS Expert" matches your profile.</p>
                      <button className="text-slate-400 text-[10px] font-black uppercase mt-6 tracking-widest group-hover:text-white transition-colors">Analyze Project →</button>
                   </div>
                   <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.08] transition-all cursor-pointer">
                      <p className="text-[10px] text-emerald-400 mb-4 font-black uppercase tracking-[0.2em]">Settlement</p>
                      <p className="text-white font-medium text-lg leading-relaxed">$450 cleared for "UI Design".</p>
                      <button className="text-slate-400 text-[10px] font-black uppercase mt-6 tracking-widest group-hover:text-white transition-colors">Access Vault →</button>
                   </div>
                </CardContent>
             </Card>

             <div className="grid grid-cols-2 gap-6">
                <button onClick={() => router.push('/messages')} className="bg-white border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-100 transition-all p-8 rounded-[2.5rem] text-center group">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-50 transition-colors">
                      <MessageSquare className="w-6 h-6 text-slate-400 group-hover:text-cyan-600" />
                   </div>
                   <p className="text-slate-900 font-black text-sm tracking-tight">Secure Comms</p>
                </button>
                <button onClick={() => router.push('/portfolio')} className="bg-white border border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-100 transition-all p-8 rounded-[2.5rem] text-center group">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-50 transition-colors">
                      <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-purple-600" />
                   </div>
                   <p className="text-slate-900 font-black text-sm tracking-tight">Dossier</p>
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
