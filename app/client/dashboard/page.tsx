'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Rocket, Search, ChevronRight, Clock, ShieldCheck } from 'lucide-react';
import { DashboardStats } from '@/components/client/DashboardStats';
import Link from 'next/link';

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
    activeJobs: projects.filter(p => p.status === 'active').length,
    totalSpent: projects.reduce((sum, p) => sum + (p.total_budget || 0), 0),
    talentHired: projects.filter(p => p.status === 'completed').length, // Placeholder logic
    openProposals: 12, // Placeholder
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
             <Link href="/jobs" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Marketplace</Link>
             <Link href="/messages" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Messages</Link>
             <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-400 text-xs">
               {user?.name?.charAt(0) || 'C'}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 font-black text-[10px] uppercase tracking-widest mb-4">
               <ShieldCheck className="w-3 h-3" /> Verified Employer
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Client Hub</h1>
            <p className="text-slate-500 font-medium text-lg mt-1">Directing projects and talent acquisition.</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/jobs/post')}
              className="bg-slate-900 hover:bg-cyan-600 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-slate-200 transition-all group"
            >
              Post New Project <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
           <DashboardStats stats={stats} />
        </div>

        {/* Projects Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Projects</h3>
               <Link href="/jobs" className="text-xs font-black text-cyan-600 uppercase tracking-widest hover:text-cyan-700 transition-colors">View All Archive</Link>
            </div>

            <div className="space-y-6">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-48 bg-slate-50 border border-slate-100 rounded-[2.5rem] animate-pulse" />)
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <Card key={project.id} className="group border-2 border-slate-50 bg-white hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 md:p-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-2">
                           <div className="flex gap-2">
                             <Badge className="bg-cyan-50 text-cyan-600 border-none px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[9px]">
                               {project.category}
                             </Badge>
                             <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[9px]">
                               {project.status}
                             </Badge>
                           </div>
                           <h4 className="text-2xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors">{project.title}</h4>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                           <p className="text-xl font-black text-slate-900">${project.budget_min} - ${project.budget_max}</p>
                        </div>
                      </div>

                      <p className="text-slate-500 font-medium line-clamp-2 mb-8 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50">
                         <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                               <Clock className="w-4 h-4 text-slate-300" />
                               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Posted 3d ago</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Search className="w-4 h-4 text-slate-300" />
                               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">12 Applications</span>
                            </div>
                         </div>
                         <Button
                          onClick={() => router.push(`/jobs/${project.id}`)}
                          className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 text-slate-900 font-black px-8 py-6 rounded-2xl transition-all"
                        >
                          Management Console <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-24 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                  <Briefcase className="mx-auto h-16 w-16 text-slate-200 mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No project deployment found</p>
                  <Button onClick={() => router.push('/jobs/post')} variant="link" className="text-cyan-600 font-black mt-2">Initialize First Project</Button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight ml-2">Premium Network</h3>
            <Card className="border-2 border-slate-50 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100">
               <div className="space-y-8">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recommended Experts</p>
                     {[1, 2, 3].map(i => (
                       <div key={i} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                {String.fromCharCode(64 + i)}
                             </div>
                             <div>
                                <p className="font-black text-slate-900 text-sm group-hover:text-cyan-600 transition-colors">Expert User {i}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Stack • $85/h</p>
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-cyan-500 transition-all" />
                       </div>
                     ))}
                  </div>

                  <div className="pt-8 border-t border-slate-50">
                     <Button className="w-full h-14 bg-slate-900 hover:bg-cyan-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-slate-200">
                        Explore All Talent
                     </Button>
                  </div>
               </div>
            </Card>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-black tracking-tight">Need a customized team?</h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">Let our EL elites handle the sourcing and management for your enterprise needs.</p>
                  <p className="text-cyan-400 font-black text-[10px] uppercase tracking-widest pt-2 flex items-center gap-2">
                    Contact ELITES Support <ChevronRight className="w-3 h-3" />
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
