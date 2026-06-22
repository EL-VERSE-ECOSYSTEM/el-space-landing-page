'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ApplicationCard } from '@/components/freelancer/ApplicationCard';
import { Briefcase, DollarSign, Calendar, Clock, ChevronLeft, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyFormData, setApplyFormData] = useState({
    coverLetter: '',
    proposedRate: '',
    estimatedDays: '',
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [params.id]);

  const fetchProjectDetails = async () => {
    try {
      // Fetch project
      const projectResponse = await fetch('/api/projects');
      const projectData = await projectResponse.json();
      const currentProject = projectData.projects?.find((p: any) => p.id === params.id);
      setProject(currentProject);

      // Fetch applications
      const appResponse = await fetch(`/api/applications?projectId=${params.id}`);
      const appData = await appResponse.json();
      setApplications(appData.applications || []);

      // Fetch milestones
      const milestoneResponse = await fetch(`/api/milestones?projectId=${params.id}`);
      const milestoneData = await milestoneResponse.json();
      setMilestones(milestoneData.milestones || []);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to apply');
      return;
    }
    if (!applyFormData.coverLetter || !applyFormData.proposedRate) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: user.id,
          projectId: params.id,
          coverLetter: applyFormData.coverLetter,
          rate: parseFloat(applyFormData.proposedRate),
          estimatedDays: parseInt(applyFormData.estimatedDays),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit application');

      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setApplyFormData({ coverLetter: '', proposedRate: '', estimatedDays: '' });
      fetchProjectDetails();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit application');
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    if (!user?.id) return;
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          status: 'accepted',
          clientId: user.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to accept application');

      toast.success('Application accepted! Freelancer has been hired.');
      fetchProjectDetails();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to accept application');
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          status: 'rejected',
        }),
      });

      if (!response.ok) throw new Error('Failed to reject application');

      toast.success('Application rejected.');
      fetchProjectDetails();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to reject application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 flex flex-col items-center justify-center text-foreground">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Project Data</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background pt-32 text-foreground">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-card border-border rounded-[2.5rem] shadow-2xl shadow-black/5">
            <CardContent className="py-24 text-center">
              <Briefcase className="w-20 h-20 text-muted-foreground/10 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">Project Node Offline</h2>
              <p className="text-muted-foreground font-medium mb-8 max-w-xs mx-auto">The deployment you are seeking is no longer active in the Nexus.</p>
              <Button onClick={() => router.push('/jobs')} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                 Browse Active Sectors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 text-foreground">
       {/* Orbs */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary font-black text-[10px] uppercase tracking-widest mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Nexus
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                 <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[10px]">
                   {project.category}
                 </Badge>
                 <Badge className="bg-slate500/10 text-slate500 hover:bg-slate500/20 border-none px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[10px]">
                   Open
                 </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">{project.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground font-medium">
                 <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                   <Calendar className="w-3.5 h-3.5 text-primary" /> Posted 2 days ago
                 </span>
                 <span className="w-1 h-1 rounded-full bg-border" />
                 <span className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                   <ShieldCheck className="w-3.5 h-3.5" /> Verified Escrow
                 </span>
              </div>
            </div>

            {user?.role === 'freelancer' && (
              <Button
                onClick={() => setShowApplyModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-widest px-12 h-20 rounded-[1.5rem] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98 group"
              >
                Initiate Deployment <Send className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div className="space-y-6">
               <h3 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3 uppercase">
                 Mission Parameters
               </h3>
               <div className="bg-card border border-border p-10 rounded-[2.5rem] text-muted-foreground leading-relaxed text-lg font-medium whitespace-pre-wrap shadow-inner">
                 {project.description}
               </div>
            </div>

            {/* Skills & Details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">Required Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {project.required_skills?.map((skill: string) => (
                  <div key={skill} className="px-6 py-4 bg-secondary text-secondary-foreground border border-border rounded-2xl font-black uppercase tracking-widest text-xs shadow-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            {milestones.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">Strategic Milestones</h3>
                <div className="space-y-4">
                  {milestones.map((milestone, idx) => (
                    <div key={milestone.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2rem] bg-card border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-black text-muted-foreground text-sm border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-black text-foreground uppercase tracking-tight text-lg">{milestone.title}</p>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-60">Sync Date: {new Date(milestone.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-6 md:pt-0 border-border/50">
                        <p className="font-black text-foreground text-2xl tracking-tighter">${milestone.amount}</p>
                        <Badge className="bg-secondary text-secondary-foreground border-none px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-sm">{milestone.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications (Client View) */}
            {user?.id === project.client_id && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">Received Dossiers</h3>
                   <Badge className="bg-primary/10 text-primary font-black px-4 py-1.5 rounded-full text-xs">{applications.length}</Badge>
                </div>
                {applications.length > 0 ? (
                  <div className="grid gap-6">
                    {applications.map((app) => (
                      <ApplicationCard 
                        key={app.id} 
                        application={app}
                        isClientView={true}
                        onAccept={(appId) => handleAcceptApplication(appId)}
                        onReject={(appId) => handleRejectApplication(appId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center bg-card/50 border-2 border-dashed border-border rounded-[3rem] shadow-inner">
                    <p className="text-muted-foreground/40 font-black uppercase tracking-widest text-sm">No incoming dossier transmissions detected.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Summary Card */}
            <Card className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 space-y-10">
                <div>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 opacity-60">Mission Allocation</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-5xl font-black text-foreground tracking-tighter">${project.budget_min}</span>
                     <span className="text-muted-foreground/30 font-black">-</span>
                     <span className="text-5xl font-black text-foreground tracking-tighter">${project.budget_max}</span>
                   </div>
                   <p className="text-xs font-black text-primary uppercase tracking-widest mt-3">Fixed-Node Contract</p>
                </div>

                <div className="space-y-8 pt-8 border-t border-border">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Cycle Time</p>
                        <p className="font-black text-foreground uppercase text-sm tracking-tight">{project.timeline}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center text-slate-500 shadow-inner">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Experience</p>
                        <p className="font-black text-foreground uppercase text-sm tracking-tight">Intermediate+</p>
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            {/* Client Info */}
            <div className="bg-foreground rounded-[2.5rem] p-10 text-background relative overflow-hidden group shadow-2xl shadow-black/20">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-background/40 uppercase tracking-[0.2em] mb-8">Client Origin</p>
                 <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-background flex items-center justify-center font-black text-foreground text-2xl shadow-xl">
                      {project.client_id?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <p className="font-black text-xl leading-tight uppercase tracking-tight">{project.client_id || 'Premium Node'}</p>
                      <p className="text-background/60 font-black text-[10px] mt-1.5 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Verified Entity
                      </p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6 py-6 border-y border-background/10">
                    <div>
                       <p className="text-[10px] font-black text-background/40 uppercase tracking-widest mb-1.5">Hires</p>
                       <p className="font-black text-lg tracking-tight">12 TOTAL</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-background/40 uppercase tracking-widest mb-1.5">Spent</p>
                       <p className="font-black text-lg tracking-tight">$24.5k+</p>
                    </div>
                 </div>
                 <Button variant="link" className="w-full text-primary hover:text-primary/80 font-black text-[10px] uppercase tracking-widest mt-6 h-auto p-0">
                    View Entity Dossier
                 </Button>
               </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <AlertDialog open={showApplyModal} onOpenChange={setShowApplyModal}>
            <AlertDialogContent className="bg-card border-none rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-black/40 max-w-2xl text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-3xl font-black text-foreground tracking-tighter uppercase">Submit Proposal</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground font-medium text-base">
                  Demonstrate your expertise and secure this project.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-8 py-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Proposed Strategy *</label>
                  <Textarea
                    placeholder="Outline your approach and deployment capabilities..."
                    value={applyFormData.coverLetter}
                    onChange={(e) => setApplyFormData({ ...applyFormData, coverLetter: e.target.value })}
                    className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/30 rounded-3xl p-8 h-48 focus:ring-primary/20 transition-all font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Asset Rate (USD) *</label>
                    <div className="relative">
                       <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30" />
                       <Input
                        type="number"
                        placeholder="0.00"
                        value={applyFormData.proposedRate}
                        onChange={(e) => setApplyFormData({ ...applyFormData, proposedRate: e.target.value })}
                        className="pl-14 h-16 bg-muted/50 border-border text-foreground rounded-2xl font-black text-2xl focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Mission Time (Days)</label>
                    <div className="relative">
                       <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30" />
                       <Input
                        type="number"
                        placeholder="Days"
                        value={applyFormData.estimatedDays}
                        onChange={(e) => setApplyFormData({ ...applyFormData, estimatedDays: e.target.value })}
                        className="pl-14 h-16 bg-muted/50 border-border text-foreground rounded-2xl font-black text-2xl focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl shadow-inner">
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] text-center">System Fee: 5% ({applyFormData.proposedRate ? (parseFloat(applyFormData.proposedRate) * 0.05).toFixed(2) : '0.00'}) will be allocated to platform maintenance.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <AlertDialogCancel className="h-16 flex-1 rounded-2xl border-2 border-border font-black text-muted-foreground hover:bg-secondary transition-all uppercase tracking-widest text-xs">
                  Abort
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmitApplication}
                  className="h-16 flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all"
                >
                  Confirm Transmission
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
