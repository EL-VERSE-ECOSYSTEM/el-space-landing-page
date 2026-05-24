import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (conversationId) {
      // Get messages for a specific conversation (chat room)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return NextResponse.json({ success: true, messages: data });
    } else {
      // Get all conversations for a user
      // This is a simplified mock-like response for the dashboard
      const { data, error } = await supabase
        .from('chat_participants')
        .select(`
          room_id,
          chat_rooms(
            id,
            project_id,
            projects(title)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const conversations = data.map((c: any) => ({
        id: c.room_id,
        name: c.chat_rooms?.projects?.title || 'Direct Chat',
        lastMessage: 'Operation details pending...',
        timestamp: 'Just now',
        unread: false,
        online: true
      }));

      return NextResponse.json({ success: true, conversations });
    }
  } catch (error: any) {
    console.error('Messaging API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
