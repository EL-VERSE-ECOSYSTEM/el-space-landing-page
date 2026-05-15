'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Users, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ClientDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      fetchProjects();
    }
  }, [authLoading, user]);

  const fetchProjects = async () => {
    try {
      const userId = user?.id || ''
      if (!userId) return
      const response = await fetch(`/api/projects?clientId=${userId}`);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.total_budget || 0), 0),
    pendingReview: projects.filter(p => p.status === 'pending_review').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Client Dashboard</h1>
          <p className="text-slate-400">Manage your projects and hire freelancers</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/40 backdrop-blur-md border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.activeProjects}</p>
                </div>
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-cyan-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-md border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completed Projects</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.completedProjects}</p>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-md border-blue-500/20 hover:border-blue-500/40 transition-all">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Budget</p>
                  <p className="text-2xl font-bold text-white mt-1">${stats.totalBudget}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-md border-amber-500/20 hover:border-amber-500/40 transition-all">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.pendingReview}</p>
                </div>
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => router.push('/jobs/post')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            Post New Job
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/jobs')}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Browse Freelancers
          </Button>
        </div>

        {/* Projects Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-1">
            <TabsTrigger value="active" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all">Active</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all">Completed</TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all">All Projects</TabsTrigger>
          </TabsList>

          {/* Active Projects */}
          <TabsContent value="active">
            <div className="space-y-4">
              {loading ? (
                <Card className="bg-slate-900/40 backdrop-blur-md border-slate-800">
                  <CardContent className="py-12 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                  </CardContent>
                </Card>
              ) : projects.filter(p => p.status === 'active').length > 0 ? (
                projects.filter(p => p.status === 'active').map((project) => (
                  <Card key={project.id} className="bg-slate-900/40 backdrop-blur-md border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer">
                    <CardHeader onClick={() => router.push(`/jobs/${project.id}`)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{project.title}</CardTitle>
                          <CardDescription className="text-slate-400">Budget: ${project.budget_min} - ${project.budget_max}</CardDescription>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-4 line-clamp-2">{project.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => router.push(`/jobs/${project.id}`)}
                      >
                        View Applications
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">No active projects</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Completed Projects */}
          <TabsContent value="completed">
            <div className="space-y-4">
              {projects.filter(p => p.status === 'completed').length > 0 ? (
                projects.filter(p => p.status === 'completed').map((project) => (
                  <Card key={project.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{project.title}</CardTitle>
                          <CardDescription className="text-slate-400">Completed on {new Date(project.completed_at).toLocaleDateString()}</CardDescription>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-300">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-slate-400">Final Amount: ${project.total_budget}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Leave Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">No completed projects</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* All Projects */}
          <TabsContent value="all">
            <div className="space-y-4">
              {loading ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="py-12 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                  </CardContent>
                </Card>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <Card key={project.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer">
                    <CardHeader onClick={() => router.push(`/jobs/${project.id}`)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{project.title}</CardTitle>
                          <CardDescription className="text-slate-400">{project.category}</CardDescription>
                        </div>
                        <Badge className={project.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-slate-700 text-slate-200'}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">No projects yet. Start by posting a job!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
