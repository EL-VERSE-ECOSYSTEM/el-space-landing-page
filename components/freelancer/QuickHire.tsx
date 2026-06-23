'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Zap, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuickHireProps {
  freelancerId: string;
  freelancerName: string;
  projectBudget: number;
  proposedRate: number;
  estimatedDays: number;
  onConfirmHire?: (data: { freelancerId: string; proposedRate: number; estimatedDays: number }) => Promise<void>;
}

export function QuickHire({
  freelancerId,
  freelancerName,
  projectBudget,
  proposedRate,
  estimatedDays,
  onConfirmHire,
}: QuickHireProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const totalWithFees = projectBudget + (projectBudget * 0.08); // 8% platform fee

  const handleConfirmHire = async () => {
    try {
      setLoading(true);
      
      if (onConfirmHire) {
        await onConfirmHire({
          freelancerId,
          proposedRate,
          estimatedDays,
        });
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast.success('Freelancer hired successfully!');
      setStep(3);
      
      setTimeout(() => {
        setShowDialog(false);
        setStep(1);
      }, 2000);
    } catch (error) {
      console.error('Error hiring freelancer:', error);
      toast.error('Failed to hire freelancer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setStep(1);
          setShowDialog(true);
        }}
        className="bg-slate-600 hover:bg-slate-700 text-white gap-2"
      >
        <Zap className="h-4 w-4" />
        Quick Hire
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-slate-400" />
              Quick Hire {freelancerName}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Fast-track hiring with instant project setup
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                {/* Review Summary */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                      <span className="text-slate-400">Freelancer</span>
                      <span className="text-white font-semibold">{freelancerName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                      <span className="text-slate-400">Proposed Rate</span>
                      <span className="text-slate-400 font-semibold">${proposedRate}/hr</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                      <span className="text-slate-400">Est. Duration</span>
                      <span className="text-white font-semibold">{estimatedDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Project Budget</span>
                      <span className="text-white font-semibold">${projectBudget.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Fee Breakdown */}
                <Card className="bg-slate-600/10 border-slate-600/50">
                  <CardContent className="pt-6 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal</span>
                      <span>${projectBudget.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Platform Fee (8%)</span>
                      <span>${(projectBudget * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold pt-2 border-t border-slate-600/50">
                      <span>Total to Charge</span>
                      <span className="text-slate-400">${totalWithFees.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* What Happens Next */}
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-slate-400" />
                    What happens next:
                  </h4>
                  <ol className="space-y-2 text-sm text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-slate-400 font-bold">1.</span>
                      <span>Charge your payment method</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-slate-400 font-bold">2.</span>
                      <span>Create initial milestone</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-slate-400 font-bold">3.</span>
                      <span>Join Slack channel</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-slate-400 font-bold">4.</span>
                      <span>Project starts immediately</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 py-4">
              {/* Confirmation */}
              <div className="text-center space-y-3">
                <div className="text-4xl">🚀</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Ready to start?</h3>
                  <p className="text-slate-400 text-sm">
                    Once you confirm, {freelancerName} will be hired immediately and we&apos;ll charge ${totalWithFees.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-slate-600/20 border border-slate-600/50 rounded-lg p-3">
                <div className="flex gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-300 font-semibold">You&apos;re protected</p>
                    <p className="text-slate-200/80 text-xs">Money held in escrow until milestone completion</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirmHire}
                  disabled={loading}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
                >
                  {loading ? 'Processing...' : 'Confirm & Hire'}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 py-8 text-center">
              <div className="text-5xl animate-bounce">✅</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Hired!</h3>
                <p className="text-slate-400 text-sm">
                  {freelancerName} has been added to your project
                </p>
              </div>
              <div className="text-sm text-slate-500">
                Redirecting to project dashboard...
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
