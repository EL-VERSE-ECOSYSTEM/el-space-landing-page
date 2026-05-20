'use client';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Calendar, Flag } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

interface ProjectTimelineProps {
  milestones: Milestone[];
  projectDeadline?: Date;
  estimatedDays?: number;
}

export function ProjectTimeline({ 
  milestones, 
  projectDeadline,
  estimatedDays 
}: ProjectTimelineProps) {
  const today = new Date();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-300 border-green-600/50';
      case 'in_progress':
        return 'bg-blue-600/20 text-blue-300 border-blue-600/50';
      case 'delayed':
        return 'bg-red-600/20 text-red-300 border-red-600/50';
      default:
        return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'delayed':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const calculateProgress = () => {
    const completed = milestones.filter(m => m.status === 'completed').length;
    return Math.round((completed / milestones.length) * 100);
  };

  const isOverdue = projectDeadline && today > projectDeadline;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white">Project Timeline</CardTitle>
          </div>
          {projectDeadline && (
            <Badge className={isOverdue ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}>
              {isOverdue ? 'Overdue' : 'On Track'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        {estimatedDays && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Overall Progress</span>
              <span className="text-cyan-400 font-semibold">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        )}

        {/* Milestones Timeline */}
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const isLate = milestone.status === 'delayed';
            const isCompleted = milestone.status === 'completed';
            const daysUntil = Math.ceil((milestone.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={milestone.id} className="relative">
                {/* Timeline connector */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-[19px] top-12 w-0.5 h-8 bg-slate-600" />
                )}

                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-600 text-white' 
                        : isLate
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700 text-cyan-400'
                    }`}>
                      {getStatusIcon(milestone.status)}
                    </div>
                  </div>

                  {/* Milestone content */}
                  <div className={`flex-1 p-4 rounded-lg border ${getStatusColor(milestone.status)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{milestone.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(milestone.status)}`}>
                        {milestone.status === 'completed' ? 'Completed' : 
                         milestone.status === 'in_progress' ? 'In Progress' :
                         milestone.status === 'delayed' ? 'Delayed' : 'Pending'}
                      </Badge>
                    </div>

                    {milestone.description && (
                      <p className="text-sm text-slate-300 mb-3">{milestone.description}</p>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-black/20 rounded p-2">
                        <p className="text-slate-400">Due Date</p>
                        <p className="font-semibold text-white">{milestone.dueDate.toLocaleDateString()}</p>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <p className="text-slate-400">Amount</p>
                        <p className="font-semibold text-cyan-400">${milestone.amount}</p>
                      </div>
                      {!isCompleted && (
                        <div className="bg-black/20 rounded p-2">
                          <p className="text-slate-400">{isLate ? 'Days Late' : 'Days Left'}</p>
                          <p className={`font-semibold ${isLate ? 'text-red-400' : 'text-white'}`}>
                            {Math.abs(daysUntil)} days
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deadline Summary */}
        {projectDeadline && (
          <div className="pt-4 border-t border-slate-600">
            <div className="text-sm">
              <p className="text-slate-400 mb-1">Project Deadline</p>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{projectDeadline.toLocaleDateString()}</p>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isOverdue 
                    ? 'bg-red-600/20 text-red-300'
                    : 'bg-green-600/20 text-green-300'
                }`}>
                  {isOverdue 
                    ? `${Math.abs(Math.ceil((projectDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))} days overdue`
                    : `${Math.ceil((projectDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                  }
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
