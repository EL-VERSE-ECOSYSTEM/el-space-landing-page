'use client';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface MilestonePayment {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'funded' | 'released' | 'disputed';
  deliverables?: string[];
}

interface MilestonePaymentTrackerProps {
  milestones: MilestonePayment[];
  totalBudget: number;
}

export function MilestonePaymentTracker({
  milestones,
  totalBudget,
}: MilestonePaymentTrackerProps) {
  const totalReleased = milestones
    .filter(m => m.status === 'released')
    .reduce((sum, m) => sum + m.amount, 0);
  
  const percentageReleased = Math.round((totalReleased / totalBudget) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released':
        return 'bg-slate-600/20 text-slate-300 border-slate-600/50';
      case 'funded':
        return 'bg-slate-600/20 text-slate-300 border-slate-600/50';
      case 'disputed':
        return 'bg-red-600/20 text-red-300 border-red-600/50';
      default:
        return 'bg-slate-600/20 text-slate-300 border-slate-600/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'funded':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-slate-400" />
          <CardTitle className="text-white">Payment Milestones</CardTitle>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Funds Released</span>
            <span className="text-slate-400 font-semibold">${totalReleased.toFixed(2)} / ${totalBudget.toFixed(2)}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-slate-500 to-slate-500 h-2 rounded-full transition-all"
              style={{ width: `${percentageReleased}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-right">{percentageReleased}% complete</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className={`p-3 rounded-lg flex-shrink-0 ${getStatusColor(milestone.status)}`}>
                {getStatusIcon(milestone.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-white">
                      {index + 1}. {milestone.title}
                    </h4>
                    <p className="text-slate-400 text-sm">{milestone.description}</p>
                  </div>
                  <Badge className={getStatusColor(milestone.status)}>
                    {milestone.status === 'released' ? 'Released' :
                     milestone.status === 'funded' ? 'Funded' :
                     milestone.status === 'disputed' ? 'Disputed' : 'Pending'}
                  </Badge>
                </div>

                {/* Deliverables */}
                {milestone.deliverables && milestone.deliverables.length > 0 && (
                  <div className="mb-3 space-y-1">
                    <p className="text-xs text-slate-400 font-semibold">Deliverables:</p>
                    <ul className="space-y-1">
                      {milestone.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-slate-500" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-700/50 rounded p-2">
                    <p className="text-slate-400 mb-1">Amount</p>
                    <p className="font-semibold text-slate-400">${milestone.amount.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2">
                    <p className="text-slate-400 mb-1">Due Date</p>
                    <p className="font-semibold text-white">{milestone.dueDate.toLocaleDateString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2">
                    <p className="text-slate-400 mb-1">Percentage</p>
                    <p className="font-semibold text-white">{((milestone.amount / totalBudget) * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {(milestone.status === 'funded' || milestone.status === 'pending') && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                    >
                      Request Deliverables
                    </Button>
                  </div>
                )}

                {milestone.status === 'funded' && (
                  <Button 
                    size="sm"
                    className="mt-4 bg-slate-600 hover:bg-slate-700 text-white text-xs w-full"
                  >
                    Mark Deliverables as Received
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="pt-4 border-t border-slate-600 bg-slate-700/30 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-1">Total Budget</p>
              <p className="text-white font-semibold">${totalBudget.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Released</p>
              <p className="text-slate-400 font-semibold">${totalReleased.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Remaining</p>
              <p className="text-slate-400 font-semibold">${(totalBudget - totalReleased).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
