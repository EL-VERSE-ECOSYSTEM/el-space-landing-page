'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertTriangle, Scale, MessageCircle,
  FileText, CheckCircle, Send, Plus,
  Shield, Clock, ChevronRight, Upload
} from 'lucide-react'
import { useLoader } from '@/components/loader-provider'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Dispute {
  id: string
  project_id: string
  title: string
  description: string
  status: 'open' | 'in_review' | 'resolved' | 'closed' | 'escalated'
  created_at: string
  plaintiff_id: string
  defendant_id: string
  project?: {
    title: string
  }
}

interface Evidence {
  id: string
  user_id: string
  evidence: string
  attachment_url?: string
  created_at: string
}

export default function DisputesPage() {
  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const { user, loading: authLoading } = useAuth()
  const { show: showLoader, hide: hideLoader } = useLoader()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([])
  const [evidenceText, setEvidenceText] = useState('')
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      fetchDisputes()
    }
  }, [authLoading, user])

  const fetchDisputes = async () => {
    try {
      setLoading(true)
      const userId = user?.id || ''
      if (!userId) return

      const response = await fetch(`/api/disputes?userId=${userId}`)
      const resData = await response.json()

      if (resData.data) {
        setDisputes(resData.data)
      } else {
        setDisputes([])
      }
    } catch (error) {
      console.error('Error fetching disputes:', error)
      toast.error('Failed to load disputes')
    } finally {
      setLoading(false)
    }
  }

  const fetchEvidence = async (disputeId: string) => {
    try {
      const response = await fetch(`/api/disputes?action=evidence&id=${disputeId}`)
      const resData = await response.json()
      if (resData.data) {
        setEvidenceList(resData.data)
      }
    } catch (error) {
      console.error('Error fetching evidence:', error)
    }
  }

  const handleAddEvidence = async () => {
    if (!evidenceText.trim() || !selectedDispute || !user) return

    try {
      setIsSubmittingEvidence(true)
      const response = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addEvidence',
          disputeId: selectedDispute.id,
          userId: user.id,
          evidence: evidenceText,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Evidence submitted')
        setEvidenceText('')
        fetchEvidence(selectedDispute.id)
      } else {
        toast.error(data.error || 'Failed to submit evidence')
      }
    } catch (error) {
      toast.error('Failed to submit evidence')
    } finally {
      setIsSubmittingEvidence(false)
    }
  }

  const handleEscalate = async (disputeId: string) => {
    try {
      showLoader(2)
      const response = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'escalate',
          disputeId,
          reason: 'Parties unable to reach agreement through direct mediation.'
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Dispute escalated to Admin panel')
        fetchDisputes()
        if (selectedDispute) setSelectedDispute({...selectedDispute, status: 'escalated'})
      } else {
        toast.error(data.error || 'Failed to escalate')
      }
      hideLoader()
    } catch (error) {
      toast.error('Failed to escalate')
      hideLoader()
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return { color: 'bg-amber-500/10 text-amber-500', label: 'OPEN' }
      case 'in_review':
        return { color: 'bg-blue-500/10 text-blue-400', label: 'IN REVIEW' }
      case 'resolved':
        return { color: 'bg-emerald-500/10 text-emerald-500', label: 'RESOLVED' }
      case 'escalated':
        return { color: 'bg-red-500/10 text-red-500', label: 'ESCALATED' }
      case 'closed':
        return { color: 'bg-slate-800 text-slate-500', label: 'CLOSED' }
      default:
        return { color: 'bg-slate-800 text-slate-500', label: status.toUpperCase() }
    }
  }

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="min-h-screen text-slate-200 pb-20">
        <main className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center shadow-2xl shadow-red-500/20">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                Justice <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">Center</span>
              </h1>
              <p className="text-slate-400 mt-2 text-lg font-medium">Impartial resolution for professional conflicts</p>
            </div>
            <Button className="bg-white text-slate-950 hover:bg-slate-200 font-black px-8 h-12 rounded-xl">
               <Plus className="w-4 h-4 mr-2" /> File Dispute
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active', count: disputes.filter(d => d.status === 'open' || d.status === 'in_review').length, color: 'text-amber-400', bg: 'bg-amber-400/5' },
              { label: 'Escalated', count: disputes.filter(d => d.status === 'escalated').length, color: 'text-red-400', bg: 'bg-red-400/5' },
              { label: 'Resolved', count: disputes.filter(d => d.status === 'resolved').length, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
              { label: 'Total', count: disputes.length, color: 'text-white', bg: 'bg-slate-900' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} border border-slate-800 rounded-[2rem] p-8`}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label} Cases</p>
                <h3 className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.count}</h3>
              </div>
            ))}
          </div>

          {/* Disputes List */}
          <div className="space-y-6">
            {disputes.length > 0 ? disputes.map((dispute) => {
              const config = getStatusConfig(dispute.status)
              return (
                <Card
                  key={dispute.id}
                  className="bg-slate-900 border-slate-800 rounded-[2.5rem] hover:border-slate-700 transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedDispute(dispute)
                    fetchEvidence(dispute.id)
                  }}
                >
                  <CardContent className="p-8 flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                         <Badge className={`${config.color} border-none font-black text-[10px] tracking-widest px-3 py-1 rounded-lg`}>
                            {config.label}
                         </Badge>
                         <span className="text-slate-600 text-[10px] font-black tracking-widest uppercase">CASE ID: {dispute.id.slice(0, 8)}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-red-400 transition-colors">{dispute.title}</h3>
                      <p className="text-slate-400 font-medium line-clamp-2">{dispute.description}</p>

                      <div className="flex items-center gap-6 pt-2">
                         <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Filed {new Date(dispute.created_at).toLocaleDateString()}</span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-500">
                            <Shield className="w-4 h-4 text-cyan-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Platform Mediated</span>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <Button className="bg-slate-800 hover:bg-slate-700 text-white font-black px-8 h-12 rounded-xl">
                          Review Case <ChevronRight className="w-4 h-4 ml-2" />
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            }) : (
              <div className="text-center py-24 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
                 <CheckCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                 <h3 className="text-xl font-black text-white">All Clear</h3>
                 <p className="text-slate-500 mt-2">No active disputes detected in your workspace.</p>
              </div>
            )}
          </div>
        </main>

        {/* Dispute Details Modal */}
        {selectedDispute && (
          <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
            <DialogContent className="max-w-4xl bg-slate-950 border-slate-800 text-white rounded-[3rem] p-0 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-10 border-b border-slate-900">
                 <div className="flex justify-between items-start">
                    <div>
                       <Badge className={`${getStatusConfig(selectedDispute.status).color} mb-4 font-black tracking-widest rounded-lg border-none`}>
                          {getStatusConfig(selectedDispute.status).label}
                       </Badge>
                       <DialogTitle className="text-4xl font-black tracking-tighter">{selectedDispute.title}</DialogTitle>
                       <p className="text-slate-500 mt-2 font-medium">Case details and evidence repository</p>
                    </div>
                    <div className="flex gap-2">
                       {selectedDispute.status !== 'escalated' && selectedDispute.status !== 'resolved' && (
                          <Button
                             onClick={() => handleEscalate(selectedDispute.id)}
                             variant="outline"
                             className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-black rounded-xl"
                          >
                             Escalate to Admin
                          </Button>
                       )}
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                 {/* Core Intel */}
                 <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-cyan-500" /> Case Statement
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-lg">{selectedDispute.description}</p>
                 </div>

                 {/* Evidence Thread */}
                 <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
                       <MessageCircle className="w-4 h-4 text-purple-500" /> Evidence Protocol
                    </h4>

                    <div className="space-y-4">
                       {evidenceList.map((ev) => (
                         <div key={ev.id} className={`flex gap-4 ${ev.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="w-10 h-10 border border-slate-800">
                               <AvatarFallback className="bg-slate-900 text-cyan-400 font-black text-xs">{(ev.user_id === user?.id ? 'YOU' : 'OP').slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className={`max-w-[70%] p-6 rounded-[2rem] ${
                               ev.user_id === user?.id ? 'bg-cyan-500 text-white' : 'bg-slate-900 text-slate-300'
                            }`}>
                               <p className="font-medium">{ev.evidence}</p>
                               {ev.attachment_url && (
                                  <a href={ev.attachment_url} target="_blank" className="mt-4 block p-3 bg-black/20 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-black/30 transition-all">
                                     <Upload className="w-3 h-3" /> View Attachment
                                  </a>
                               )}
                               <p className={`text-[9px] font-black uppercase tracking-widest mt-4 ${ev.user_id === user?.id ? 'text-white/50' : 'text-slate-600'}`}>
                                  {new Date(ev.created_at).toLocaleString()}
                               </p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Input Area */}
              {selectedDispute.status !== 'resolved' && selectedDispute.status !== 'closed' && (
                <div className="p-8 bg-slate-900/50 border-t border-slate-900">
                   <div className="flex gap-4">
                      <div className="flex-1 relative">
                         <Textarea
                            placeholder="Submit further evidence or clarification..."
                            className="bg-slate-900 border-slate-800 text-white placeholder-slate-600 rounded-[1.5rem] min-h-[60px] p-4 focus:ring-red-500"
                            value={evidenceText}
                            onChange={(e) => setEvidenceText(e.target.value)}
                         />
                         <div className="absolute right-4 bottom-4 flex gap-2">
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-xl">
                               <ImageIcon className="w-5 h-5" />
                            </Button>
                         </div>
                      </div>
                      <Button
                         onClick={handleAddEvidence}
                         disabled={!evidenceText.trim() || isSubmittingEvidence}
                         className="bg-red-500 hover:bg-red-600 text-white font-black px-8 rounded-2xl h-auto"
                      >
                         {isSubmittingEvidence ? '...' : <Send className="w-5 h-5" />}
                      </Button>
                   </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  )
}
