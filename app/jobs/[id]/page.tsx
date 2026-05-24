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
      <div className="min-h-screen bg-white pt-32 flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Project</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-slate-50 border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-100">
            <CardContent className="py-24 text-center">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-slate-900 mb-2">Project Not Found</h2>
              <p className="text-slate-500 mb-8">The project you are looking for might have been closed or removed.</p>
              <Button onClick={() => router.push('/jobs')} className="bg-slate-900 hover:bg-cyan-600 rounded-2xl px-8 py-6 font-bold">
                 Browse Other Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
       {/* Orbs */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to listings
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                 <Badge className="bg-cyan-50 text-cyan-600 hover:bg-cyan-50 border-none px-4 py-1.5 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                   {project.category}
                 </Badge>
                 <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none px-4 py-1.5 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                   Open
                 </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{project.title}</h1>
              <div className="flex items-center gap-4 text-slate-500 font-medium">
                 <span className="flex items-center gap-1.5">
                   <Calendar className="w-4 h-4" /> Posted 2 days ago
                 </span>
                 <span className="w-1 h-1 rounded-full bg-slate-300" />
                 <span className="flex items-center gap-1.5 text-cyan-600 font-bold">
                   <ShieldCheck className="w-4 h-4" /> Verified Payment
                 </span>
              </div>
            </div>

            {user?.role === 'freelancer' && (
              <Button
                onClick={() => setShowApplyModal(true)}
                className="bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg px-10 py-8 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all hover:scale-105 active:scale-95 group"
              >
                Apply for this Job <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div className="space-y-6">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                 Project Overview
               </h3>
               <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-[2rem] text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                 {project.description}
               </div>
            </div>

            {/* Skills & Details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Required Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {project.required_skills?.map((skill: string) => (
                  <div key={skill} className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 shadow-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            {milestones.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Project Milestones</h3>
                <div className="space-y-4">
                  {milestones.map((milestone, idx) => (
                    <div key={milestone.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[1.5rem] bg-white border border-slate-100 hover:border-cyan-500/20 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 text-sm border border-slate-100 group-hover:bg-cyan-50 group-hover:text-cyan-600 group-hover:border-cyan-100 transition-colors">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{milestone.title}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Due: {new Date(milestone.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                        <p className="font-black text-slate-900 text-xl">${milestone.amount}</p>
                        <Badge className="bg-slate-100 text-slate-500 border-none px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[9px]">{milestone.status}</Badge>
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
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight font-black">Received Applications</h3>
                   <Badge className="bg-slate-100 text-slate-500 font-bold">{applications.length}</Badge>
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
                  <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                    <p className="text-slate-400 font-bold">No applications received yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Summary Card */}
            <Card className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 space-y-8">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Project Budget</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-black text-slate-900">${project.budget_min}</span>
                     <span className="text-slate-400 font-bold">-</span>
                     <span className="text-4xl font-black text-slate-900">${project.budget_max}</span>
                   </div>
                   <p className="text-sm font-bold text-slate-400 mt-2">Fixed-price contract</p>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</p>
                        <p className="font-bold text-slate-900">{project.timeline}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                        <p className="font-bold text-slate-900">Intermediate+</p>
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            {/* Client Info */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">About Client</p>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center font-black text-slate-900 text-xl">
                      {project.client_id?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <p className="font-black text-lg leading-tight">{project.client_id || 'Premium Client'}</p>
                      <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Identity Verified
                      </p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Hires</p>
                       <p className="font-bold">12 Total</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Spent</p>
                       <p className="font-bold">$24.5k+</p>
                    </div>
                 </div>
                 <Button variant="link" className="w-full text-cyan-400 hover:text-cyan-300 font-bold text-xs uppercase tracking-widest mt-4">
                    View Client Profile
                 </Button>
               </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <AlertDialog open={showApplyModal} onOpenChange={setShowApplyModal}>
            <AlertDialogContent className="bg-white border-none rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-3xl font-black text-slate-900 tracking-tight">Submit Proposal</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 font-medium text-base">
                  Demonstrate your expertise and secure this project.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-8 py-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Pitch *</label>
                  <Textarea
                    placeholder="Describe your relevant experience and how you'll approach this project..."
                    value={applyFormData.coverLetter}
                    onChange={(e) => setApplyFormData({ ...applyFormData, coverLetter: e.target.value })}
                    className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 rounded-3xl p-6 h-40 focus:border-cyan-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 text-cyan-600">Proposed Rate (\$) *</label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                       <Input
                        type="number"
                        placeholder="0.00"
                        value={applyFormData.proposedRate}
                        onChange={(e) => setApplyFormData({ ...applyFormData, proposedRate: e.target.value })}
                        className="pl-12 h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-black text-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Time (Days)</label>
                    <div className="relative">
                       <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                       <Input
                        type="number"
                        placeholder="Days"
                        value={applyFormData.estimatedDays}
                        onChange={(e) => setApplyFormData({ ...applyFormData, estimatedDays: e.target.value })}
                        className="pl-12 h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-black text-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-2xl">
                   <p className="text-[10px] font-black text-cyan-700 uppercase tracking-widest text-center">EL SPACE Fee: 5% ({applyFormData.proposedRate ? (parseFloat(applyFormData.proposedRate) * 0.05).toFixed(2) : '0.00'}) will be deducted.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <AlertDialogCancel className="h-16 flex-1 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmitApplication}
                  className="h-16 flex-1 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-slate-200 transition-all"
                >
                  Send Proposal
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
