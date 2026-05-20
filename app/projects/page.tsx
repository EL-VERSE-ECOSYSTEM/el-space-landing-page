"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Clock, DollarSign, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project Nexus</h1>
            <p className="text-slate-500 font-medium">Explore and secure top-tier deployments.</p>
          </div>
          {user?.role === 'client' && (
            <Link href="/jobs/post">
              <Button className="bg-slate-900 hover:bg-cyan-600 rounded-xl font-bold">
                Post New Project
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.length > 0 ? projects.map((project) => (
              <Card key={project.id} className="bg-white border-slate-200 hover:border-cyan-500/50 transition-all group rounded-[2rem] overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-cyan-50 text-cyan-600 hover:bg-cyan-50 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                          {project.category}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                          Open
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-slate-600 line-clamp-2 font-medium">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {project.timeline}</span>
                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Intermediate+</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-6 min-w-[200px]">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Range</p>
                        <p className="text-2xl font-black text-slate-900">${project.budget_min} - ${project.budget_max}</p>
                      </div>
                      <Link href={`/jobs/${project.id}`} className="w-full sm:w-auto">
                        <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-xl px-8 group-hover:bg-slate-900 group-hover:text-white transition-all">
                          View Details <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900">No Projects Found</h3>
                <p className="text-slate-500">The Nexus is currently quiet. Check back soon for new deployments.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
