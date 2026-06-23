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
import { DashboardLayout } from '@/components/dashboard/auth-guard'

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
      const [projRes, walletRes] = await Promise.all([
        fetch(`/api/projects?clientId=${user.id}`),
        fetch(`/api/wallet?userId=${user.id}`)
      ])

      const data = await projRes.json()
      const walletData = await walletRes.json()

      if (data.success) {
        setProjects(data.projects || [])
        setStats(prev => ({
          ...prev,
          activeProjects: data.projects?.filter((p: any) => p.status === 'open' || p.status === 'in_progress').length || 0,
          pendingApplications: 0
        }))
      }

      if (walletData.success) {
        setStats(prev => ({
          ...prev,
          walletBalance: walletData.wallet.balance,
          totalSpent: walletData.wallet.total_withdrawn || 0
        }))
      }
    } catch (err) {
      toast.error('Failed to sync workspace')
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><ELLoader /></div>

  return (
    <DashboardLayout navItems={navItems} userType="client">
      <div className="space-y-16 relative z-10 text-foreground">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase">Client <span className="bg-gradient-to-r from-success to-slate500 bg-clip-text text-transparent">Cockpit</span></h1>
            <p className="text-muted-foreground mt-4 text-xl font-medium">Strategic oversight for <span className="text-foreground font-black">{user?.full_name}</span></p>
          </div>
          <div className="flex gap-3">
             <Badge className="bg-success/10 border-success/20 text-success px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">
               ELITE ENTERPRISE ACCESS
             </Badge>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
           {[
             { label: 'Vault Assets', value: `$${stats.walletBalance.toLocaleString()}`, icon: DollarSign, color: 'bg-success', iconColor: 'text-success-foreground' },
             { label: 'Active Operations', value: stats.activeProjects, icon: Briefcase, color: 'bg-success/10', iconColor: 'text-success' },
             { label: 'Total Capital Outlay', value: `$${(stats.totalSpent / 1000).toFixed(1)}k`, icon: TrendingUp, color: 'bg-success/10', iconColor: 'text-success' },
             { label: 'Specialized Talent', value: stats.hiredFreelancers, icon: Users, color: 'bg-accent/10', iconColor: 'text-accent' },
             { label: 'Live Proposals', value: stats.pendingApplications, icon: Activity, color: 'bg-warning/10', iconColor: 'text-warning' }
           ].map((stat, i) => (
             <Card key={i} className="bg-card border border-border hover:border-success/20 hover:shadow-2xl hover:shadow-success/5 transition-all duration-500 group rounded-[2.5rem] overflow-hidden shadow-lg">
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
          {/* Main List */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">Project <span className="text-muted-foreground font-medium">Timeline</span></h2>
               <button className="text-muted-foreground text-sm font-black uppercase tracking-widest hover:text-foreground transition-colors">History Audit</button>
            </div>

            <div className="space-y-6">
               {projects.length > 0 ? projects.map((project) => (
                 <Card key={project.id} className="bg-card border border-border hover:border-success/20 hover:shadow-2xl hover:shadow-success/5 transition-all duration-500 cursor-pointer group rounded-[2.5rem] shadow-md" onClick={() => router.push(`/jobs/${project.id}`)}>
                    <CardContent className="p-8 flex items-center justify-between">
                       <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center border border-border group-hover:bg-success transition-colors">
                             <Briefcase className="w-8 h-8 text-muted-foreground group-hover:text-success-foreground" />
                          </div>
                          <div>
                             <h4 className="text-foreground font-black text-2xl tracking-tight group-hover:text-success transition-colors">{project.title}</h4>
                             <div className="flex items-center gap-6 mt-2">
                                <p className="text-muted-foreground font-bold flex items-center gap-2">
                                   <TrendingUp className="w-4 h-4 text-success" />
                                   <span className="text-foreground">${project.budget_min}</span> - <span className="text-foreground">${project.budget_max}</span>
                                </p>
                                <div className="w-1.5 h-1.5 bg-border rounded-full" />
                                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">{project.category}</p>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-10">
                          <div className="hidden md:block text-right">
                             <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Status</p>
                             <Badge className="bg-muted text-foreground border-border font-black px-4 py-1 rounded-lg uppercase text-[10px] tracking-widest">{project.status}</Badge>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-success group-hover:text-success-foreground transition-all">
                             <ChevronRight className="w-6 h-6" />
                          </div>
                       </div>
                    </CardContent>
                 </Card>
               )) : (
                 <div className="py-24 text-center bg-card border-2 border-dashed border-border rounded-[4rem] shadow-inner">
                    <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                       <Plus className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <p className="text-foreground font-black text-2xl tracking-tight uppercase">Empty Workspace</p>
                    <p className="text-muted-foreground font-medium mt-2">Ready to deploy your next vision?</p>
                    <Button onClick={() => router.push('/jobs/post')} className="mt-10 h-14 bg-success hover:bg-success/90 text-success-foreground font-black px-12 rounded-2xl transition-all shadow-xl shadow-success/20">Post First Job</Button>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
             <Card className="bg-secondary border-none rounded-[3rem] overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-success/10 rounded-full blur-[80px] -mr-24 -mt-24" />
                <CardHeader className="p-10 pb-0 relative z-10">
                   <CardTitle className="text-foreground text-2xl font-black tracking-tight uppercase">Network Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-10 relative z-10">
                   <div className="p-8 bg-background/10 rounded-[2rem] border border-border backdrop-blur-sm">
                      <p className="text-[10px] text-success mb-4 font-black uppercase tracking-[0.2em]">Hot Insight</p>
                      <p className="text-foreground font-medium text-lg leading-relaxed">You have <span className="text-foreground font-black">12 elite applications</span> for your Mobile App project.</p>
                      <Button className="w-full mt-8 h-14 bg-success text-success-foreground hover:opacity-90 font-black text-sm rounded-2xl transition-all uppercase tracking-widest border-none">Review Applications</Button>
                   </div>

                   <div className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-4">
                         <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                         <span className="text-foreground font-black text-xs tracking-widest uppercase">System Optimal</span>
                      </div>
                   </div>
                </CardContent>
             </Card>

             <div className="space-y-6">
                <h3 className="text-foreground font-black px-2 text-xl tracking-tight uppercase">Direct Actions</h3>
                <button
                  onClick={() => router.push('/freelancers')}
                  className="w-full flex items-center justify-between bg-card border border-border hover:border-success/20 hover:shadow-2xl hover:shadow-success/5 transition-all p-8 rounded-[2.5rem] group shadow-sm"
                >
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-success/10 transition-colors">
                         <Search className="w-6 h-6 text-muted-foreground group-hover:text-success" />
                      </div>
                      <span className="text-foreground font-black text-lg tracking-tight uppercase">Recruit Talent</span>
                   </div>
                   <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
                <button onClick={() => router.push('/messages')} className="w-full flex items-center justify-between bg-card border border-border hover:border-success/20 hover:shadow-2xl hover:shadow-success/5 transition-all p-8 rounded-[2.5rem] group shadow-sm">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-success/10 transition-colors">
                         <MessageSquare className="w-6 h-6 text-muted-foreground group-hover:text-success" />
                      </div>
                      <span className="text-foreground font-black text-lg tracking-tight uppercase">Secure Comms</span>
                   </div>
                   <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
