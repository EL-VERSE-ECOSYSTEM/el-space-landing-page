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
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">Project Nexus</h1>
            <p className="text-muted-foreground font-medium">Explore and secure top-tier deployments.</p>
          </div>
          {user?.role === 'client' && (
            <Link href="/jobs/post">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs h-12 px-6 shadow-lg shadow-primary/20 transition-all">
                Post New Project
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.length > 0 ? projects.map((project) => (
              <Card key={project.id} className="bg-card border-border hover:border-primary/50 transition-all group rounded-[2rem] overflow-hidden shadow-xl shadow-black/5">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                          {project.category}
                        </Badge>
                        <Badge className="bg-slate500/10 text-slate500 hover:bg-slate500/20 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                          Open
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                        {project.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-6 text-muted-foreground/60 font-black text-[10px] uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary" /> {project.timeline}</span>
                        <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-primary" /> Intermediate+</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-6 min-w-[200px]">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Budget Range</p>
                        <p className="text-3xl font-black text-foreground tracking-tighter">${project.budget_min} - ${project.budget_max}</p>
                      </div>
                      <Link href={`/jobs/${project.id}`} className="w-full sm:w-auto">
                        <Button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-black rounded-xl px-8 h-12 uppercase text-xs tracking-widest group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
                          View Details <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-24 bg-card border-2 border-dashed border-border rounded-[3rem] shadow-inner">
                <Briefcase className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">No Projects Found</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2">The Nexus is currently quiet. Check back soon for new deployments.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
