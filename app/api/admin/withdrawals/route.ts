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

    // 1. Update withdrawal record
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

    // 2. Handle Wallet balance based on status
    if (status === 'completed' || status === 'approved') {
       // Funds are already pending in wallet from the request.
       // For 'completed', we deduct from pending and add to 'total_withdrawn'
       const { data: wallet } = await supabase.from('wallets').select('pending_balance, total_withdrawn').eq('user_id', withdrawal.user_id).single() as any;
       if (wallet) {
          await supabase.from('wallets').update({
            pending_balance: Math.max(0, (wallet.pending_balance || 0) - withdrawal.amount),
            total_withdrawn: (wallet.total_withdrawn || 0) + withdrawal.amount
          }).eq('user_id', withdrawal.user_id);
       }
    } else if (status === 'rejected') {
       // Return funds to liquid balance from pending
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
