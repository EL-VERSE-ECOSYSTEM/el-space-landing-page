import { NextRequest, NextResponse } from 'next/server';
import { getUser, getUserBySpaceId } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Handle both email and el_space_id
    let user = null;
    let error = null;

    if (email.includes('@')) {
      const result = await getUser(email);
      user = result.data;
      error = result.error;
    } else {
      const result = await getUserBySpaceId(email.toUpperCase());
      user = result.data;
      error = result.error;
    }

    if (error || !user) {
      return NextResponse.json(
        { exists: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        exists: true, 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type,
          el_space_id: user.el_space_id,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in check-user:', error);
    return NextResponse.json(
      { error: 'Failed to check user' },
      { status: 500 }
    );
  }
}
