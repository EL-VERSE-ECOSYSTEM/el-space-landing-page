'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EarningsPage() {
  const { user, loading: authLoading } = useAuth();
  const [earnings, setEarnings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  useEffect(() => {
    if (!authLoading) {
      fetchEarnings();
    }
  }, [authLoading, user]);

  const fetchEarnings = async () => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/earnings?freelancerId=${user.id}`);
      const data = await response.json();
      setEarnings(data.earnings || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!user?.id) return;
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    try {
      const response = await fetch('/api/earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: user.id,
          amount: parseFloat(withdrawalAmount),
          reason: 'Withdrawal request',
        }),
      });

      if (!response.ok) throw new Error('Failed to request withdrawal');

      toast.success('Withdrawal request submitted!');
      setWithdrawalAmount('');
      fetchEarnings();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to request withdrawal');
    }
  };

  // Generate chart data from last 6 months
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const monthEarnings = earnings
        .filter((e) => {
          const date = new Date(e.created_at || e.date);
          return date.getMonth() === index;
        })
        .reduce((sum, e) => sum + (e.amount || 0), 0);
      return { month, earnings: monthEarnings };
    });
  };

  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">Earnings Dashboard</h1>
          <p className="text-slate-300">Track your income and manage withdrawals</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${stats?.totalEarnings || 0}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-cyan-400" />
            </div>
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed Projects</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats?.completedProjects || 0}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
          </div>

          <div className="rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Earnings</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${stats?.pendingEarnings || 0}
                </p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Project Value</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${stats?.averageProjectValue || 0}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-6">Earnings Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Bar dataKey="earnings" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Withdrawal */}
          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Request Withdrawal</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-2">Available Balance</p>
                <p className="text-3xl font-bold text-cyan-400">${stats?.totalEarnings || 0}</p>
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-2 w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>

              <Button
                onClick={handleWithdrawal}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2"
              >
                Request Withdrawal
              </Button>

              <p className="text-xs text-slate-400 text-center">
                Minimum withdrawal: $10. Processed within 5-7 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Earnings History */}
        <div className="mt-8 rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-6">
          <h3 className="text-xl font-bold text-white mb-6">Earnings History</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
              </div>
            ) : earnings.length > 0 ? (
              earnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all">
                  <div>
                    <p className="font-medium text-white">{earning.project_title}</p>
                    <p className="text-sm text-slate-400">Status: <span className="text-cyan-400 font-semibold">{earning.status}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400 text-lg">${earning.total_amount}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(earning.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-12">No earnings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
