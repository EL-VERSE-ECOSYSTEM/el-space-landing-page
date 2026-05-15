'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ApplicationCard } from '@/components/freelancer/ApplicationCard';
import { Briefcase, MapPin, DollarSign, Calendar, User, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectDetailPage() {
  const params = useParams();
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
    if (!applyFormData.coverLetter || !applyFormData.proposedRate) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const userId = user?.id || ''
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: userId, // Updated from hardcoded user-123
          projectId: params.id,
          coverLetter: applyFormData.coverLetter,
          rate: parseFloat(applyFormData.proposedRate),
          estimatedDays: parseInt(applyFormData.estimatedDays),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit application');

      toast.success('Application submitted!');
      setShowApplyModal(false);
      setApplyFormData({ coverLetter: '', proposedRate: '', estimatedDays: '' });
      fetchProjectDetails();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit application');
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          status: 'accepted',
          clientId: user?.id || '', // Updated from hardcoded user-123
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400">Project not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
              <p className="text-slate-400">Posted by {project.client_id}</p>
            </div>
            <Badge className="bg-cyan-500/20 text-cyan-300">{project.category}</Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>

            {/* Skills & Details */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.required_skills && project.required_skills.length > 0 && (
                  <div>
                    <p className="text-slate-400 mb-2 text-sm">Skills Required:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.required_skills.map((skill: string) => (
                        <Badge key={skill} className="bg-slate-700 text-slate-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Milestones */}
            {milestones.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Milestones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                      <div className="flex-1">
                        <p className="font-medium text-white">{milestone.title}</p>
                        <p className="text-sm text-slate-400">Due: {new Date(milestone.due_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-cyan-400">${milestone.amount}</p>
                        <Badge className="bg-slate-600 text-slate-200 text-xs">{milestone.status}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Applications */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Applications ({applications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
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
                  <p className="text-slate-400">No applications yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-cyan-400">
                  ${project.budget_min} - ${project.budget_max}
                </p>
                <p className="text-slate-400 text-sm mt-2">Fixed Budget</p>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Timeline</p>
                  <p className="text-white">{project.timeline}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <Badge className="bg-green-500/20 text-green-300">Open</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button
              onClick={() => setShowApplyModal(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 h-auto"
            >
              Apply Now
            </Button>

            {/* Client Info */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    C
                  </div>
                  <div>
                    <p className="font-medium text-white">{project.client_id}</p>
                    <p className="text-slate-400 text-sm">Client Member</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <AlertDialog open={showApplyModal} onOpenChange={setShowApplyModal}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Apply to Project</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Submit your proposal to apply for this job
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-slate-300 text-sm">Cover Letter *</label>
                  <Textarea
                    placeholder="Tell the client why you're a good fit..."
                    value={applyFormData.coverLetter}
                    onChange={(e) => setApplyFormData({ ...applyFormData, coverLetter: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm">Proposed Rate ($) *</label>
                    <Input
                      type="number"
                      placeholder="Rate"
                      value={applyFormData.proposedRate}
                      onChange={(e) => setApplyFormData({ ...applyFormData, proposedRate: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm">Est. Days</label>
                    <Input
                      type="number"
                      placeholder="Days"
                      value={applyFormData.estimatedDays}
                      onChange={(e) => setApplyFormData({ ...applyFormData, estimatedDays: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmitApplication}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  Submit Application
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
