import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get basic user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get specific profile data
    let profileData = null;
    if (user.user_type === 'freelancer') {
      const { data } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      profileData = data;
    } else {
      const { data } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      profileData = data;
    }

    return NextResponse.json({
      success: true,
      profile: {
        user,
        details: profileData
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
