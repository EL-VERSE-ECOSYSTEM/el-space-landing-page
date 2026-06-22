'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle, Clock, AlertCircle,
  ChevronRight, ArrowLeft, Calendar,
  DollarSign, FileText, Send
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'
import { DashboardLayout } from '@/components/dashboard/auth-guard'

export default function MilestonesHub() {
  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [milestones, setMilestones] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchMilestones()
    }
  }, [user])

  const fetchMilestones = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/milestones?userId=${user?.id}`)
      const data = await res.json()
      if (data.milestones) {
        setMilestones(data.milestones)
      }
    } catch (err) {
      console.error('Failed to sync milestones')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (milestoneId: string, status: string) => {
    try {
      setProcessing(milestoneId)
      const res = await fetch('/api/milestones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, status }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(`Milestone ${status === 'submitted' ? 'submitted' : 'approved'} successfully`)
        fetchMilestones()
      } else {
        toast.error(data.error || 'Failed to update milestone')
      }
    } catch (err) {
      toast.error('Network error updating milestone')
    } finally {
      setProcessing(null)
    }
  }

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date()
    const target = new Date(dueDate)
    const diff = target.getTime() - now.getTime()

    if (diff <= 0) return { text: 'Overdue', color: 'text-destructive', isOverdue: true }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return { text: `${days}d ${hours}h remaining`, color: 'text-primary', isOverdue: false }
    return { text: `${hours}h remaining`, color: 'text-warning', isOverdue: false }
  }

  if (loading && milestones.length === 0) return <div className="min-h-screen bg-background flex items-center justify-center"><ELLoader /></div>

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="min-h-screen text-foreground pb-20">
        <main className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black text-foreground tracking-tighter">
                Mission <span className="bg-gradient-to-r from-primary to-slate500 bg-clip-text text-transparent">Milestones</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg font-medium">Precision tracking for active deployments</p>
            </div>
            <Badge className="bg-muted text-muted-foreground border-border px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase">
              {milestones.length} ACTIVE TARGETS
            </Badge>
          </div>

          {/* Overdue Warning */}
          {milestones.some(m => m.status === 'in_progress' && new Date(m.due_date) < new Date()) && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-[2rem] p-6 flex items-center gap-6 animate-pulse">
               <div className="w-12 h-12 rounded-2xl bg-destructive flex items-center justify-center shadow-lg shadow-destructive/20">
                  <AlertCircle className="w-6 h-6 text-destructive-foreground" />
               </div>
               <div>
                  <h3 className="text-foreground font-black text-lg tracking-tight">Late Penalty Warning</h3>
                  <p className="text-destructive/80 font-medium">Deliveries past due date incur an automatic <span className="text-foreground font-black">$25 reduction</span> in settlement.</p>
               </div>
            </div>
          )}

          {/* Milestones List */}
          <div className="space-y-6">
             {milestones.length > 0 ? milestones.map((milestone) => {
               const time = getTimeRemaining(milestone.due_date)
               return (
                 <Card key={milestone.id} className="bg-card border border-border rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all group shadow-lg">
                    <CardContent className="p-8">
                       <div className="flex flex-col md:flex-row justify-between gap-8">
                          <div className="flex-1 space-y-4">
                             <div className="flex items-center gap-3">
                                <Badge className={`border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg ${
                                  milestone.status === 'completed' ? 'bg-success/10 text-success' :
                                  milestone.status === 'in_progress' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                }`}>
                                   {milestone.status.replace('_', ' ')}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                                   <Calendar className="w-3 h-3" /> Due {new Date(milestone.due_date).toLocaleDateString()}
                                </div>
                             </div>

                             <h3 className="text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                                {milestone.title}
                             </h3>
                             <p className="text-muted-foreground font-medium line-clamp-2">
                                {milestone.description || 'No description provided for this mission milestone.'}
                             </p>

                             <div className="flex flex-wrap gap-6 pt-2">
                                <div className="flex items-center gap-2">
                                   <Clock className={`w-4 h-4 ${time.color}`} />
                                   <span className={`text-xs font-black uppercase tracking-widest ${time.color}`}>{time.text}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                   <DollarSign className="w-4 h-4 text-success" />
                                   <span className="text-xs font-black uppercase tracking-widest text-foreground">${milestone.amount}</span>
                                </div>
                             </div>
                          </div>

                          <div className="flex flex-col justify-between items-end gap-6 min-w-[200px]">
                             <div className="text-right hidden md:block">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Target Project</p>
                                <p className="text-foreground font-black tracking-tight">{milestone.project?.title || 'Nexus Deployment'}</p>
                             </div>

                             <div className="flex gap-3 w-full md:w-auto">
                                <Button variant="outline" className="flex-1 border-border text-foreground font-black rounded-xl px-6 h-12 hover:bg-muted">
                                   Details
                                </Button>
                                {user?.user_type === 'freelancer' && milestone.status === 'in_progress' && (
                                  <Button
                                    disabled={!!processing}
                                    onClick={() => handleUpdateStatus(milestone.id, 'submitted')}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl px-8 h-12 shadow-lg shadow-primary/20"
                                  >
                                     {processing === milestone.id ? '...' : 'Submit'} <Send className="w-4 h-4 ml-2" />
                                  </Button>
                                )}
                                {user?.user_type === 'client' && milestone.status === 'submitted' && (
                                  <Button
                                    disabled={!!processing}
                                    onClick={() => handleUpdateStatus(milestone.id, 'approved')}
                                    className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-black rounded-xl px-8 h-12 shadow-lg shadow-success/20"
                                  >
                                     {processing === milestone.id ? '...' : 'Approve'} <CheckCircle className="w-4 h-4 ml-2" />
                                  </Button>
                                )}
                             </div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
               )
             }) : (
               <div className="text-center py-24 bg-card border-2 border-dashed border-border rounded-[3rem]">
                  <CheckCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Signal Neutral</h3>
                  <p className="text-muted-foreground mt-2 font-medium">All mission objectives are currently synchronized.</p>
                  <Button onClick={() => router.push('/jobs')} className="mt-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl h-14 px-10 shadow-xl shadow-primary/20">Hunt New Missions</Button>
               </div>
             )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
