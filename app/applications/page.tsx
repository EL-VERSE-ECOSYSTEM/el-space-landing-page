'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  DollarSign, 
  Globe, 
  Trash2, 
  MessageCircle,
  Users,
  TrendingUp,
  Award,
  FileText
} from 'lucide-react'
import { 
  FreelancerComparison, 
  SmartRecommendations, 
  QuickHire, 
  SkillEndorsement, 
  ProjectTimeline, 
  MilestonePaymentTracker, 
  WorkSampleGallery 
} from '@/components/freelancer'

interface Freelancer {
  id: string;
  full_name: string;
  hourly_rate: number;
  years_experience: number;
  avg_rating: number;
  total_projects: number;
  skills: string[];
  bio: string;
  cv_url?: string;
  profile_picture?: string;
  availability?: 'available' | 'busy' | 'unavailable';
  response_time?: string;
  completion_rate?: number;
}

interface Application {
  id: string
  jobTitle: string
  company: string
  budget: number
  status: 'pending' | 'rejected' | 'accepted' | 'completed'
  appliedDate: string
  deadline: string
  skills: string[]
  freelancer?: Freelancer;
  proposedRate?: number;
  estimatedDays?: number;
  coverLetter?: string;
}

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth()
  const [userType] = useState<'freelancer' | 'client'>('client')
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'comparison' | 'recommendations'>('list')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      fetchApplications()
    }
  }, [authLoading, user])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const userId = user?.id || ''
      const response = await fetch(`/api/applications?userId=${userId}`)
      const data = await response.json()
      
      if (data.success && data.applications) {
        setApplications(data.applications)
        if (data.applications.length > 0) {
          setSelectedApplicationId(data.applications[0].id)
        }
      } else {
        setApplications([])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const selectedApp = applications.find(app => app.id === selectedApplicationId)
  const freelancer = selectedApp?.freelancer

  const statusConfig = {
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', label: 'Pending' },
    accepted: { color: 'bg-green-500/20 text-green-400 border-green-500/50', label: 'Accepted' },
    rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/50', label: 'Rejected' },
    completed: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', label: 'Completed' },
  }

  const navItems = [
    { label: 'Post Job', href: '/jobs/post' },
    { label: 'Applications', href: '/applications' },
    { label: 'Messages', href: '/messages' },
  ]

  return (
    <DashboardLayout userType={userType} navItems={navItems}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
          <p className="text-slate-400">Review and manage applicants for your projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-white">
              {applications.length}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-400">
              {applications.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Accepted</p>
            <p className="text-3xl font-bold text-green-400">
              {applications.filter(a => a.status === 'accepted').length}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-blue-400">
              {applications.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <Tabs defaultValue="list" onValueChange={(value) => setViewMode(value as any)} className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Applications List
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Compare Freelancers
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Smart Recommendations
            </TabsTrigger>
          </TabsList>

          {/* Applications List View */}
          <TabsContent value="list" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Applications List */}
              <div className="lg:col-span-1 space-y-2">
                {applications.map((app) => (
                  <Card
                    key={app.id}
                    className={`cursor-pointer transition-all ${
                      selectedApplicationId === app.id
                        ? 'bg-cyan-900/30 border-cyan-500'
                        : 'bg-slate-800 border-slate-700 hover:border-cyan-500'
                    }`}
                    onClick={() => setSelectedApplicationId(app.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {app.freelancer?.full_name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate text-sm">
                            {app.freelancer?.full_name || 'Anonymous'}
                          </p>
                          <p className="text-slate-400 text-xs truncate">{app.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${statusConfig[app.status as keyof typeof statusConfig].color}`}>
                          {statusConfig[app.status as keyof typeof statusConfig].label}
                        </Badge>
                        {app.freelancer?.avg_rating && (
                          <Badge variant="secondary" className="text-xs bg-yellow-600/20 text-yellow-300">
                            ⭐ {app.freelancer.avg_rating}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Details Panel */}
              <div className="lg:col-span-2 space-y-4">
                {selectedApp && freelancer ? (
                  <>
                    {/* Freelancer Header */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                            {freelancer.full_name?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-1">{freelancer.full_name}</h2>
                            <p className="text-slate-400 mb-2">{selectedApp.jobTitle}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">${freelancer.hourly_rate}/hr</Badge>
                              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300">⭐ {freelancer.avg_rating}/5</Badge>
                              <Badge variant="secondary" className="bg-green-600/20 text-green-300">{freelancer.total_projects} projects</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          {selectedApp.status === 'pending' && freelancer && (
                            <>
                              <QuickHire
                                freelancerId={freelancer.id}
                                freelancerName={freelancer.full_name}
                                projectBudget={selectedApp.budget}
                                proposedRate={selectedApp.proposedRate || 0}
                                estimatedDays={selectedApp.estimatedDays || 0}
                              />
                              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Application Details Tabs */}
                    <Tabs defaultValue="overview" className="space-y-4">
                      <TabsList className="bg-slate-700 border-slate-600">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="cv" className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          CV
                        </TabsTrigger>
                        <TabsTrigger value="samples">Work Samples</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        {/* Cover Letter */}
                        <Card className="bg-slate-800 border-slate-700">
                          <CardHeader>
                            <CardTitle className="text-white">Cover Letter</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-300 text-sm">{selectedApp.coverLetter}</p>
                          </CardContent>
                        </Card>

                        {/* Skills & Experience */}
                        <Card className="bg-slate-800 border-slate-700">
                          <CardHeader>
                            <CardTitle className="text-white">Experience & Skills</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-slate-400 text-sm mb-1">Experience</p>
                                <p className="text-2xl font-bold text-white">{freelancer.years_experience} years</p>
                              </div>
                              <div>
                                <p className="text-slate-400 text-sm mb-1">Projects Completed</p>
                                <p className="text-2xl font-bold text-white">{freelancer.total_projects}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm mb-2">Skills Match</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedApp.skills.map(skill => (
                                  <Badge
                                    key={skill}
                                    className={freelancer.skills.includes(skill) ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}
                                  >
                                    {freelancer.skills.includes(skill) ? '✓ ' : '○ '}{skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Skill Endorsements */}
                        <SkillEndorsement
                          freelancerId={freelancer.id}
                          skills={freelancer.skills.slice(0, 5)}
                          endorsements={{ 'React': 24, 'Node.js': 18, 'PostgreSQL': 15 }}
                        />
                      </TabsContent>

                      <TabsContent value="cv">
                        {freelancer.cv_url ? (
                          <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="pt-6">
                              <div className="border border-slate-600 rounded-lg overflow-hidden h-96 bg-slate-700">
                                <iframe
                                  src={`${freelancer.cv_url}#toolbar=0`}
                                  className="w-full h-full"
                                  title="Freelancer CV"
                                />
                              </div>
                              <Button 
                                onClick={() => window.open(freelancer.cv_url, '_blank')}
                                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                              >
                                Download CV
                              </Button>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="pt-6 text-center pb-6">
                              <p className="text-slate-400">No CV provided</p>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      <TabsContent value="samples">
                        <WorkSampleGallery
                          samples={[]}
                          freelancerName={freelancer.full_name}
                        />
                      </TabsContent>

                      <TabsContent value="timeline">
                        <div className="space-y-4">
                          <ProjectTimeline
                            milestones={[]}
                            projectDeadline={new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)}
                            estimatedDays={selectedApp.estimatedDays}
                          />
                          <MilestonePaymentTracker
                            milestones={[]}
                            totalBudget={selectedApp.budget}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="pt-12 text-center pb-12">
                      <p className="text-slate-400">Select an application to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Comparison View */}
          <TabsContent value="comparison">
            <FreelancerComparison 
              freelancers={applications.slice(0, 3).map(a => a.freelancer!).filter(Boolean)}
              onSelectFreelancer={(freelancerId) => {
                const app = applications.find(a => a.freelancer?.id === freelancerId);
                if (app) setSelectedApplicationId(app.id);
              }}
            />
          </TabsContent>

          {/* Recommendations View */}
          <TabsContent value="recommendations">
            <SmartRecommendations 
              projectSkills={['React', 'Node.js', 'PostgreSQL']}
              recommendations={[]}
              onSelectFreelancer={(freelancerId) => {
                const app = applications.find(a => a.freelancer?.id === freelancerId);
                if (app) setSelectedApplicationId(app.id);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
