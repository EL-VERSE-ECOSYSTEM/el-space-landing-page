import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { senderId, recipientSpaceId, amount, transactionPin } = await request.json();

    if (!senderId || !recipientSpaceId || !amount || !transactionPin) {
      return NextResponse.json({ error: 'Missing transfer details' }, { status: 400 });
    }

    // 1. Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('transaction_pin_hash, full_name')
      .eq('id', senderId)
      .single() as any;

    if (userError || !user) throw new Error('Sender not found');

    // 2. Verify Transaction PIN
    if (!user.transaction_pin_hash) {
      return NextResponse.json({ error: 'Transaction PIN not set up' }, { status: 403 });
    }
    const isPinValid = await bcrypt.compare(transactionPin, user.transaction_pin_hash);
    if (!isPinValid) {
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

    // 4. Create Pending Transfer Record (Applying 2.5% fee)
    const transferFee = amount * 0.025;
    const netTransferAmount = amount - transferFee;

    const { data: transfer, error: transferError } = await supabase
      .from('internal_transfers')
      .insert([{
        sender_id: senderId,
        recipient_id: recipient.id,
        amount,
        fee_amount: transferFee,
        net_amount: netTransferAmount,
        currency: 'USD',
        status: 'pending'
      }])
      .select()
      .single();

    if (transferError) throw transferError;

    // 5. Lock funds in sender wallet (move to pending)
    const newBalance = (wallet.balance || 0) - amount;
    const newPending = (wallet.pending_balance || 0) + amount;

    await supabase.from('wallets').update({
      balance: newBalance,
      pending_balance: newPending
    }).eq('user_id', senderId);

    return NextResponse.json({
      success: true,
      message: 'Transfer request submitted for admin approval',
      transferId: (transfer as any).id
    });

  } catch (error: any) {
    console.error('Transfer error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
