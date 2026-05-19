'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, DollarSign, Calendar, MapPin, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900/20 to-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">Available Jobs</h1>
          <p className="text-slate-300">Find your next freelance opportunity</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={() => router.push('/jobs/post')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Post a Job
            </Button>
          </div>

          {/* Category Filter */}
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="Development">Development</TabsTrigger>
              <TabsTrigger value="Design">Design</TabsTrigger>
              <TabsTrigger value="Marketing">Marketing</TabsTrigger>
              <TabsTrigger value="Writing">Writing</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400">No jobs found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all cursor-pointer p-6" onClick={() => router.push(`/jobs/${job.id}`)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                    <p className="text-slate-400 text-sm">Posted by {job.client_id}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium">{job.category}</span>
                </div>

                <p className="text-slate-300 line-clamp-2 mb-4">{job.description}</p>

                {/* Skills */}
                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.required_skills.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {job.required_skills.length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs font-medium">
                        +{job.required_skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Job Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-slate-700/50 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <DollarSign className="h-4 w-4 text-cyan-400" />
                    <span className="text-white font-semibold">${job.budget_min} - ${job.budget_max}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-semibold">{job.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-white font-semibold">0 Applied</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
