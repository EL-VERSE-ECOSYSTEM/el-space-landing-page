import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { senderId, recipientSpaceId, amount, transactionPin } = await request.json();

    if (!senderId || !recipientSpaceId || !amount || !transactionPin) {
      return NextResponse.json({ error: 'Missing transfer details' }, { status: 400 });
    }

    // 1. Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('transaction_pin, full_name')
      .eq('id', senderId)
      .single() as any;

    if (userError || !user) throw new Error('Sender not found');

    // 2. Verify Transaction PIN
    if (user.transaction_pin !== transactionPin) {
      return NextResponse.json({ error: 'Invalid Transaction PIN' }, { status: 403 });
    }

    // 3. Check wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', senderId)
      .single() as any;

    if (walletError || !wallet) throw new Error('Wallet not found');

    if (wallet.balance < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // 4. Find recipient by Space ID
    const { data: recipient, error: recError } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('el_space_id', recipientSpaceId)
      .single() as any;

    if (recError || !recipient) {
      return NextResponse.json({ error: 'Recipient Space ID not found' }, { status: 404 });
    }

    if (recipient.id === senderId) {
      return NextResponse.json({ error: 'Cannot transfer to yourself' }, { status: 400 });
    }

    // 4. Atomic Transfer (using RPC for safety)
    const { data: transferResult, error: xferError } = await supabase.rpc('process_internal_transfer', {
      p_sender_id: senderId,
      p_recipient_id: recipient.id,
      p_amount: amount
    });

    if (xferError) throw xferError;

    // 5. Log transaction
    await supabase.from('payments').insert([
      {
        user_id: senderId,
        amount: -amount,
        payment_type: 'internal_transfer',
        status: 'completed',
        description: `Transfer to ${recipient.full_name} (${recipientSpaceId})`,
        metadata: { recipient_id: recipient.id }
      },
      {
        user_id: recipient.id,
        amount: amount,
        payment_type: 'internal_transfer',
        status: 'completed',
        description: `Transfer from ${user.full_name}`,
        metadata: { sender_id: senderId }
      }
    ]);

    return NextResponse.json({ success: true, message: 'Transfer completed successfully' });

  } catch (error: any) {
    console.error('Transfer error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
