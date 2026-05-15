'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, Scale, MessageCircle, FileText, CheckCircle } from 'lucide-react'
import { useLoader } from '@/components/loader-provider'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface Dispute {
  id: string
  projectId: string
  projectName: string
  clientName: string
  freelancerName: string
  reason: string
  amount: number
  status: 'open' | 'in_review' | 'resolved' | 'closed'
  createdAt: string
  messages: Array<{
    id: string
    sender: string
    message: string
    timestamp: string
  }>
}

export default function DisputesPage() {
  const { user, loading: authLoading } = useAuth()
  const { show: showLoader, hide: hideLoader } = useLoader()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [messageText, setMessageText] = useState('')
  const [reasonText, setReasonText] = useState('')
  const [openNewDispute, setOpenNewDispute] = useState(false)
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => {
    if (!authLoading) {
      fetchDisputes()
    }
  }, [authLoading, user])

  const fetchDisputes = async () => {
    try {
      setLoading(true)
      showLoader(2)
      const userId = user?.id || ''
      if (!userId) return

      const response = await fetch(`/api/disputes?userId=${userId}`)
      const data = await response.json()

      if (data.success && data.disputes) {
        setDisputes(data.disputes)
      } else {
        setDisputes([])
      }
      hideLoader()
    } catch (error) {
      console.error('Error fetching disputes:', error)
      toast.error('Failed to load disputes')
      hideLoader()
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText || !selectedDispute) return

    try {
      showLoader(2)
      const response = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-message',
          disputeId: selectedDispute.id,
          message: messageText,
          sender: user?.name || 'User',
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Message sent')
        setMessageText('')
        fetchDisputes()
      } else {
        toast.error(data.error || 'Failed to send message')
      }
      hideLoader()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
      hideLoader()
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
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Dispute escalated to admin')
        fetchDisputes()
      } else {
        toast.error(data.error || 'Failed to escalate')
      }
      hideLoader()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to escalate')
      hideLoader()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      case 'in_review':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'closed':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50'
      default:
        return 'bg-slate-500/20 text-slate-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Scale className="w-12 h-12 mx-auto mb-4 animate-bounce" />
          <p>Loading disputes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <Scale className="w-10 h-10 text-red-400" />
            Dispute Management
          </h1>
          <p className="text-red-200">Handle and resolve project disputes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Open', count: disputes.filter(d => d.status === 'open').length, color: 'yellow' },
            { label: 'In Review', count: disputes.filter(d => d.status === 'in_review').length, color: 'blue' },
            { label: 'Resolved', count: disputes.filter(d => d.status === 'resolved').length, color: 'green' },
            { label: 'Closed', count: disputes.filter(d => d.status === 'closed').length, color: 'slate' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="pt-6">
                <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.count}</div>
                <p className="text-sm text-slate-300">{stat.label} Disputes</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disputes List */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Your Disputes</CardTitle>
            <CardDescription className="text-slate-300">
              View and manage all your active and resolved disputes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {disputes.length > 0 ? (
              <div className="space-y-4">
                {disputes.map((dispute) => (
                  <div
                    key={dispute.id}
                    className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition cursor-pointer"
                    onClick={() => setSelectedDispute(dispute)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{dispute.projectName}</h3>
                        <p className="text-sm text-slate-300">
                          {dispute.status === 'open' || dispute.status === 'in_review'
                            ? `Between you and ${dispute.clientName}`
                            : `Dispute with ${dispute.clientName}`}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(dispute.status)}`}>
                        {dispute.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-white mb-3">{dispute.reason}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Amount in Dispute</p>
                          <p className="text-lg font-bold text-red-400">${dispute.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Created</p>
                          <p className="text-sm text-slate-300">
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-slate-600 hover:bg-slate-500 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Scale className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No disputes at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dispute Details Modal */}
        {selectedDispute && (
          <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
            <DialogContent className="max-w-2xl bg-slate-800 border-slate-700/50 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  {selectedDispute.projectName} - Dispute Details
                </DialogTitle>
                <DialogDescription className="text-slate-300">
                  Manage and resolve this dispute
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Dispute Info */}
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Status</p>
                      <Badge className={`${getStatusColor(selectedDispute.status)} mt-1`}>
                        {selectedDispute.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="text-lg font-bold text-red-400 mt-1">${selectedDispute.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Client</p>
                      <p className="text-white mt-1">{selectedDispute.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Created</p>
                      <p className="text-white mt-1">
                        {new Date(selectedDispute.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <Label className="text-white">Dispute Reason</Label>
                  <div className="mt-2 p-3 bg-slate-700/50 rounded border border-slate-600/50 text-slate-200">
                    {selectedDispute.reason}
                  </div>
                </div>

                {/* Messages */}
                <div>
                  <Label className="text-white mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Discussion Thread
                  </Label>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {selectedDispute.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded border ${
                          msg.sender === 'You'
                            ? 'bg-blue-500/20 border-blue-500/50 ml-4'
                            : 'bg-slate-700/50 border-slate-600/50 mr-4'
                        }`}
                      >
                        <p className="text-xs text-slate-400">{msg.sender}</p>
                        <p className="text-white mt-1">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {selectedDispute.status === 'open' || selectedDispute.status === 'in_review' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Add your response..."
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Send Message
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-500/20 border border-green-500/50 rounded text-green-300">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      This dispute is in final status
                    </div>
                  )}
                </div>

                {/* Actions */}
                {(selectedDispute.status === 'open' || selectedDispute.status === 'in_review') && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleEscalate(selectedDispute.id)}
                      variant="outline"
                      className="flex-1 border-red-500/50 text-red-300 hover:bg-red-500/10"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Escalate to Admin
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
