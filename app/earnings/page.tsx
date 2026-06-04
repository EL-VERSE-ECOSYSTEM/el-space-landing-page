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
    if (!user?.id) {
      setLoading(false);
      return;
    }
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
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase">Earnings <span className="text-primary">Command</span></h1>
          <p className="text-muted-foreground font-medium mt-2">Strategic fiscal oversight and liquidity management.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-card border-border border-l-4 border-l-primary rounded-2xl p-6 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Cumulative Asset Yield</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">
                  ${stats?.totalEarnings || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border border-l-4 border-l-emerald-500 rounded-2xl p-6 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Executed Contracts</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">
                  {stats?.completedProjects || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border border-l-4 border-l-amber-500 rounded-2xl p-6 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Escrow In-Transit</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">
                  ${stats?.pendingEarnings || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Avg Node Value</p>
                <p className="text-3xl font-black text-foreground tracking-tighter">
                  ${stats?.averageProjectValue || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border rounded-[2.5rem] p-8 shadow-2xl shadow-black/5">
              <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-tight">Yield Velocity</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      fontWeight="bold"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      fontWeight="bold"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '1rem',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Withdrawal */}
          <Card className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-tight relative z-10">Liquidate Assets</h3>
            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Liquid Balance</p>
                <p className="text-5xl font-black text-primary tracking-tighter">${stats?.totalEarnings || 0}</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Liquidation Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-black">$</span>
                  <input
                    type="number"
                    min="0"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-14 pl-10 pr-6 bg-muted/50 border border-border rounded-xl text-foreground font-black text-lg focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
              </div>

              <Button
                onClick={handleWithdrawal}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                Authorize Withdrawal
              </Button>

              <p className="text-[10px] text-muted-foreground/40 text-center font-bold leading-relaxed">
                Min protocol: $10.00. Processing cycle: 5-7 business rotations.
              </p>
            </div>
          </Card>
        </div>

        {/* Earnings History */}
        <Card className="mt-10 bg-card border-border rounded-[2.5rem] p-10 shadow-2xl shadow-black/5">
          <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-tight">Ledger Synchronizations</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : earnings.length > 0 ? (
              earnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/20 hover:bg-muted/50 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                      <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="font-black text-foreground uppercase tracking-tight">{earning.project_title}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Status: <span className="text-primary">{earning.status}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-500 text-2xl tracking-tighter">+${earning.total_amount}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                      {new Date(earning.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center">
                <p className="text-muted-foreground/40 font-black uppercase tracking-widest text-sm">No ledger entries detected in the current cycle.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
