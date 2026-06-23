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
      case 'enterprise': return { icon: Globe, label: 'ENTERPRISE', color: 'text-slate500', bg: 'bg-slate500/10' };
      case 'business': return { icon: Building, label: 'BUSINESS', color: 'text-slate-500', bg: 'bg-slate-500/10' };
      case 'entrepreneur': return { icon: Zap, label: 'ENTREPRENEUR', color: 'text-slate500', bg: 'bg-slate500/10' };
      default: return { icon: Shield, label: 'CLIENT', color: 'text-primary', bg: 'bg-primary/10' };
    }
  };

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="min-h-screen text-foreground pb-20">
        <main className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
               <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase">
                  Mission <span className="bg-gradient-to-r from-primary to-slate-500 bg-clip-text text-transparent">Control</span>
               </h1>
               <p className="text-muted-foreground mt-2 text-xl font-medium">Analyze and deploy to high-priority opportunities.</p>
            </div>
            {user?.user_type !== 'freelancer' && (
              <Button onClick={() => router.push('/jobs/post')} className="h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-black px-10 rounded-2xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
                 <Rocket className="w-5 h-5 mr-2" /> Launch Mission
              </Button>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/40" />
                <Input
                   type="text"
                   placeholder="Scan missions by stack, title, or intelligence..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-16 h-20 bg-card border-border text-foreground placeholder:text-muted-foreground/30 rounded-[2rem] focus:ring-primary text-lg shadow-2xl"
                />
             </div>
             <Button className="h-20 bg-card border border-border hover:border-primary/50 text-muted-foreground rounded-[2rem] px-10 font-black uppercase tracking-widest text-xs transition-all">
                <Filter className="w-6 h-6 mr-2" /> Parameters
             </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="bg-card border border-border p-1.5 rounded-2xl mb-12 shadow-inner">
               <TabsTrigger value="all" className="rounded-xl px-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] transition-all">ALL SECTORS</TabsTrigger>
               <TabsTrigger value="Development" className="rounded-xl px-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] transition-all">DEVELOPMENT</TabsTrigger>
               <TabsTrigger value="Design" className="rounded-xl px-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] transition-all">DESIGN</TabsTrigger>
               <TabsTrigger value="Marketing" className="rounded-xl px-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] transition-all">MARKETING</TabsTrigger>
            </TabsList>

            {/* Jobs List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-32 bg-card/50 border-2 border-dashed border-border rounded-[4rem] shadow-inner">
                 <Briefcase className="w-20 h-20 text-muted-foreground/10 mx-auto mb-6" />
                 <p className="text-foreground font-black text-3xl uppercase tracking-tight">Sector Clear</p>
                 <p className="text-muted-foreground font-medium mt-2 max-w-md mx-auto">No active missions detected matching your current parameters.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredJobs.map((job) => {
                  const tier = getTierConfig(job.client_type || 'client');
                  return (
                    <Card key={job.id} className="bg-card border-border rounded-[3rem] overflow-hidden hover:border-primary/50 transition-all group cursor-pointer shadow-xl shadow-black/5" onClick={() => router.push(`/jobs/${job.id}`)}>
                      <CardContent className="p-10">
                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                          <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                               <Badge className={`${tier.bg} ${tier.color} border-none font-black text-[10px] tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5 uppercase`}>
                                  <tier.icon className="w-3.5 h-3.5" /> {tier.label}
                               </Badge>
                               <span className="text-muted-foreground/40 text-[10px] font-black tracking-widest uppercase">CAT: {job.category}</span>
                            </div>

                            <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase group-hover:text-primary transition-colors">
                               {job.title}
                            </h3>

                            <p className="text-muted-foreground font-medium leading-relaxed line-clamp-2 text-lg">
                               {job.description}
                            </p>

                            <div className="flex flex-wrap gap-3">
                               {(job.required_skills || ['Strategic', 'Tactical']).map((skill: string) => (
                                 <Badge key={skill} className="bg-secondary text-secondary-foreground border-none font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-md">
                                    {skill}
                                 </Badge>
                               ))}
                            </div>
                          </div>

                          <div className="flex flex-col justify-between items-end gap-10 min-w-[280px]">
                            <div className="text-right">
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Asset Allocation</p>
                               <p className="text-5xl font-black text-slate500 tracking-tighter">${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}</p>
                            </div>

                            <div className="flex flex-wrap justify-end gap-8 text-muted-foreground/60 font-black text-[10px] uppercase tracking-[0.2em]">
                               <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {job.timeline}</span>
                               <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> 0 Intel Packs</span>
                            </div>

                            <Button className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground font-black rounded-2xl h-16 transition-all uppercase text-xs tracking-widest shadow-sm">
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
