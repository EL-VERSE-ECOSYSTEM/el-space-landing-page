'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, FileText, TrendingUp, Briefcase } from 'lucide-react';

interface Freelancer {
  id: string;
  full_name: string;
  hourly_rate: number;
  years_experience: number;
  avg_rating: number;
  total_projects: number;
  skills: string[];
  bio: string;
  cv_url?: string;
  profile_picture?: string;
}

interface Application {
  id: string;
  freelancer_id: string;
  cover_letter: string;
  proposed_rate: number;
  estimated_days: number;
  status: string;
  created_at: string;
  freelancer?: Freelancer;
}

interface ApplicationCardProps {
  application: Application;
  onAccept?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  isClientView?: boolean;
}

export function ApplicationCard({ 
  application, 
  onAccept, 
  onReject, 
  isClientView = false 
}: ApplicationCardProps) {
  const [showCVModal, setShowCVModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const freelancer = application.freelancer;
  const statusColor = {
    pending: 'bg-slate500/20 text-slate300',
    accepted: 'bg-slate500/20 text-slate300',
    rejected: 'bg-red-500/20 text-red-300',
  }[application.status] || 'bg-slate-600 text-slate-200';

  return (
    <>
      <Card className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-colors">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {freelancer?.profile_picture ? (
                  <img 
                    src={freelancer.profile_picture} 
                    alt={freelancer.full_name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {freelancer?.full_name?.charAt(0) || 'F'}
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">
                    {freelancer?.full_name || 'Anonymous Freelancer'}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(freelancer?.avg_rating || 0)
                              ? 'fill-slate400 text-slate400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {freelancer?.avg_rating?.toFixed(1) || 'N/A'} ({freelancer?.total_projects || 0} projects)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Badge className={statusColor}>{application.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Freelancer Stats */}
          {freelancer && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs mb-1">Rate</p>
                <p className="text-slate-400 font-semibold">${freelancer.hourly_rate || 0}/hr</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs mb-1">Experience</p>
                <p className="text-slate-400 font-semibold">{freelancer.years_experience || 0} yrs</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-slate-400 text-xs mb-1">Proposal</p>
                <p className="text-slate-400 font-semibold">${application.proposed_rate}</p>
              </div>
            </div>
          )}

          {/* Skills */}
          {freelancer?.skills && freelancer.skills.length > 0 && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {freelancer.skills.slice(0, 5).map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-slate-700 text-slate-200 text-xs">
                    {skill}
                  </Badge>
                ))}
                {freelancer.skills.length > 5 && (
                  <Badge variant="secondary" className="bg-slate-700 text-slate-200 text-xs">
                    +{freelancer.skills.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Bio/Cover Letter */}
          <div>
            <p className="text-slate-400 text-sm mb-2">Cover Letter:</p>
            <p className="text-slate-300 text-sm line-clamp-3">{application.cover_letter}</p>
          </div>

          {/* Timeline */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <span>Estimated: <strong>{application.estimated_days} days</strong></span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailsModal(true)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Briefcase className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            
            {freelancer?.cv_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCVModal(true)}
                className="flex-1 border-slate-600 text-slate-400 hover:bg-slate-600/10"
              >
                <FileText className="h-4 w-4 mr-1" />
                View CV
              </Button>
            )}

            {isClientView && application.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => onAccept?.(application.id)}
                  className="flex-1 bg-slate600 hover:bg-slate700 text-white"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  onClick={() => onReject?.(application.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Profile Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Freelancer Profile</DialogTitle>
          </DialogHeader>
          
          {freelancer && (
            <div className="space-y-4 py-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                {freelancer.profile_picture ? (
                  <img 
                    src={freelancer.profile_picture} 
                    alt={freelancer.full_name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {freelancer.full_name?.charAt(0) || 'F'}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{freelancer.full_name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(freelancer.avg_rating || 0)
                              ? 'fill-slate400 text-slate400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-300">
                      {freelancer.avg_rating?.toFixed(1) || 'N/A'} 
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Hourly Rate</p>
                  <p className="text-slate-400 font-semibold">${freelancer.hourly_rate || 0}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Experience</p>
                  <p className="text-slate-400 font-semibold">{freelancer.years_experience || 0} yrs</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Projects</p>
                  <p className="text-slate-400 font-semibold">{freelancer.total_projects || 0}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Rating</p>
                  <p className="text-slate-400 font-semibold">{freelancer.avg_rating?.toFixed(1) || 'N/A'}</p>
                </div>
              </div>

              {/* Bio */}
              {freelancer.bio && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">About:</p>
                  <p className="text-slate-300 text-sm">{freelancer.bio}</p>
                </div>
              )}

              {/* Skills */}
              {freelancer.skills && freelancer.skills.length > 0 && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} className="bg-slate-600 text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* CV Link */}
              {freelancer.cv_url && (
                <div className="pt-4 border-t border-slate-600">
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowCVModal(true);
                    }}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download/View CV
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CV Viewer Modal */}
      <Dialog open={showCVModal} onOpenChange={setShowCVModal}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {freelancer?.full_name}&apos;s CV / Resume
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              View the freelancer&apos;s professional document
            </DialogDescription>
          </DialogHeader>
          
          {freelancer?.cv_url && (
            <div className="flex-1 flex flex-col">
              {/* PDF or document viewer */}
              {freelancer.cv_url.endsWith('.pdf') ? (
                <iframe
                  src={`${freelancer.cv_url}#toolbar=0`}
                  className="flex-1 w-full border border-slate-600 rounded-lg"
                  title="CV PDF"
                />
              ) : (
                <div className="flex-1 overflow-auto border border-slate-600 rounded-lg bg-slate-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">Document Preview</p>
                    <Button
                      onClick={() => window.open(freelancer.cv_url, '_blank')}
                      className="bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      Open Full Document
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowCVModal(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Close
                </Button>
                <Button
                  onClick={() => window.open(freelancer.cv_url, '_blank')}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  Download CV
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
