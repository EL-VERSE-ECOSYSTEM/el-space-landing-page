'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Label } from '@/components/ui/label'
import { CheckCircle2, Clock, AlertCircle, Target, Calendar, DollarSign, CheckCheck, MessageCircle } from 'lucide-react'
import { useLoader } from '@/components/loader-provider'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface Milestone {
  id: string
  projectName: string
  projectId: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'released'
  amount: number
  dueDate: string
  submissionDate?: string
  approvalDate?: string
  client: string
  freelancer: string
  deliverables: string[]
  attachments?: Array<{ name: string; url: string }>
  messages: Array<{
    sender: string
    text: string
    timestamp: string
  }>
}

export default function MilestonesPage() {
  const { user, loading: authLoading } = useAuth()
  const { show: showLoader, hide: hideLoader } = useLoader()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [messageText, setMessageText] = useState('')
  const [submissionText, setSubmissionText] = useState('')
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!authLoading) {
      fetchMilestones()
    }
  }, [authLoading, user])

  const fetchMilestones = async () => {
    try {
      setLoading(true)
      showLoader(2)
      const userId = user?.id || ''
      if (!userId) {
        toast.error('Please log in to view milestones')
        return
      }

      const response = await fetch(`/api/milestones?userId=${userId}`)
      const data = await response.json()

      if (data.success && data.milestones) {
        setMilestones(data.milestones)
      } else {
        // No mock data - show empty list
        setMilestones([])
      }
      hideLoader()
    } catch (error) {
      console.error('Error fetching milestones:', error)
      toast.error('Failed to load milestones')
      setMilestones([])
      hideLoader()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitMilestone = async () => {
    if (!submissionText || !selectedMilestone) {
      toast.error('Please add submission notes')
      return
    }

    try {
      showLoader(2)
      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          milestoneId: selectedMilestone.id,
          submissionNotes: submissionText,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Milestone submitted for review')
        setSubmissionText('')
        setShowSubmitDialog(false)
        fetchMilestones()
      } else {
        toast.error(data.error || 'Failed to submit')
      }
      hideLoader()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to submit')
      hideLoader()
    }
  }

  const handleSendMessage = async () => {
    if (!messageText || !selectedMilestone) return

    try {
      showLoader(2)
      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-message',
          milestoneId: selectedMilestone.id,
          message: messageText,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Message sent')
        setMessageText('')
        fetchMilestones()
      } else {
        toast.error(data.error || 'Failed to send')
      }
      hideLoader()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to send message')
      hideLoader()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'in_progress':
        return <Target className="w-5 h-5 text-blue-400" />
      case 'submitted':
        return <AlertCircle className="w-5 h-5 text-orange-400" />
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'released':
        return <CheckCheck className="w-5 h-5 text-green-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'submitted':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'released':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      default:
        return 'bg-slate-500/20 text-slate-300'
    }
  }

  const getCompletionPercentage = (status: string) => {
    const percentages: Record<string, number> = {
      pending: 0,
      in_progress: 50,
      submitted: 75,
      approved: 90,
      released: 100,
    }
    return percentages[status] || 0
  }

  const filteredMilestones = activeTab === 'all'
    ? milestones
    : milestones.filter(m => m.status === activeTab)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Target className="w-12 h-12 mx-auto mb-4 animate-bounce" />
          <p>Loading milestones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <Target className="w-10 h-10 text-cyan-400" />
            Project Milestones
          </h1>
          <p className="text-cyan-200">Track and manage your project milestones</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Pending', count: milestones.filter(m => m.status === 'pending').length, icon: Clock, color: 'yellow' },
            { label: 'In Progress', count: milestones.filter(m => m.status === 'in_progress').length, icon: Target, color: 'blue' },
            { label: 'Submitted', count: milestones.filter(m => m.status === 'submitted').length, icon: AlertCircle, color: 'orange' },
            { label: 'Approved', count: milestones.filter(m => m.status === 'approved').length, icon: CheckCircle2, color: 'green' },
            { label: 'Released', count: milestones.filter(m => m.status === 'released').length, icon: CheckCheck, color: 'green' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="bg-slate-800/50 border-cyan-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                    <div>
                      <p className="text-xs text-cyan-200">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <Card className="bg-slate-800/50 border-cyan-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-slate-700/50 border border-cyan-500/20">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="released">Released</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4 mt-6">
                {filteredMilestones.length > 0 ? (
                  filteredMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-4 bg-slate-700/50 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition"
                    >
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(milestone.status)}
                              <h3 className="text-lg font-semibold text-white">{milestone.title}</h3>
                              <Badge className={`${getStatusColor(milestone.status)}`}>
                                {milestone.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-300 mb-2">{milestone.description}</p>
                            <p className="text-xs text-slate-400">
                              Project: {milestone.projectName} • Client: {milestone.client}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-cyan-400">
                              ${milestone.amount}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Milestone Value</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">Progress</span>
                            <span className="text-xs text-slate-400">
                              {getCompletionPercentage(milestone.status)}%
                            </span>
                          </div>
                          <Progress
                            value={getCompletionPercentage(milestone.status)}
                            className="h-2 bg-slate-600"
                          />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                          <div className="p-2 bg-slate-600/50 rounded">
                            <p className="text-slate-400">Due Date</p>
                            <p className="text-white">
                              {new Date(milestone.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          {milestone.submissionDate && (
                            <div className="p-2 bg-slate-600/50 rounded">
                              <p className="text-slate-400">Submitted</p>
                              <p className="text-white">
                                {new Date(milestone.submissionDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {milestone.approvalDate && (
                            <div className="p-2 bg-slate-600/50 rounded">
                              <p className="text-slate-400">Approved</p>
                              <p className="text-white">
                                {new Date(milestone.approvalDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Deliverables */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-300 mb-2">Deliverables:</p>
                          <ul className="space-y-1">
                            {milestone.deliverables.map((del, idx) => (
                              <li key={idx} className="text-xs text-slate-400 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                {del}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedMilestone(milestone)}
                            size="sm"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            View Details
                          </Button>

                          {milestone.status === 'in_progress' && (
                            <dialog className="invisible">
                              <div className="p-4">
                                <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                                    >
                                      <AlertCircle className="w-4 h-4" />
                                      Submit for Review
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-slate-800 border-cyan-500/20">
                                    <DialogHeader>
                                      <DialogTitle className="text-white">Submit Milestone</DialogTitle>
                                      <DialogDescription className="text-cyan-200">
                                        Submit your completed work
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <Textarea
                                        value={submissionText}
                                        onChange={(e) => setSubmissionText(e.target.value)}
                                        placeholder="Describe what you've completed..."
                                        className="bg-slate-700 border-cyan-500/20 text-white"
                                      />
                                      <Button
                                        onClick={handleSubmitMilestone}
                                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                                      >
                                        Submit Milestone
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No milestones in this status</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Milestone Details Modal */}
        {selectedMilestone && (
          <Dialog open={!!selectedMilestone} onOpenChange={() => setSelectedMilestone(null)}>
            <DialogContent className="max-w-2xl bg-slate-800 border-cyan-500/20 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  {getStatusIcon(selectedMilestone.status)}
                  {selectedMilestone.title}
                </DialogTitle>
                <DialogDescription className="text-cyan-200">
                  {selectedMilestone.projectName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status & Amount */}
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-cyan-500/10">
                  <div>
                    <Badge className={`${getStatusColor(selectedMilestone.status)} mb-2`}>
                      {selectedMilestone.status}
                    </Badge>
                    <p className="text-white font-semibold">{selectedMilestone.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-cyan-400">
                      ${selectedMilestone.amount}
                    </p>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <Label className="text-white mb-3 block">Deliverables</Label>
                  <ul className="space-y-2">
                    {selectedMilestone.deliverables.map((del, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 bg-slate-700/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Messages */}
                <div>
                  <Label className="text-white mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Discussion
                  </Label>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {selectedMilestone.messages.map((msg, idx) => (
                      <div key={idx} className="p-3 bg-slate-700/50 rounded border border-cyan-500/10">
                        <p className="text-xs text-slate-400">{msg.sender}</p>
                        <p className="text-white mt-1">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Add a message..."
                      className="bg-slate-700 border-cyan-500/20 text-white"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
