import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: transfers, error } = await supabase
      .from('internal_transfers')
      .select(`
        *,
        sender:users!sender_id(full_name, email, el_space_id),
        recipient:users!recipient_id(full_name, email, el_space_id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, transfers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { transferId, status, adminNotes } = await request.json();

    if (!transferId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Get transfer record
    const { data: transfer, error: transferError } = await supabase
      .from('internal_transfers')
      .select('*')
      .eq('id', transferId)
      .single() as any;

    if (transferError || !transfer) throw new Error('Transfer record not found');

    if (transfer.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Transfer already processed' }, { status: 400 });
    }

    // 2. Process based on status (Using secure RPCs)
    let updatedTransfer = null;

    if (status === 'completed' || status === 'approved') {
      const { error: rpcError } = await supabase.rpc('approve_internal_transfer', {
        p_transfer_id: transferId,
        p_admin_id: '00000000-0000-0000-0000-000000000000' // Mock Admin ID or fetch from session
      });

      if (rpcError) throw rpcError;

      // Log to payments ledger
      await supabase.from('payments').insert([
        {
          user_id: transfer.sender_id,
          amount: -transfer.amount,
          payment_type: 'internal_transfer',
          status: 'completed',
          description: `Internal transfer approved`,
          metadata: { transfer_id: transferId, recipient_id: transfer.recipient_id }
        },
        {
          user_id: transfer.recipient_id,
          amount: transfer.amount,
          payment_type: 'internal_transfer',
          status: 'completed',
          description: `Internal transfer received`,
          metadata: { transfer_id: transferId, sender_id: transfer.sender_id }
        }
      ]);
    } else if (status === 'rejected') {
      const { error: rpcError } = await supabase.rpc('reject_internal_transfer', {
        p_transfer_id: transferId,
        p_admin_id: '00000000-0000-0000-0000-000000000000',
        p_notes: adminNotes
      });

      if (rpcError) throw rpcError;
    }

    // Fetch updated record
    const { data } = await supabase.from('internal_transfers').select('*').eq('id', transferId).single();
    updatedTransfer = data;

    return NextResponse.json({ success: true, transfer: updatedTransfer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
