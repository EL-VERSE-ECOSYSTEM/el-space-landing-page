import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: stats, error } = await supabase.rpc('get_admin_stats');

    // Fallback if RPC doesn't exist yet
    if (error) {
      const [users, payments, jobs, withdrawals] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('payments').select('amount'),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('withdrawals').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      const totalPayments = (payments.data as any[])?.reduce((acc: number, p: any) => acc + (p.amount || 0), 0) || 0;

      return NextResponse.json({
        success: true,
        stats: {
          totalUsers: users.count || 0,
          totalPayments: totalPayments.toLocaleString(),
          pendingPayments: 0,
          totalJobListings: jobs.count || 0,
          pendingApprovals: 0,
          activeDisputes: 0,
          totalWithdrawals: 0,
          pendingWithdrawals: withdrawals.count || 0
        }
      });
    }

    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
