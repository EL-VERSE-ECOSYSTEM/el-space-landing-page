import { NextRequest, NextResponse } from 'next/server';
import { initializePayment, verifyPayment, createPayout } from '@/lib/korapay';
import { 
  supabase, 
  updateWalletBalance, 
  createPayment, 
  updatePaymentStatus, 
  internalTransfer, 
  getUserById 
} from '@/lib/supabase';
import { calculateClientFee, calculateFreelancerPayout } from '@/lib/fees';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'el-space-secret-key';

function verifyOTPToken(token: string, type: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.verified && decoded.type === type;
  } catch (e) {
    return false;
  }
}

/**
 * Handle payment actions:
 * 1. fund-wallet: Initialize Korapay payment to fund client wallet
 * 2. verify-funding: Verify Korapay payment and update wallet balance
 * 3. fund-milestone: Move funds from wallet to project escrow
 * 4. release-payment: Release funds from escrow to freelancer (with fees/penalties)
 * 5. internal-transfer: Send funds between users via EL SPACE ID (OTP required)
 * 6. withdraw: Withdraw funds to bank or crypto (OTP required)
 */
export async function POST(request: NextRequest) {
  try {
    const { action, otpToken, ...params } = await request.json();

    switch (action) {
      case 'fund-wallet':
        return await handleFundWallet(params);
      case 'verify-funding':
        return await handleVerifyFunding(params);
      case 'fund-milestone':
        return await handleFundMilestone(params);
      case 'release-payment':
        return await handleReleasePayment(params);
      case 'internal-transfer':
        if (!verifyOTPToken(otpToken, 'transfer')) {
          return NextResponse.json({ error: 'OTP verification required for transfer' }, { status: 401 });
        }
        return await handleInternalTransfer(params);
      case 'withdraw':
        if (!verifyOTPToken(otpToken, 'withdrawal')) {
          return NextResponse.json({ error: 'OTP verification required for withdrawal' }, { status: 401 });
        }
        return await handleWithdraw(params);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Error in payments API:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
  }
}

async function handleFundWallet({ amount, currency, email, name, userId }: any) {
  if (!amount || !email || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const reference = `WAL-${userId}-${Date.now()}`;
  const data = await initializePayment({
    amount,
    currency: currency || 'USD',
    customer: { email, name: name || email },
    reference,
    description: 'Funding EL SPACE wallet',
  });

  await createPayment({
    user_id: userId,
    amount,
    currency: currency || 'USD',
    status: 'pending',
    reference,
    payment_type: 'wallet_funding',
  });

  return NextResponse.json({ success: true, checkout_url: data.checkout_url, reference });
}

async function handleVerifyFunding({ reference, userId }: any) {
  const data = await verifyPayment(reference);
  
  if (data.status === 'success') {
    const { data: existing } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single();
    
    if (existing && existing.status === 'completed') {
      return NextResponse.json({ success: true, message: 'Already funded' });
    }

    await updateWalletBalance(userId, data.amount);
    await updatePaymentStatus(existing.id, 'completed');

    return NextResponse.json({ success: true, amount: data.amount });
  }

  return NextResponse.json({ success: false, status: data.status });
}

async function handleFundMilestone({ userId, milestoneId, projectId, amount }: any) {
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single();

  const clientFee = calculateClientFee(amount);
  const totalNeeded = amount + clientFee;

  if (!wallet || wallet.balance < totalNeeded) {
    return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
  }

  await updateWalletBalance(userId, -totalNeeded);

  await createPayment({
    user_id: userId,
    project_id: projectId,
    milestone_id: milestoneId,
    amount: amount,
    fee_amount: clientFee,
    currency: 'USD',
    status: 'escrowed',
    payment_type: 'milestone_funding',
  });

  return NextResponse.json({ success: true });
}

async function handleReleasePayment({ milestoneId, freelancerId, isLate }: any) {
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('milestone_id', milestoneId)
    .eq('status', 'escrowed')
    .single();

  if (!payment) {
    return NextResponse.json({ error: 'Escrowed payment not found' }, { status: 404 });
  }

  const payout = calculateFreelancerPayout(payment.amount, isLate);
  await updateWalletBalance(freelancerId, payout);
  await updatePaymentStatus(payment.id, 'released');

  return NextResponse.json({ success: true, payout });
}

async function handleInternalTransfer({ fromUserId, toSpaceId, amount }: any) {
  if (!fromUserId || !toSpaceId || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error, recipient } = await internalTransfer(fromUserId, toSpaceId, amount);
  if (error) throw error;

  await createPayment({
    user_id: fromUserId,
    amount,
    currency: 'USD',
    status: 'completed',
    payment_type: 'internal_transfer',
    metadata: { recipient_id: recipient.id, recipient_space_id: toSpaceId }
  });

  return NextResponse.json({ success: true, recipient: recipient.name });
}

async function handleWithdraw({ userId, amount, method, destination }: any) {
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance, currency')
    .eq('user_id', userId)
    .single();

  if (!wallet || wallet.balance < amount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  const reference = `WDL-${userId}-${Date.now()}`;
  
  // Method could be bank_account or crypto_wallet
  const payoutData = await createPayout({
    amount,
    currency: wallet.currency,
    reference,
    destination: {
      type: method === 'crypto' ? 'crypto_wallet' : 'bank_account',
      amount,
      currency: wallet.currency,
      ...(method === 'crypto' ? { crypto_wallet: destination } : { bank_account: destination })
    }
  });

  await updateWalletBalance(userId, -amount);
  
  await createPayment({
    user_id: userId,
    amount,
    currency: wallet.currency,
    status: 'processing',
    reference,
    payment_type: 'withdrawal',
    metadata: { method, destination }
  });

  return NextResponse.json({ success: true, payout_id: payoutData.id });
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  return NextResponse.json({ wallet });
}
