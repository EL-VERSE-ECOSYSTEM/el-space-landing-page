'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import {
  LayoutDashboard, Users, DollarSign, FileText, Settings, LogOut,
  CheckCircle, XCircle, BarChart3, TrendingUp, Activity, Bell,
  Eye, Shield, Wallet, MessageSquare, Briefcase, ChevronRight,
  ArrowUpRight, ArrowDownLeft, Clock, Search, Filter, MoreVertical,
  Loader, Rocket, ShieldCheck, Building, User
} from 'lucide-react'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    pendingPayments: 0,
    totalJobListings: 0,
    pendingApprovals: 0,
    activeDisputes: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0
  })
  const [users, setUsers] = useState<any[]>([])
  const [verifications, setVerifications] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [transfers, setTransfers] = useState<any[]>([])
  const [deposits, setDeposits] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      setIsAuthenticated(true)
      fetchAdminData()
    }
  }, [])

  const handleLogin = async () => {
    if (!password) {
      toast.error('Please enter the security PIN')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: password }),
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminLoginTime', new Date().getTime().toString())
        setIsAuthenticated(true)
        toast.success('Admin access granted')
        fetchAdminData()
      } else {
        toast.error(data.error || 'Access Denied')
        setPassword('')
      }
    } catch (error) {
      toast.error('Connection failure to security gateway')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminLoginTime')
    setIsAuthenticated(false)
    setPassword('')
    router.push('/')
  }

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes, paymentsRes, jobsRes, withdrawalsRes, verificationsRes, transfersRes, depositsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/payments'),
        fetch('/api/admin/jobs'),
        fetch('/api/admin/withdrawals'),
        fetch('/api/admin/verifications'),
        fetch('/api/admin/transfers'),
        fetch('/api/admin/deposits')
      ])

      const [statsData, usersData, paymentsData, jobsData, withdrawalsData, verificationsData, transfersData, depositsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        paymentsRes.json(),
        jobsRes.json(),
        withdrawalsRes.json(),
        verificationsRes.json(),
        transfersRes.json(),
        depositsRes.json()
      ])

      if (statsData.success) setStats(statsData.stats)
      if (usersData.success) setUsers(usersData.users || [])
      if (paymentsData.success) setPayments(paymentsData.payments || [])
      if (jobsData.success) setJobs(jobsData.jobs || [])
      if (withdrawalsData.success) setWithdrawals(withdrawalsData.withdrawals || [])
      if (verificationsData.success) setVerifications(verificationsData.verifications || [])
      if (transfersData.success) setTransfers(transfersData.transfers || [])
      if (depositsData.success) setDeposits(depositsData.deposits || [])

    } catch (error) {
      console.error('Admin data load error:', error)
      toast.error('Failed to synchronize admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (endpoint: string, method: string, body: any, successMsg: string) => {
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        toast.success(successMsg)
        fetchAdminData()
      } else {
        throw new Error('Action failed')
      }
    } catch (error) {
      toast.error('System error processing request')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-foreground">
        {/* Cinematic Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="w-full max-w-lg relative z-10">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary via-blue-600 to-purple-700 shadow-2xl shadow-primary/20 mb-6 group transition-transform hover:scale-110">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter mb-2 uppercase">Core Access</h1>
            <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px]">EL SPACE INFRASTRUCTURE</p>
          </div>

          <Card className="bg-card/40 backdrop-blur-3xl border-border shadow-2xl overflow-hidden rounded-[3rem] p-2 animate-in zoom-in-95 duration-500">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Security Protocol</label>
                  <div className="relative group">
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="bg-background/5 border-border text-foreground h-20 text-center text-3xl tracking-[0.5em] focus:ring-primary/20 focus:border-primary/50 transition-all rounded-[2rem] placeholder:text-muted-foreground/30"
                    />
                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full h-20 bg-primary text-primary-foreground hover:bg-primary/90 font-black text-xl rounded-[2rem] transition-all duration-500 shadow-xl shadow-primary/20 active:scale-95 group overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? <Loader className="w-6 h-6 animate-spin" /> : "AUTHENTICATE"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>

              <div className="flex items-center justify-center gap-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">System Online · Encrypted Session</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
             <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.5em]">Unauthorized Access is Prohibited</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
      {/* Premium Sidebar */}
      <aside className="w-full md:w-80 bg-card/40 backdrop-blur-3xl border-r border-border flex flex-col relative z-30">
        <div className="p-8 border-b border-border relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <div>
                <h2 className="text-xl font-black text-foreground tracking-tighter">EL SPACE</h2>
                <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Control Matrix</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
          <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">Core Infrastructure</p>
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Analytics Hub' },
            { id: 'users', icon: Users, label: 'User Ecosystem' },
            { id: 'payments', icon: DollarSign, label: 'Global Ledger' },
            { id: 'withdrawals', icon: Wallet, label: 'Capital Outflow' },
            { id: 'transfers', icon: ArrowUpRight, label: 'Internal Transfers' },
            { id: 'deposits', icon: TrendingUp, label: 'Funding Requests' },
            { id: 'verifications', icon: ShieldCheck, label: 'Verification Queue' },
            { id: 'jobs', icon: Briefcase, label: 'Deployment Board' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                activeTab === item.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {activeTab === item.id && (
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-md animate-in fade-in zoom-in-95" />
              )}
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
              )}
              <item.icon className={`w-5 h-5 relative z-10 transition-colors ${activeTab === item.id ? 'text-primary' : 'group-hover:text-primary'}`} />
              <span className="relative z-10">{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight className="w-4 h-4 ml-auto relative z-10 text-primary animate-pulse" />
              )}
            </button>
          ))}

          <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-12 mb-4">Security & Support</p>
          {[
            { id: 'disputes', icon: Shield, label: 'Incident Reports' },
            { id: 'settings', icon: Settings, label: 'System Kernel' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative ${
                activeTab === item.id
                ? 'text-foreground bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
               <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-purple-500' : 'group-hover:text-purple-500'}`} />
               {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-border bg-muted/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <header className="h-24 bg-card/30 backdrop-blur-3xl border-b border-border flex items-center justify-between px-12 sticky top-0 z-20">
          <div className="flex items-center gap-8 flex-1 max-w-2xl">
            <h1 className="text-2xl font-black text-foreground tracking-tighter hidden lg:block">DASHBOARD</h1>
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Query system intelligence..."
                className="bg-background border-border pl-12 h-12 focus:ring-primary/10 focus:border-primary/30 rounded-2xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-6 px-6 py-2 bg-muted/50 rounded-2xl border border-border">
               <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Security Clearance</p>
                  <p className="text-xs font-bold text-primary leading-none mt-1 uppercase">LVL 4 ADMINISTRATOR</p>
               </div>
               <div className="w-px h-8 bg-border" />
               <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Status</p>
                  <p className="text-xs font-bold text-emerald-500 leading-none mt-1 uppercase">Operational</p>
               </div>
            </div>

            <button className="relative p-3 bg-muted/50 rounded-2xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-foreground leading-none">System Admin</p>
                  <p className="text-[10px] font-bold text-muted-foreground leading-none mt-1 uppercase">Superuser</p>
               </div>
               <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-purple-700 p-[2px] shadow-lg shadow-primary/10">
                 <div className="h-full w-full rounded-[14px] bg-background flex items-center justify-center font-black text-sm text-foreground">
                   AD
                 </div>
               </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="h-[calc(100vh-96px)] flex items-center justify-center">
            <ELLoader />
          </div>
        ) : (
          <div className="p-12 max-w-[1600px] mx-auto">
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">Network Vitality</h2>
                    <p className="text-muted-foreground mt-3 font-bold uppercase tracking-[0.2em] text-[10px]">Ecosystem Intelligence Dashboard · Real-time Feed</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-border bg-card hover:bg-muted font-bold text-xs uppercase tracking-widest">
                       <Clock className="w-4 h-4 mr-2" />
                       Last 24 Hours
                    </Button>
                    <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-105 uppercase text-xs tracking-widest">
                      Generate Audit
                    </Button>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'Network Entities', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500', change: '+12.5%', detail: 'Total registered accounts' },
                    { label: 'Ecosystem Flow', value: `$${stats.totalPayments}`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', change: '+8.2%', detail: 'Gross volume processed' },
                    { label: 'Active Deployments', value: stats.totalJobListings, icon: Briefcase, color: 'from-purple-500 to-indigo-500', change: '+3 new', detail: 'Marketplace listings' },
                    { label: 'Capital Reserve', value: stats.pendingWithdrawals, icon: Wallet, color: 'from-orange-500 to-red-500', change: 'Critical', detail: 'Pending verification' },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-card border-border hover:border-primary/20 transition-all group relative overflow-hidden rounded-[2.5rem] shadow-xl">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity`} />
                      <CardContent className="p-8 relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                          <Badge className={`border-none font-black text-[10px] py-1 px-3 rounded-full ${
                             stat.change === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {stat.change}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                          <h3 className="text-4xl font-black text-foreground mt-2 tracking-tighter">{stat.value}</h3>
                          <p className="text-muted-foreground/60 text-[10px] mt-4 font-bold uppercase tracking-widest">{stat.detail}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <Card className="lg:col-span-2 bg-card border-border rounded-[2.5rem] overflow-hidden group shadow-2xl">
                      <CardHeader className="p-8 border-b border-border">
                        <CardTitle className="text-foreground flex items-center gap-4 text-xl font-black uppercase tracking-tight">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Activity className="w-6 h-6 text-primary" />
                          </div>
                          Core Vitality Matrix
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                         <div className="h-[400px] relative flex flex-col items-center justify-center bg-muted/5">
                            {/* Abstract Visualization */}
                            <div className="absolute inset-0 opacity-10">
                               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                            </div>

                            <div className="relative text-center space-y-4">
                               <div className="flex gap-1 items-end justify-center mb-6">
                                  {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60].map((h, i) => (
                                    <div
                                      key={i}
                                      className="w-3 bg-gradient-to-t from-primary to-blue-500 rounded-full animate-bounce"
                                      style={{ height: `${h}px`, animationDelay: `${i * 0.1}s`, animationDuration: '2s' }}
                                    />
                                  ))}
                               </div>
                               <p className="text-primary font-black text-xs uppercase tracking-[0.5em] animate-pulse">Synchronizing Neural Link</p>
                               <p className="text-muted-foreground text-[10px] font-bold max-w-[200px] mx-auto uppercase tracking-widest leading-relaxed">Global transaction monitoring system is active and secure</p>
                            </div>
                         </div>
                      </CardContent>
                   </Card>

                   <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden group shadow-2xl">
                      <CardHeader className="p-8 border-b border-border">
                        <CardTitle className="text-foreground text-xl font-black uppercase tracking-tight">Quick Deploy</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-4">
                         {[
                           { label: 'Audit Access', icon: Shield, color: 'text-primary', bg: 'bg-primary/10' },
                           { label: 'Broadcast', icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                           { label: 'Maintenance', icon: Settings, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                           { label: 'System Reboot', icon: Activity, color: 'text-red-500', bg: 'bg-red-500/10' },
                         ].map((action, i) => (
                           <button
                             key={i}
                             className="w-full flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all group/btn"
                           >
                             <div className={`p-2 rounded-lg ${action.bg} ${action.color} group-hover/btn:scale-110 transition-transform`}>
                               <action.icon className="w-5 h-5" />
                             </div>
                             <span className="text-sm font-black text-foreground uppercase tracking-widest">{action.label}</span>
                             <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                         ))}

                         <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                               <p className="text-white font-black text-lg leading-tight uppercase">Upgrade<br/>Nodes</p>
                               <p className="text-indigo-200 text-[10px] font-bold mt-2 uppercase tracking-widest">Version 4.2.0 Stable</p>
                            </div>
                            <Rocket className="absolute -bottom-2 -right-2 w-20 h-20 text-white/10 -rotate-12" />
                         </div>
                      </CardContent>
                   </Card>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">User Ecosystem</h2>
                    <p className="text-muted-foreground mt-3 font-bold uppercase tracking-[0.2em] text-[10px]">Access Management & Identity Matrix</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                       <Input placeholder="Filter by ID, Email, or Name..." className="bg-background border-border pl-12 h-12 w-80 rounded-2xl shadow-sm" />
                    </div>
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-border bg-card hover:bg-muted font-bold text-xs uppercase tracking-widest">
                      <Filter className="w-4 h-4 mr-2" />
                      Matrix Filters
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {users.map((user) => (
                    <Card key={user.id} className="bg-card border-border hover:border-primary/20 transition-all duration-500 group rounded-[2rem] overflow-hidden shadow-lg">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row items-stretch">
                           <div className="p-8 flex items-center gap-6 flex-1 bg-gradient-to-r from-transparent to-muted/20">
                              <div className="relative">
                                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center font-black text-2xl border-2 border-border group-hover:border-primary/50 transition-colors overflow-hidden">
                                  {user.avatar_url ? (
                                    <Image src={user.avatar_url} alt="" width={80} height={80} className="object-cover" />
                                  ) : (
                                    (user.full_name || user.email || 'U').charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-card ${
                                   user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                                }`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-xl font-black text-foreground">{user.full_name || 'Anonymous User'}</h4>
                                  <Badge className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none ${
                                     user.role === 'client' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                                  }`}>
                                    {user.role}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground font-bold text-sm">{user.email}</p>
                                <p className="text-[10px] font-black text-primary/60 mt-2 uppercase tracking-tighter">Registered: {new Date(user.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 p-8 border-l border-border flex-[1.5]">
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Matrix Identity</p>
                                <p className="text-foreground font-mono text-xs bg-muted px-2 py-1 rounded inline-block">ID-{user.el_space_id || user.id.slice(0, 8)}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Available Capital</p>
                                <p className="text-2xl font-black text-emerald-500">${user.balance || '0.00'}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Security Status</p>
                                <div className="flex items-center gap-2">
                                   <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                   <span className={`text-xs font-black uppercase ${user.status === 'active' ? 'text-emerald-500' : 'text-red-500'}`}>{user.status}</span>
                                </div>
                              </div>
                           </div>

                           <div className="p-8 flex items-center justify-end gap-3 bg-muted/5 border-l border-border">
                              <Button variant="outline" className="h-12 w-12 rounded-2xl border-border bg-background hover:bg-muted p-0">
                                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="outline"
                                className={`h-12 px-6 rounded-2xl font-black text-[10px] tracking-widest transition-all uppercase ${
                                  user.status === 'active'
                                  ? 'border-red-500/20 text-red-500 hover:bg-red-500/10'
                                  : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                                }`}
                                onClick={() => handleAction(`/api/admin/users/${user.id}`, 'PATCH', { status: user.status === 'active' ? 'suspended' : 'active' }, 'Security policy updated')}
                              >
                                {user.status === 'active' ? 'Suspend' : 'Restore'}
                              </Button>
                              <Button variant="outline" className="h-12 w-12 rounded-2xl border-border bg-background hover:bg-muted p-0">
                                <MoreVertical className="w-5 h-5 text-muted-foreground" />
                              </Button>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'deposits' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">Funding Requests</h2>
                    <p className="text-muted-foreground mt-3 font-bold uppercase tracking-[0.2em] text-[10px]">Manual Deposit Verification Pipeline</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {deposits.length > 0 ? deposits.map((dep) => (
                    <Card key={dep.id} className="bg-card border-border overflow-hidden rounded-[2.5rem] group hover:border-primary/30 transition-all duration-500 shadow-lg">
                      <CardContent className="p-10">
                        <div className="flex flex-col lg:flex-row gap-10">
                           <div className="flex-1 space-y-6">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center font-black text-xl border border-border">
                                    {dep.user?.full_name?.charAt(0)}
                                 </div>
                                 <div>
                                    <h3 className="text-2xl font-black text-foreground">{dep.user?.full_name}</h3>
                                    <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">{dep.user?.el_space_id} • {dep.currency}</p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Volume</p>
                                    <p className="text-3xl font-black text-foreground">${dep.amount.toLocaleString()}</p>
                                 </div>
                                 <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Method</p>
                                    <p className="text-foreground font-black uppercase text-xs tracking-widest">{dep.method?.replace('_', ' ')}</p>
                                 </div>
                              </div>

                              <div className="p-4 bg-muted rounded-2xl border border-border">
                                 <a href={dep.receipt_url} target="_blank" className="flex items-center gap-3 text-primary hover:text-primary/80 font-black text-[10px] uppercase tracking-widest">
                                    <FileText className="w-5 h-5" /> View Payment Receipt
                                 </a>
                              </div>
                           </div>

                           <div className="w-full lg:w-72 flex flex-col gap-3 justify-center p-8 bg-muted/10 rounded-[2rem] border border-border">
                              {dep.status === 'pending' ? (
                                <>
                                  <Button
                                    className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20"
                                    onClick={() => handleAction('/api/admin/deposits', 'PATCH', { depositId: dep.id, status: 'approved' }, 'Funding approved and credited')}
                                  >
                                    Confirm Deposit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="h-14 text-red-500 hover:text-red-600 font-black rounded-2xl uppercase text-[10px] tracking-widest"
                                    onClick={() => handleAction('/api/admin/deposits', 'PATCH', { depositId: dep.id, status: 'rejected' }, 'Deposit proof rejected')}
                                  >
                                    Reject Proof
                                  </Button>
                                </>
                              ) : (
                                <Badge className={`h-12 flex items-center justify-center rounded-xl font-black border-none uppercase text-[10px] tracking-widest ${
                                  dep.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                  {dep.status}
                                </Badge>
                              )}
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="text-center py-20 bg-card border-2 border-dashed border-border rounded-[2rem]">
                       <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">No active funding requests</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'transfers' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">Internal Transfers</h2>
                    <p className="text-muted-foreground mt-3 font-bold uppercase tracking-[0.2em] text-[10px]">Peer-to-Peer Transfer Authorization</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {transfers.length > 0 ? transfers.map((tx) => (
                    <Card key={tx.id} className="bg-card border-border overflow-hidden rounded-[2.5rem] group hover:border-primary/30 transition-all duration-500 shadow-lg">
                      <CardContent className="p-10">
                        <div className="flex flex-col xl:flex-row justify-between gap-10">
                          <div className="flex-1 space-y-8">
                             <div className="flex items-center gap-12">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black text-primary">
                                      {tx.sender?.full_name?.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sender</p>
                                      <p className="text-foreground font-bold">{tx.sender?.full_name}</p>
                                      <p className="text-xs text-muted-foreground font-mono">{tx.sender?.el_space_id}</p>
                                   </div>
                                </div>
                                <ArrowUpRight className="w-6 h-6 text-muted-foreground/30" />
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black text-purple-500">
                                      {tx.recipient?.full_name?.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recipient</p>
                                      <p className="text-foreground font-bold">{tx.recipient?.full_name}</p>
                                      <p className="text-xs text-muted-foreground font-mono">{tx.recipient?.el_space_id}</p>
                                   </div>
                                </div>
                             </div>

                             <div className="flex items-center gap-4">
                                <p className="text-4xl font-black text-foreground tracking-tighter">${tx.amount.toLocaleString()}</p>
                                <Badge className={`px-4 py-1 rounded-full font-black text-xs border-none ${
                                  tx.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                                  tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                  'bg-red-500/10 text-red-500'
                                }`}>
                                  {tx.status.toUpperCase()}
                                </Badge>
                             </div>
                          </div>

                          {tx.status === 'pending' && (
                             <div className="flex flex-col gap-3 justify-center">
                                <Button
                                  className="h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl px-8 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
                                  onClick={() => handleAction('/api/admin/transfers', 'PATCH', { transferId: tx.id, status: 'approved' }, 'Transfer approved')}
                                >
                                  Approve Transfer
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="h-14 text-red-500 hover:text-red-600 font-black rounded-2xl uppercase text-[10px] tracking-widest"
                                  onClick={() => handleAction('/api/admin/transfers', 'PATCH', { transferId: tx.id, status: 'rejected' }, 'Transfer rejected')}
                                >
                                  Reject
                                </Button>
                             </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="text-center py-20 bg-card border-2 border-dashed border-border rounded-[2rem]">
                       <p className="text-muted-foreground font-black uppercase text-[10px] tracking-widest">No pending transfers.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'withdrawals' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">Capital Outflow</h2>
                    <p className="text-muted-foreground mt-3 font-bold uppercase tracking-[0.2em] text-[10px]">Withdrawal Request Authorization Pipeline</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-border bg-card hover:bg-muted font-bold text-xs uppercase tracking-widest">
                      <Clock className="w-4 h-4 mr-2" />
                      Pending History
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {withdrawals.length > 0 ? withdrawals.map((req) => (
                    <Card key={req.id} className="bg-card border-border overflow-hidden rounded-[2.5rem] group hover:border-primary/30 transition-all duration-500 shadow-lg">
                      <div className={`h-1.5 w-full ${
                        req.status === 'pending' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                        req.status === 'approved' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
                      }`} />
                      <CardContent className="p-10">
                        <div className="flex flex-col xl:flex-row justify-between gap-10">
                          <div className="flex-1 space-y-8">
                             <div className="flex items-center gap-6">
                                <div className="p-5 bg-muted rounded-[2rem] shadow-xl group-hover:scale-110 transition-transform duration-500">
                                   <ArrowUpRight className={`w-8 h-8 ${req.status === 'pending' ? 'text-orange-500' : 'text-muted-foreground/30'}`} />
                                </div>
                                <div>
                                   <div className="flex items-center gap-3">
                                      <p className="text-4xl font-black text-foreground tracking-tighter">
                                        {req.currency === 'NGN' ? '₦' : req.currency === 'GBP' ? '£' : req.currency === 'EUR' ? '€' : '$'}
                                        {req.amount.toLocaleString()}
                                      </p>
                                      <Badge className="bg-muted text-muted-foreground border-border font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">{req.currency || 'USD'}</Badge>
                                   </div>
                                   <p className="text-muted-foreground font-bold mt-1 text-sm">Requested by <span className="text-foreground font-black">{req.user?.name || req.user?.email}</span></p>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-muted/30 p-6 rounded-3xl border border-border">
                                   <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">Institution</p>
                                   <p className="text-foreground font-black">{req.metadata?.bankName || 'Standard Chartered'}</p>
                                </div>
                                <div className="bg-muted/30 p-6 rounded-3xl border border-border">
                                   <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">Account Number</p>
                                   <p className="text-foreground font-mono font-bold tracking-widest">{req.metadata?.accountNumber || '**** 9012'}</p>
                                </div>
                                <div className="bg-muted/30 p-6 rounded-3xl border border-border">
                                   <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">Account Holder</p>
                                   <p className="text-foreground font-black truncate">{req.metadata?.accountName || 'Verified User'}</p>
                                </div>
                                <div className="bg-muted/30 p-6 rounded-3xl border border-border">
                                   <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">Request Origin</p>
                                   <p className="text-foreground font-black">{new Date(req.created_at).toLocaleDateString()}</p>
                                </div>
                             </div>
                          </div>

                          <div className="flex flex-col items-end gap-6 justify-center min-w-[280px] p-8 bg-muted/10 rounded-[2rem] border border-border">
                             <div className="text-right">
                                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Verification Status</p>
                                <Badge className={`px-4 py-1 rounded-full font-black text-xs border-none ${
                                  req.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                                  req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                  'bg-red-500/10 text-red-500'
                                }`}>
                                  {req.status.toUpperCase()}
                                </Badge>
                             </div>

                             {req.status === 'pending' && (
                               <div className="flex flex-col gap-3 w-full">
                                  <Button
                                    className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 uppercase text-[10px] tracking-widest"
                                    onClick={() => handleAction('/api/admin/withdrawals', 'PATCH', { withdrawalId: req.id, status: 'approved' }, 'Withdrawal authorized successfully')}
                                  >
                                    <CheckCircle className="w-5 h-5 mr-3" />
                                    Authorize Transfer
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="h-14 text-red-500 hover:text-red-600 hover:bg-red-500/10 font-black rounded-2xl uppercase text-[10px] tracking-widest"
                                    onClick={() => handleAction('/api/admin/withdrawals', 'PATCH', { withdrawalId: req.id, status: 'rejected', rejectionReason: 'Compliance verification failed' }, 'Withdrawal rejected for compliance')}
                                  >
                                    <XCircle className="w-5 h-5 mr-3" />
                                    Reject Request
                                  </Button>
                               </div>
                             )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="text-center py-32 bg-card border-2 border-dashed border-border rounded-[3rem]">
                       <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                          <Clock className="w-10 h-10 text-muted-foreground/30" />
                       </div>
                       <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Queue Empty</h3>
                       <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">No pending withdrawal authorizations detected.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'verifications' && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">Verification Queue</h2>
                    <p className="text-muted-foreground mt-3 font-bold uppercase tracking-[0.2em] text-[10px]">Identity & Business Document Audit Pipeline</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {verifications.length > 0 ? verifications.map((v) => (
                    <Card key={v.id} className="bg-card border-border overflow-hidden rounded-[2.5rem] group hover:border-primary/30 transition-all duration-500 shadow-lg">
                      <CardContent className="p-10">
                         <div className="flex flex-col lg:flex-row gap-10">
                            <div className="flex-1 space-y-6">
                               <div className="flex items-center gap-6">
                                  <div className="w-20 h-20 rounded-3xl bg-muted flex-shrink-0 overflow-hidden border-2 border-border shadow-inner">
                                     {v.avatar_url ? (
                                       <Image src={v.avatar_url} alt="" width={80} height={80} className="object-cover" />
                                     ) : (
                                       <User className="w-10 h-10 text-muted-foreground/30 m-5" />
                                     )}
                                  </div>
                                  <div>
                                     <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">{v.full_name}</h3>
                                     <p className="text-muted-foreground font-bold text-sm">{v.email}</p>
                                     <Badge className="mt-2 bg-primary/10 text-primary border-none font-black uppercase text-[10px] tracking-widest">{v.user_type}</Badge>
                                  </div>
                               </div>

                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                     <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">ID Details</p>
                                     <p className="text-foreground font-black uppercase">{v.id_type?.toUpperCase() || 'N/A'}</p>
                                     <p className="text-muted-foreground font-mono text-sm mt-1">{v.id_serial || 'NO SERIAL'}</p>
                                     {v.id_url && (
                                       <a href={v.id_url} target="_blank" className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-black text-[10px] uppercase tracking-widest">
                                         <Eye className="w-4 h-4" /> View ID Document
                                       </a>
                                     )}
                                  </div>
                                  {v.user_type !== 'freelancer' && (
                                    <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                                       <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">Business Proof</p>
                                       <p className="text-foreground font-black truncate uppercase">{v.business_name || 'N/A'}</p>
                                       <p className="text-muted-foreground font-bold text-xs mt-1 uppercase tracking-widest">{v.business_type || 'N/A'}</p>
                                       {v.business_reg_url && (
                                         <a href={v.business_reg_url} target="_blank" className="inline-flex items-center gap-2 mt-4 text-purple-500 hover:text-purple-600 font-black text-[10px] uppercase tracking-widest">
                                           <Building className="w-4 h-4" /> View Registration
                                         </a>
                                       )}
                                    </div>
                                  )}
                               </div>
                            </div>

                            <div className="w-full lg:w-72 flex flex-col gap-3 justify-center p-8 bg-muted/10 rounded-[2rem] border border-border">
                               <Button
                                 className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 uppercase text-[10px] tracking-widest"
                                 onClick={() => handleAction('/api/admin/verifications', 'POST', { userId: v.id, status: 'verified' }, 'User verified successfully')}
                               >
                                 <CheckCircle className="w-5 h-5 mr-3" />
                                 Approve
                               </Button>
                               <Button
                                 variant="ghost"
                                 className="h-14 text-red-500 hover:text-red-600 hover:bg-red-500/10 font-black rounded-2xl uppercase text-[10px] tracking-widest"
                                 onClick={() => handleAction('/api/admin/verifications', 'POST', { userId: v.id, status: 'rejected' }, 'Verification rejected')}
                               >
                                 <XCircle className="w-5 h-5 mr-3" />
                                 Reject
                               </Button>
                            </div>
                         </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="text-center py-32 bg-card border-2 border-dashed border-border rounded-[3rem]">
                       <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                       <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">No Pending Verifications</h3>
                       <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">All network entities are currently synchronized</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'withdrawals' && activeTab !== 'transfers' && activeTab !== 'deposits' && activeTab !== 'verifications' && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
                <Settings className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-black text-foreground mb-2 uppercase tracking-widest">{activeTab} Module</h3>
                <p className="font-bold uppercase text-[10px] tracking-widest">Advanced interface refinement in progress...</p>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}
