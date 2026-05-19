import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: withdrawals, error } = await supabase
      .from('payments')
      .select(`
        *,
        user:users!user_id(name, email, el_space_id)
      `)
      .eq('payment_type', 'withdrawal')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, withdrawals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { withdrawalId, status, rejectionReason } = await request.json();

    if (!withdrawalId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('payments')
      .update({
        status,
        metadata: { rejectionReason },
        updated_at: new Date()
      })
      .eq('id', withdrawalId)
      .select()
      .single();

    if (error) throw error;

    // If approved, we might need to deduct from wallet if not already done during request
    // Usually it's deducted (locked) during request, and either confirmed or returned on reject.

    return NextResponse.json({ success: true, withdrawal: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
