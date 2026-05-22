import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const { data: disputes, error } = await supabase
      .from('disputes')
      .select('*, projects(title)')
      .or(`initiated_by.eq.${userId},initiated_against.eq.${userId}`);

    if (error) throw error;

    return NextResponse.json({ success: true, disputes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action, disputeId, evidence, userId, reason, description, projectId, againstId } = data;

    if (action === 'create') {
      const { data: dispute, error } = await supabase
        .from('disputes')
        .insert([{
          project_id: projectId,
          initiated_by: userId,
          initiated_against: againstId,
          reason,
          description,
          status: 'open'
        }])
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, dispute });
    }

    if (action === 'addEvidence') {
      const { error } = await supabase
        .from('dispute_evidence')
        .insert([{
          dispute_id: disputeId,
          user_id: userId,
          evidence
        }]);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'escalate') {
      const { error } = await supabase
        .from('disputes')
        .update({ status: 'escalated', escalation_reason: reason })
        .eq('id', disputeId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
