import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const userId = request.nextUrl.searchParams.get('userId');

    let query = supabase
      .from('social_posts')
      .select(`
        *,
        user:users!user_id(full_name, avatar_url, el_space_id),
        original_post:social_posts!original_post_id(
          *,
          user:users!user_id(full_name, avatar_url, el_space_id)
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json({ success: true, posts: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { action, userId, content, mediaUrls, mediaType, postId, originalPostId } = await request.json();

    const { data: { user: sessionUser } } = await supabase.auth.getUser();

    if (action === 'create') {
      if (!sessionUser || sessionUser.id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data, error } = await supabase
        .from('social_posts')
        .insert([{
          user_id: userId,
          content,
          media_urls: mediaUrls || [],
          media_type: mediaType || 'none',
          original_post_id: originalPostId || null
        }])
        .select()
        .single();

      if (error) throw error;
      if (originalPostId) {
        await supabase.rpc('increment_reposts', { p_post_id: originalPostId });
      }
      return NextResponse.json({ success: true, post: data });
    }

    if (action === 'like') {
      if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      const { data: existing } = await supabase
        .from('social_likes')
        .select()
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase.from('social_likes').delete().eq('post_id', postId).eq('user_id', userId);
        await supabase.rpc('decrement_likes', { p_post_id: postId });
        return NextResponse.json({ success: true, liked: false });
      } else {
        await supabase.from('social_likes').insert([{ post_id: postId, user_id: userId }]);
        await supabase.rpc('increment_likes', { p_post_id: postId });
        return NextResponse.json({ success: true, liked: true });
      }
    }

    if (action === 'share') {
      await supabase.rpc('increment_shares', { p_post_id: postId });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
