'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase, DollarSign, Calendar, Users,
  Search, Filter, ChevronRight, Zap,
  Building, Globe, Rocket, Shield
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { DashboardLayout } from '@/components/dashboard/auth-guard';

export default function JobsPage() {
  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setJobs(data.projects || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || job.category === filter;
    return matchesSearch && matchesFilter;
  });

  const getTierConfig = (type: string) => {
    switch (type) {
      case 'enterprise': return { icon: Globe, label: 'ENTERPRISE', color: 'text-purple-400', bg: 'bg-purple-400/10' };
      case 'business': return { icon: Building, label: 'BUSINESS', color: 'text-blue-400', bg: 'bg-blue-400/10' };
      case 'entrepreneur': return { icon: Zap, label: 'ENTREPRENEUR', color: 'text-amber-400', bg: 'bg-amber-400/10' };
      default: return { icon: Shield, label: 'CLIENT', color: 'text-cyan-400', bg: 'bg-cyan-400/10' };
    }
  };

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="min-h-screen text-slate-200 pb-20">
        <main className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
               <h1 className="text-6xl font-black text-white tracking-tighter">
                  Mission <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Control</span>
               </h1>
               <p className="text-slate-400 mt-2 text-xl font-medium">Analyze and deploy to high-priority opportunities.</p>
            </div>
            {user?.user_type !== 'freelancer' && (
              <Button onClick={() => router.push('/jobs/post')} className="h-14 bg-white text-slate-950 hover:bg-cyan-500 hover:text-white font-black px-10 rounded-2xl transition-all shadow-xl shadow-slate-950">
                 <Rocket className="w-5 h-5 mr-2" /> Launch Mission
              </Button>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                <Input
                   type="text"
                   placeholder="Scan missions by stack, title, or intelligence..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-16 h-20 bg-slate-900 border-slate-800 text-white placeholder-slate-600 rounded-[2rem] focus:ring-cyan-500 text-lg shadow-2xl"
                />
             </div>
             <Button className="h-20 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 rounded-[2rem] px-10">
                <Filter className="w-6 h-6 mr-2" /> Parameters
             </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-2xl mb-12">
               <TabsTrigger value="all" className="rounded-xl px-8 data-[state=active]:bg-cyan-500 data-[state=active]:text-white font-black text-xs">ALL SECTORS</TabsTrigger>
               <TabsTrigger value="Development" className="rounded-xl px-8 data-[state=active]:bg-cyan-500 data-[state=active]:text-white font-black text-xs">DEVELOPMENT</TabsTrigger>
               <TabsTrigger value="Design" className="rounded-xl px-8 data-[state=active]:bg-cyan-500 data-[state=active]:text-white font-black text-xs">DESIGN</TabsTrigger>
               <TabsTrigger value="Marketing" className="rounded-xl px-8 data-[state=active]:bg-cyan-500 data-[state=active]:text-white font-black text-xs">MARKETING</TabsTrigger>
            </TabsList>

            {/* Jobs List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-32 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[4rem]">
                 <Briefcase className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                 <p className="text-slate-500 font-black text-2xl">Sector Clear</p>
                 <p className="text-slate-600 font-medium mt-2">No active missions detected matching your current parameters.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredJobs.map((job) => {
                  const tier = getTierConfig(job.client_type || 'client');
                  return (
                    <Card key={job.id} className="bg-slate-900 border-slate-800 rounded-[3rem] overflow-hidden hover:border-cyan-500/50 transition-all group cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
                      <CardContent className="p-10">
                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                          <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                               <Badge className={`${tier.bg} ${tier.color} border-none font-black text-[10px] tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5`}>
                                  <tier.icon className="w-3.5 h-3.5" /> {tier.label}
                               </Badge>
                               <span className="text-slate-600 text-[10px] font-black tracking-widest uppercase">CAT: {job.category}</span>
                            </div>

                            <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                               {job.title}
                            </h3>

                            <p className="text-slate-400 font-medium leading-relaxed line-clamp-2 text-lg">
                               {job.description}
                            </p>

                            <div className="flex flex-wrap gap-3">
                               {(job.required_skills || ['Strategic', 'Tactical']).map((skill: string) => (
                                 <Badge key={skill} className="bg-slate-800 text-slate-500 border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1">
                                    {skill}
                                 </Badge>
                               ))}
                            </div>
                          </div>

                          <div className="flex flex-col justify-between items-end gap-10 min-w-[240px]">
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Asset Allocation</p>
                               <p className="text-4xl font-black text-emerald-400 tracking-tighter">${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}</p>
                            </div>

                            <div className="flex flex-wrap justify-end gap-6 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                               <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> {job.timeline}</span>
                               <span className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> 0 Intel Packs</span>
                            </div>

                            <Button className="w-full bg-white text-slate-950 hover:bg-cyan-500 hover:text-white font-black rounded-xl h-14 transition-all">
                               Analyze Dossier <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
}
