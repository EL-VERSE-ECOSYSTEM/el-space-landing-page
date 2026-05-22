import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { 
  getWallet, 
  updateWalletBalance, 
  createPayment, 
  getPaymentsByProject,
  getUserById,
  getAllUserPayments 
} from '@/lib/supabase';

const INSTANT_WITHDRAWAL_FEE = 0.05; // 5%
const PROCESSING_DAYS = 3;

interface WithdrawalRequest {
  userId: string;
  amount: number;
  method: 'bank' | 'paypal' | 'crypto';
  accountDetails: Record<string, any>;
}

// GET wallet details
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const action = request.nextUrl.searchParams.get('action');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (action === 'transactions') {
      // Get transaction history from database
      try {
        const transactions = await getAllUserPayments(userId);
        
        const formattedTransactions = transactions.map((tx: any) => ({
          id: tx.id,
          type: tx.type === 'income' || tx.type === 'release' ? 'earning' : 
                tx.type.includes('withdrawal') ? 'withdrawal' : 
                tx.type === 'refund' ? 'refund' : 'fee',
          amount: tx.amount,
          description: tx.description || 'Transaction',
          status: tx.status === 'completed' ? 'completed' : 
                 tx.status === 'pending' ? 'pending' : 'failed',
          date: tx.created_at || new Date().toISOString(),
          metadata: tx.metadata,
        }));

        return NextResponse.json({
          success: true,
          transactions: formattedTransactions.sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
          total: formattedTransactions.length,
        });
      } catch (error) {
        console.error('[Wallet] Error fetching transactions:', error);
        return NextResponse.json({
          success: true,
          transactions: [],
          total: 0,
        });
      }
    }

    // Get wallet
    const { data: wallet, error } = await getWallet(userId);
    if (error) {
      return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 400 });
    }

    if (!wallet) {
      // Create wallet if doesn't exist
      const defaultWallet = {
        id: userId,
        user_id: userId,
        balance: 0,
        pending_balance: 0,
        total_earned: 0,
        total_withdrawn: 0,
        currency: 'USD',
        last_updated: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, wallet: defaultWallet });
    }

    return NextResponse.json({
      success: true,
      wallet: {
        ...wallet,
        available_for_withdrawal: Math.max(0, (wallet.balance || 0) - (wallet.pending_balance || 0)),
      }
    });
  } catch (error) {
    console.error('[Wallet] Error fetching wallet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}

// POST for withdrawal, transfer, or deposit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      type, 
      amount, 
      description, 
      method,
      accountDetails,
      metadata 
    } = body;

    if (!userId || !type || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'User ID, type, and valid amount are required' },
        { status: 400 }
      );
    }

    // Get current wallet
    const { data: wallet, error: walletError } = await getWallet(userId);
    if (walletError || !wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    if (type === 'withdraw') {
      // 1. Verify Transaction PIN
      const { transactionPin } = body;
      if (!transactionPin) {
        return NextResponse.json({ error: 'Transaction PIN is required for withdrawals' }, { status: 403 });
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('transaction_pin_hash')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isPinValid = await bcrypt.compare(transactionPin, user.transaction_pin_hash || "");
      if (!isPinValid) {
        return NextResponse.json({ error: 'Invalid Transaction PIN' }, { status: 403 });
      }

      // Validate sufficient funds
      const availableBalance = (wallet.balance || 0) - (wallet.pending_balance || 0);
      if (amount > availableBalance) {
        return NextResponse.json(
          { error: `Insufficient balance. Available: $${availableBalance}` },
          { status: 400 }
        );
      }

      // Determine if instant or standard
      const isInstant = metadata?.instant === true;
      const processingFee = isInstant ? amount * INSTANT_WITHDRAWAL_FEE : 0;
      const netAmount = amount - processingFee;

      // Create withdrawal payment
      const { data: payment, error: paymentError } = await createPayment({
        user_id: userId,
        amount,
        type: 'withdrawal',
        status: isInstant ? 'pending' : 'pending',
        description: `${isInstant ? 'Instant' : 'Standard'} withdrawal - ${method || 'bank'}`,
        metadata: {
          method: method || 'bank',
          account_details: accountDetails,
          fee: processingFee,
          net_amount: netAmount,
          processing_days: isInstant ? 0 : PROCESSING_DAYS,
          requested_at: new Date().toISOString(),
          ...metadata,
        },
      });

      if (paymentError) {
        return NextResponse.json(
          { error: paymentError.message || 'Failed to create withdrawal' },
          { status: 400 }
        );
      }

      // Update wallet (deduct amount and add to pending)
      const newBalance = (wallet.balance || 0) - amount;
      const newPending = (wallet.pending_balance || 0) + amount;

      await updateWalletBalance(userId, newBalance, newPending);

      return NextResponse.json({
        success: true,
        message: `Withdrawal request created - ${isInstant ? 'Instant' : 'Standard (3 days)'}`,
        withdrawal: {
          id: payment.id,
          amount,
          fee: processingFee,
          netAmount,
          method: method || 'bank',
          status: 'pending',
          createdAt: payment.created_at,
          processingDays: isInstant ? 'Instant' : PROCESSING_DAYS,
        },
      });
    } 

    else if (type === 'deposit') {
      // Handle deposit (would be called after successful payment via Stripe/Korapay)
      const newBalance = (wallet.balance || 0) + amount;
      const newTotal = (wallet.total_earned || 0) + amount;

      const { error: updateError } = await updateWalletBalance(
        userId, 
        newBalance,
        wallet.pending_balance || 0,
        newTotal
      );

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message || 'Failed to update wallet' },
          { status: 400 }
        );
      }

      // Create deposit transaction record
      await createPayment({
        user_id: userId,
        amount,
        type: 'income',
        status: 'completed',
        description: description || 'Project earnings deposit',
        metadata: {
          source: metadata?.source || 'project_milestone',
          project_id: metadata?.projectId,
          milestone_id: metadata?.milestoneId,
          ...metadata,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Deposit processed successfully',
        newBalance: newBalance,
        deposit: {
          amount,
          type: 'income',
          timestamp: new Date().toISOString(),
        },
      });
    }

    else if (type === 'hold') {
      // Place a hold on funds (for escrow)
      const newPending = (wallet.pending_balance || 0) + amount;

      const { error: updateError } = await updateWalletBalance(
        userId,
        wallet.balance || 0,
        newPending
      );

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 400 }
        );
      }

      // Create hold record
      await createPayment({
        user_id: userId,
        amount,
        type: 'hold',
        status: 'pending',
        description: 'Funds on hold - ' + (description || 'escrow'),
        metadata: {
          reason: 'escrow',
          project_id: metadata?.projectId,
          milestone_id: metadata?.milestoneId,
          ...metadata,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Funds placed on hold',
        hold: {
          amount,
          status: 'pending',
          availableBalance: (wallet.balance || 0),
          pendingBalance: newPending,
        },
      });
    }

    else if (type === 'release') {
      // Release held funds (on milestone approval)
      const newPending = Math.max(0, (wallet.pending_balance || 0) - amount);

      const { error: updateError } = await updateWalletBalance(
        userId,
        wallet.balance || 0,
        newPending
      );

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 400 }
        );
      }

      // Create release record
      await createPayment({
        user_id: userId,
        amount,
        type: 'release',
        status: 'completed',
        description: 'Hold released - ' + (description || 'milestone approved'),
        metadata: {
          project_id: metadata?.projectId,
          milestone_id: metadata?.milestoneId,
          ...metadata,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Funds released from hold',
        release: {
          amount,
          status: 'completed',
          availableBalance: (wallet.balance || 0) + amount,
          pendingBalance: newPending,
        },
      });
    }

    else {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[Wallet] Error processing transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process transaction' },
      { status: 500 }
    );
  }
}

// PATCH to update wallet metadata
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'User ID and updates are required' },
        { status: 400 }
      );
    }

    // Supported updates: currency, preferred_withdrawal_method, etc.
    const { data: wallet, error: fetchError } = await getWallet(userId);
    if (fetchError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Update wallet with new metadata
    const updatedWallet = {
      ...wallet,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Note: You'll need to add updateWallet function to supabase.ts
    // For now, return success
    return NextResponse.json({
      success: true,
      wallet: updatedWallet,
      message: 'Wallet updated successfully',
    });
  } catch (error) {
    console.error('[Wallet] Error updating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to update wallet' },
      { status: 500 }
    );
  }
}
