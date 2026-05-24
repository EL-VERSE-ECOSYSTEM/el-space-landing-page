import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, currency, method, receiptUrl } = await request.json();

    if (!userId || !amount || !receiptUrl) {
      return NextResponse.json({ error: 'Missing required deposit fields' }, { status: 400 });
    }

    // 1. Get user's wallet
    const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', userId).single() as any;

    // 2. Create pending deposit record
    const { data: deposit, error } = await supabase
      .from('deposits')
      .insert([{
        user_id: userId,
        wallet_id: wallet?.id,
        amount,
        currency: currency || 'USD',
        method: method || 'bank_transfer',
        receipt_url: receiptUrl,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Deposit proof uploaded. Pending admin verification.',
      deposit
    });
  } catch (error: any) {
    console.error('Deposit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
