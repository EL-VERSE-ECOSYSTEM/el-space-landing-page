import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: verifications, error } = await supabase
      .from('users')
      .select('*, client_profiles(*), freelancer_profiles(*)')
      .eq('is_verified', false)
      .not('id_type', 'is', null);

    if (error) throw error;

    return NextResponse.json({ success: true, verifications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, status } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ error: 'Missing userId or status' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .update({ is_verified: status === 'verified' })
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
