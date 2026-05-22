import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, todos: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name } = await request.json();
    if (!userId || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const { data, error } = await supabase
      .from('todos')
      .insert([{ user_id: userId, name, is_completed: false }])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, todo: data[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { todoId, isCompleted } = await request.json();
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: isCompleted })
      .eq('id', todoId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
