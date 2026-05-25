import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // 1. Get user (Support both email and el_space_id)
    const identifier = email; // Front-end might send either email or ID in the email field
    let query = supabase.from('users').select('*');

    if (identifier.includes('@')) {
      query = query.eq('email', identifier);
    } else {
      query = query.eq('el_space_id', identifier.toUpperCase());
    }

    const { data: user, error: userError } = await query.single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 2. Verify password
    if (!user.password_hash) {
      return NextResponse.json({ error: 'Account not set up for password login' }, { status: 401 });
    }
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // 4. Return user on successful password verification
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        el_space_id: user.el_space_id,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
