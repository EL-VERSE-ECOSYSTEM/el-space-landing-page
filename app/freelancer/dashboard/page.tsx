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
import { DashboardLayout } from '@/components/dashboard/auth-guard'

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
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const [appRes, walletRes] = await Promise.all([
        fetch(`/api/applications?freelancerId=${user.id}`),
        fetch(`/api/wallet?userId=${user.id}`)
      ])

      const data = await appRes.json()
      const walletData = await walletRes.json()

      if (data.success) {
        setApplications(data.applications || [])
        const activeCount = data.applications?.filter((a: any) => a.status === 'accepted').length || 0
        setStats(prev => ({
          ...prev,
          activeJobs: activeCount,
        }))
      }

      if (walletData.success) {
        setStats(prev => ({
          ...prev,
          walletBalance: walletData.wallet.balance,
          totalEarnings: walletData.wallet.total_earned || 0,
          pendingPayments: walletData.wallet.pending_balance || 0,
          jobSuccess: 100 // placeholder for now, ideally from profile
        }))
      }
    } catch (err) {
      toast.error('Failed to sync network data')
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: 'Opportunities', href: '/jobs' },
    { label: 'Dossier', href: '/portfolio' },
    { label: 'Vault', href: '/wallet' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><ELLoader /></div>

  return (
    <DashboardLayout navItems={navItems} userType="freelancer">
      <div className="space-y-16 relative z-10">
        {/* Profile Snapshot */}
        <div className="flex flex-col md:flex-row items-center gap-12 bg-card p-12 rounded-[3.5rem] border border-border shadow-2xl shadow-primary/5">
           <div className="w-32 h-32 rounded-[2.5rem] bg-accent flex items-center justify-center font-black text-5xl text-accent-foreground shadow-2xl shadow-accent/20">
              {(user?.full_name || 'U').charAt(0)}
           </div>
           <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                 <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter">{user?.full_name}</h1>
                 <Badge className="w-fit mx-auto md:mx-0 bg-accent/10 border-accent/20 text-accent px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                   TOP-RATED ELITE
                 </Badge>
              </div>
              <div className="text-muted-foreground mt-4 text-base md:text-lg font-medium flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6">
                 <span className="flex items-center gap-2"><Star className="w-5 h-5 text-slate-400 fill-slate-400" /> <span className="text-foreground font-black">4.98</span> (124 reviews)</span>
                 <div className="hidden md:block w-1.5 h-1.5 bg-border rounded-full" />
                 <span className="flex items-center gap-2 text-accent font-black tracking-tight"><Zap className="w-5 h-5" /> Elite Vanguard Status</span>
              </div>
           </div>
           <div className="flex gap-4">
              <Button onClick={() => router.push('/settings')} variant="outline" className="h-14 border-2 border-border text-foreground font-black rounded-2xl px-8 hover:bg-muted">Workspace Settings</Button>
              <Button className="h-14 bg-accent hover:opacity-90 text-accent-foreground font-black px-10 rounded-2xl shadow-xl shadow-accent/20">Share Credentials</Button>
           </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
           {[
             { label: 'Vault Balance', value: `$${stats.walletBalance.toLocaleString()}`, icon: WalletIcon, color: 'bg-accent', iconColor: 'text-accent-foreground' },
             { label: 'Global Yield', value: `$${(stats.totalEarnings / 1000).toFixed(1)}k`, icon: DollarSign, color: 'bg-slate-500/10', iconColor: 'text-slate-500' },
             { label: 'Active Pipeline', value: stats.activeJobs, icon: Briefcase, color: 'bg-accent/10', iconColor: 'text-accent' },
             { label: 'Settlement Escrow', value: `$${stats.pendingPayments.toLocaleString()}`, icon: Clock, color: 'bg-warning/10', iconColor: 'text-warning' },
             { label: 'Mission Success', value: `${stats.jobSuccess}%`, icon: CheckCircle, color: 'bg-slate-700', iconColor: 'text-slate-700-foreground' }
           ].map((stat, i) => (
             <Card key={i} className="bg-card border border-border hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 group rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8">
                   <div className="flex items-center justify-between mb-8">
                      <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                         <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                   </div>
                   <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                   <h3 className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</h3>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-10">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-black text-foreground tracking-tight">Active <span className="text-muted-foreground font-medium">Missions</span></h2>
                <button className="text-muted-foreground text-sm font-black uppercase tracking-widest hover:text-foreground transition-colors" onClick={() => router.push('/applications')}>History Audit</button>
             </div>

             <div className="space-y-6">
                {applications.length > 0 ? applications.map((app) => (
                  <Card key={app.id} className="bg-card border border-border hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 cursor-pointer group rounded-[2.5rem]">
                     <CardContent className="p-8 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                           <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center border border-border group-hover:bg-accent transition-colors">
                              <Rocket className="w-8 h-8 text-muted-foreground group-hover:text-accent-foreground" />
                           </div>
                           <div>
                              <h4 className="text-foreground font-black text-2xl tracking-tight group-hover:text-accent transition-colors">{app.project?.title || 'Unknown Project'}</h4>
                              <div className="flex items-center gap-6 mt-2">
                                 <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Status: <span className="text-accent ml-2">{app.status}</span></p>
                                 <div className="w-1.5 h-1.5 bg-border rounded-full" />
                                 <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">{new Date(app.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                           <ChevronRight className="w-6 h-6" />
                        </div>
                     </CardContent>
                  </Card>
                )) : (
                  <div className="py-24 text-center bg-muted border-2 border-dashed border-border rounded-[4rem]">
                     <div className="w-20 h-20 bg-card rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <Rocket className="w-10 h-10 text-muted-foreground/30" />
                     </div>
                     <p className="text-muted-foreground font-black text-2xl tracking-tight">Mission Board Empty</p>
                     <p className="text-muted-foreground font-medium mt-2">Ready to deploy your technical prowess?</p>
                     <Button onClick={() => router.push('/jobs')} className="mt-10 h-14 bg-accent hover:opacity-90 text-accent-foreground font-black px-12 rounded-2xl transition-all shadow-xl shadow-accent/20">Scout Opportunities</Button>
                  </div>
                )}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
             <Card className="bg-secondary rounded-[3.5rem] overflow-hidden relative shadow-2xl shadow-accent/5 border-none">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-[80px] -mr-24 -mt-24" />
                <CardHeader className="p-10 pb-0 relative z-10">
                   <CardTitle className="text-foreground text-2xl font-black tracking-tight">Intelligence Feed</CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-8 relative z-10">
                   <div className="p-8 bg-background/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm group hover:bg-background/10 transition-all cursor-pointer">
                      <p className="text-[10px] text-accent mb-4 font-black uppercase tracking-[0.2em]">Priority Match</p>
                      <p className="text-foreground font-medium text-lg leading-relaxed">"NextJS Expert" matches your profile.</p>
                      <button className="text-muted-foreground text-[10px] font-black uppercase mt-6 tracking-widest group-hover:text-foreground transition-colors">Analyze Project →</button>
                   </div>
                   <div className="p-8 bg-background/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm group hover:bg-background/10 transition-all cursor-pointer">
                      <p className="text-[10px] text-slate-500 mb-4 font-black uppercase tracking-[0.2em]">Settlement</p>
                      <p className="text-foreground font-medium text-lg leading-relaxed">$450 cleared for "UI Design".</p>
                      <button className="text-muted-foreground text-[10px] font-black uppercase mt-6 tracking-widest group-hover:text-foreground transition-colors">Access Vault →</button>
                   </div>
                </CardContent>
             </Card>

             <div className="grid grid-cols-2 gap-6">
                <button onClick={() => router.push('/messages')} className="bg-card border border-border hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all p-8 rounded-[2.5rem] text-center group">
                   <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                      <MessageSquare className="w-6 h-6 text-muted-foreground group-hover:text-accent" />
                   </div>
                   <p className="text-foreground font-black text-sm tracking-tight">Secure Comms</p>
                </button>
                <button onClick={() => router.push('/portfolio')} className="bg-card border border-border hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all p-8 rounded-[2.5rem] text-center group">
                   <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                      <Briefcase className="w-6 h-6 text-muted-foreground group-hover:text-accent" />
                   </div>
                   <p className="text-foreground font-black text-sm tracking-tight">Dossier</p>
                </button>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
