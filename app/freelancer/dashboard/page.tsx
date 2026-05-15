'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Briefcase, DollarSign, CheckCircle, Clock, MessageSquare, Star } from 'lucide-react';

export default function FreelancerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    try {
      const freelancerId = user?.id || '';
      if (!freelancerId) {
        setLoading(false);
        return;
      }

      // Fetch applications
      const appResponse = await fetch(`/api/applications?freelancerId=${freelancerId}`);
      const appData = await appResponse.json();
      setApplications(appData.applications || []);

      // Fetch earnings
      const earningsResponse = await fetch(`/api/earnings?freelancerId=${freelancerId}`);
      const earningsData = await earningsResponse.json();
      setEarnings(earningsData.stats);

      // Fetch active projects
      const projectsResponse = await fetch(`/api/projects?freelancerId=${freelancerId}&status=in_progress`);
      const projectsData = await projectsResponse.json();
      setActiveProjects(projectsData.projects || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setApplications([]);
      setActiveProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Freelancer Dashboard</h1>
          <p className="text-slate-400">Manage your projects and track progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/40 backdrop-blur-md border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-white mt-1">{activeProjects.length}</p>
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
                  <p className="text-slate-400 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-white mt-1">${earnings?.totalEarnings || 0}</p>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-md border-amber-500/20 hover:border-amber-500/40 transition-all">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Earnings</p>
                  <p className="text-2xl font-bold text-white mt-1">${earnings?.pendingEarnings || 0}</p>
                </div>
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 backdrop-blur-md border-blue-500/20 hover:border-blue-500/40 transition-all">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Applications</p>
                  <p className="text-2xl font-bold text-white mt-1">{applications.length}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => router.push('/jobs')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            Browse Jobs
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/earnings')}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            View Earnings
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-1">
            <TabsTrigger value="active" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all">Active Projects</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all">Applications</TabsTrigger>
            <TabsTrigger value="proposals" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-all">My Proposals</TabsTrigger>
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
              ) : activeProjects.length > 0 ? (
                activeProjects.map((project) => (
                  <Card key={project.id} className="bg-slate-900/40 backdrop-blur-md border-slate-800 hover:border-cyan-500/40 transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white">{project.title}</CardTitle>
                          <CardDescription className="text-slate-400">Client: {project.client}</CardDescription>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-300">In Progress</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-slate-400 text-sm">Progress</p>
                          <p className="text-slate-300 font-medium">{project.progress}%</p>
                        </div>
                        <Progress value={project.progress} className="h-2 bg-slate-700" />
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                        <p className="text-slate-400">Budget: <span className="text-cyan-400 font-semibold">${project.budget}</span></p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => router.push(`/projects/${project.id}`)}
                        >
                          View Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">No active projects</p>
                    <Button
                      onClick={() => router.push('/jobs')}
                      variant="outline"
                      className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Change Summary */}
          <TabsContent value="applications">
            <div className="space-y-4">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <Card key={app.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-white">Project: {app.project_id}</p>
                          <p className="text-slate-400 text-sm mt-1">{app.cover_letter}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            app.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                            app.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                            'bg-slate-700 text-slate-200'
                          }>
                            {app.status}
                          </Badge>
                          {app.proposed_rate && <p className="text-cyan-400 font-semibold mt-2">${app.proposed_rate}/hr</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">No applications submitted yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Proposals */}
          <TabsContent value="proposals">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                <p className="text-slate-400">View all your submitted proposals and their status</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
