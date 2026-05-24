import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        user:users!user_id(full_name, email, el_space_id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, withdrawals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { withdrawalId, status, adminNotes } = await request.json();

    if (!withdrawalId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get old record to check status transition
    const { data: oldWithdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single() as any;

    if (fetchError || !oldWithdrawal) throw new Error('Withdrawal record not found');

    // 2. Update withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .update({
        status,
        admin_notes: adminNotes,
        processed_at: new Date(),
        updated_at: new Date()
      })
      .eq('id', withdrawalId)
      .select()
      .single() as any;

    if (withdrawalError) throw withdrawalError;

    // Update corresponding payment status if exists
    if (withdrawal.payment_id) {
      await supabase.from('payments').update({ status }).eq('id', withdrawal.payment_id);
    }

    // 3. Handle Wallet balance based on status transition
    if (status === 'completed' && oldWithdrawal.status !== 'completed' && oldWithdrawal.status !== 'rejected') {
       // Finalize: Deduct from pending and add to 'total_withdrawn'
       const { data: wallet } = await supabase.from('wallets').select('pending_balance, total_withdrawn').eq('user_id', withdrawal.user_id).single() as any;
       if (wallet) {
          await supabase.from('wallets').update({
            pending_balance: Math.max(0, (wallet.pending_balance || 0) - withdrawal.amount),
            total_withdrawn: (wallet.total_withdrawn || 0) + withdrawal.amount
          }).eq('user_id', withdrawal.user_id);
       }
    } else if (status === 'rejected' && oldWithdrawal.status !== 'rejected' && oldWithdrawal.status !== 'completed') {
       // Revert: Return funds to liquid balance from pending
       const { data: wallet } = await supabase.from('wallets').select('balance, pending_balance').eq('user_id', withdrawal.user_id).single() as any;
       if (wallet) {
          await supabase.from('wallets').update({
            balance: (wallet.balance || 0) + withdrawal.amount,
            pending_balance: Math.max(0, (wallet.pending_balance || 0) - withdrawal.amount)
          }).eq('user_id', withdrawal.user_id);
       }
    }

    return NextResponse.json({ success: true, withdrawal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
