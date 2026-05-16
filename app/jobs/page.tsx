'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, DollarSign, Calendar, Users, Search, Filter, Rocket, ArrowRight, ShieldCheck } from 'lucide-react';

export default function JobsPage() {
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-white pt-24 pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 font-black text-[10px] uppercase tracking-widest">
                  <Briefcase className="w-3 h-3" /> Job Marketplace
               </div>
               <h1 className="text-5xl font-black text-slate-900 tracking-tight">Discover Opportunities</h1>
               <p className="text-slate-500 font-medium text-lg max-w-2xl">Connect with leading companies and work on high-impact projects that match your expertise.</p>
            </div>
            <Button
              onClick={() => router.push('/jobs/post')}
              className="bg-slate-900 hover:bg-cyan-600 text-white font-black px-10 py-8 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all hover:scale-105 active:scale-95 group"
            >
              Post a Project <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
               <Input
                placeholder="Search by role, skill, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-16 pl-14 bg-white border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 rounded-2xl font-bold focus:border-cyan-500 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4">
               <div className="h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <Filter className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Filters</span>
               </div>
            </div>
          </div>

          {/* Category Filter */}
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="bg-slate-50 p-1.5 rounded-2xl h-14 border border-slate-100 overflow-x-auto justify-start md:justify-center w-full md:w-max">
              {['all', 'Development', 'Design', 'Marketing', 'Writing'].map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-xl px-8 font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm"
                >
                  {cat === 'all' ? 'All Opportunities' : cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-50 border border-slate-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-32 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
              <Briefcase className="mx-auto h-20 w-20 text-slate-200 mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Projects Found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="group relative border-2 border-slate-100 bg-white hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden cursor-pointer"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <CardContent className="p-8 md:p-10">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                      <div className="space-y-4">
                         <div className="flex flex-wrap gap-2">
                            <Badge className="bg-cyan-50 text-cyan-600 hover:bg-cyan-50 border-none px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[10px]">
                              {job.category}
                            </Badge>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest px-3 py-1.5 bg-emerald-50 rounded-xl">
                               <ShieldCheck className="w-3 h-3" /> Verified Payment
                            </span>
                         </div>
                         <h3 className="text-3xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">{job.title}</h3>
                         <div className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                            <span>{job.client_id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>2h ago</span>
                         </div>
                      </div>
                      <div className="text-right hidden md:block">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Range</p>
                         <p className="text-3xl font-black text-slate-900">${job.budget_min} - ${job.budget_max}</p>
                      </div>
                   </div>

                   <p className="text-slate-500 text-lg font-medium line-clamp-2 mb-8 leading-relaxed">
                     {job.description}
                   </p>

                   {/* Skills */}
                   {job.required_skills && job.required_skills.length > 0 && (
                     <div className="flex flex-wrap gap-3 mb-10">
                       {job.required_skills.slice(0, 5).map((skill: string) => (
                         <span key={skill} className="px-5 py-2.5 rounded-2xl bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-widest border border-slate-100 group-hover:border-cyan-200 transition-all">
                           {skill}
                         </span>
                       ))}
                       {job.required_skills.length > 5 && (
                         <span className="px-5 py-2.5 rounded-2xl bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest border border-slate-100">
                           +{job.required_skills.length - 5}
                         </span>
                       )}
                     </div>
                   )}

                   {/* Footer info */}
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50">
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                               <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</p>
                               <p className="text-sm font-black text-slate-900">{job.timeline}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                               <Users className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applications</p>
                               <p className="text-sm font-black text-slate-900">12 Received</p>
                            </div>
                         </div>
                      </div>
                      <Button className="w-full md:w-auto bg-slate-900 hover:bg-cyan-600 rounded-2xl px-10 py-7 font-black text-lg group/btn">
                         Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
