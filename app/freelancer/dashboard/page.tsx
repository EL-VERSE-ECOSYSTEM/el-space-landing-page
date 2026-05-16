'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Search, ChevronRight, Clock, ShieldCheck, Zap, Star, MessageSquare } from 'lucide-react';
import { DashboardStats } from '@/components/freelancer/DashboardStats';
import Link from 'next/link';

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

  const stats = {
    activeProjects: activeProjects.length,
    totalEarned: earnings?.totalEarnings || 0,
    jobSuccess: 100,
    profileViews: 142
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              EL
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent tracking-tight">SPACE</span>
          </Link>

          <div className="flex items-center gap-6">
             <Link href="/jobs" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Find Work</Link>
             <Link href="/messages" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Messages</Link>
             <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-400 text-xs">
               {user?.name?.charAt(0) || 'F'}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-black text-[10px] uppercase tracking-widest mb-4">
               <Zap className="w-3 h-3 fill-purple-600" /> Professional Elite
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Talent Hub</h1>
            <p className="text-slate-500 font-medium text-lg mt-1">Accelerate your career through high-impact missions.</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/jobs')}
              className="bg-slate-900 hover:bg-cyan-600 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-slate-200 transition-all group"
            >
              Browse Marketplace <Search className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
           <DashboardStats stats={stats} />
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="active" className="w-full">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Project Management</h3>
                  <TabsList className="bg-slate-50 p-1 rounded-xl h-10 border border-slate-100">
                    <TabsTrigger value="active" className="rounded-lg px-4 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm">Active</TabsTrigger>
                    <TabsTrigger value="applied" className="rounded-lg px-4 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm">Applied</TabsTrigger>
                  </TabsList>
               </div>

               <TabsContent value="active" className="space-y-6 focus-visible:outline-none">
                  {loading ? (
                    [1].map(i => <div key={i} className="h-40 bg-slate-50 border border-slate-100 rounded-[2.5rem] animate-pulse" />)
                  ) : activeProjects.length > 0 ? (
                    activeProjects.map((project) => (
                      <Card key={project.id} className="group border-2 border-slate-50 bg-white hover:border-transparent hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500 rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-8">
                           <div className="flex justify-between items-start mb-6">
                              <div className="space-y-1">
                                 <Badge className="bg-purple-50 text-purple-600 border-none px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[9px]">Mission In Progress</Badge>
                                 <h4 className="text-2xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">{project.title}</h4>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</p>
                                 <p className="text-xl font-black text-slate-900">${project.budget}</p>
                              </div>
                           </div>
                           <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-300" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Due in 5 days</span>
                                 </div>
                              </div>
                              <Button variant="outline" className="border-2 border-slate-100 text-slate-900 font-bold rounded-xl px-6">Access Workspace</Button>
                           </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="py-24 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                      <Briefcase className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold">No active missions found.</p>
                      <Button onClick={() => router.push('/jobs')} variant="link" className="text-purple-600 font-black mt-2">Browse Marketplace</Button>
                    </div>
                  )}
               </TabsContent>

               <TabsContent value="applied" className="space-y-6 focus-visible:outline-none">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <Card key={app.id} className="border-2 border-slate-50 bg-white rounded-[2rem] p-6 hover:shadow-xl transition-all">
                         <div className="flex justify-between items-center">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Application ID: {app.id.slice(0,8)}</p>
                               <h5 className="font-black text-slate-900">Project: {app.project_id}</h5>
                            </div>
                            <Badge className="bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-[9px]">{app.status}</Badge>
                         </div>
                      </Card>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100">
                       <MessageSquare className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                       <p className="text-slate-400 font-bold">No pending applications.</p>
                    </div>
                  )}
               </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight ml-2">Verification & Growth</h3>
            <Card className="border-2 border-slate-50 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100">
               <div className="space-y-8">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyan-50 border border-cyan-100">
                     <ShieldCheck className="w-8 h-8 text-cyan-600" />
                     <div>
                        <p className="text-xs font-black text-cyan-800 uppercase tracking-widest">Status</p>
                        <p className="font-black text-slate-900">Verified Expert</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Milestones</p>
                     {[
                       { label: 'Portfolio Review', status: 'Completed', color: 'text-emerald-500' },
                       { label: 'Identity Check', status: 'Completed', color: 'text-emerald-500' },
                       { label: 'Technical Assessment', status: 'Pending', color: 'text-amber-500' }
                     ].map((m, i) => (
                       <div key={i} className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-600">{m.label}</span>
                          <span className={m.color}>{m.status}</span>
                       </div>
                     ))}
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                     <Button className="w-full h-14 bg-slate-900 hover:bg-cyan-600 text-white font-black rounded-2xl transition-all">
                        Upgrade Tier
                     </Button>
                  </div>
               </div>
            </Card>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-50" />
               <div className="relative z-10 space-y-4">
                  <Star className="w-8 h-8 text-amber-400" />
                  <h4 className="text-xl font-black tracking-tight">Access Premium Jobs</h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">Join the top 1% by completing our advanced ecosystem certification.</p>
                  <Button variant="link" className="text-cyan-400 p-0 h-auto font-black text-[10px] uppercase tracking-widest pt-2">
                    Learn More <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
