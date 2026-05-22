import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPosts, likePost, addComment } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const { data, error } = await getPosts(limit);
    if (error) throw error;
    return NextResponse.json({ success: true, posts: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...payload } = body;

    switch (action) {
      case 'create':
        const { data, error } = await createPost(payload);
        if (error) throw error;
        return NextResponse.json({ success: true, post: data });

      case 'like':
        const likeResult = await likePost(payload.postId, payload.userId);
        return NextResponse.json({ success: true, ...likeResult });

      case 'comment':
        const commentResult = await addComment(payload.postId, payload.userId, payload.content);
        if (commentResult.error) throw commentResult.error;
        return NextResponse.json({ success: true, comment: commentResult.data });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
