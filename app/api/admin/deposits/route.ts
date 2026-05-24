import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: deposits, error } = await supabase
      .from('deposits')
      .select(`
        *,
        user:users!user_id(full_name, email, el_space_id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, deposits });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { depositId, status, adminNotes } = await request.json();

    if (!depositId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get deposit record
    const { data: deposit, error: depositError } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', depositId)
      .single() as any;

    if (depositError || !deposit) throw new Error('Deposit record not found');

    if (deposit.status !== 'pending') {
       return NextResponse.json({ success: false, error: 'Deposit already processed' }, { status: 400 });
    }

    // 2. Handle approval logic
    if (status === 'approved' || status === 'completed') {
       // Add funds to user's wallet
       const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', deposit.user_id).single() as any;
       if (wallet) {
          await supabase.from('wallets').update({
            balance: (wallet.balance || 0) + deposit.amount
          }).eq('user_id', deposit.user_id);
       }

       // Log to payments ledger
       await supabase.from('payments').insert([{
         user_id: deposit.user_id,
         amount: deposit.amount,
         currency: deposit.currency,
         payment_type: 'wallet_funding',
         status: 'completed',
         description: `Wallet funded via ${deposit.method}`,
         metadata: { deposit_id: deposit.id }
       }]);
    }

    // 3. Update deposit record
    const { data: updatedDeposit } = await supabase
      .from('deposits')
      .update({
        status,
        admin_notes: adminNotes,
        processed_at: new Date(),
        updated_at: new Date()
      })
      .eq('id', depositId)
      .select()
      .single();

    return NextResponse.json({ success: true, deposit: updatedDeposit });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
