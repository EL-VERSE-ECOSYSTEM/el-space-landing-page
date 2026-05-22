import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, user_type, otp } = await request.json();

    if (!email || !password || !full_name || !user_type || !otp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. OTP Verification Removed (Bypassed)

    // 2. Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 3. Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // 4. Generate EL Space ID
    const el_space_id = `EL-${Math.floor(10000000 + Math.random() * 90000000)}`;

    // 5. Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash,
        full_name,
        user_type,
        el_space_id,
        role: 'user',
        status: 'active',
        created_at: new Date()
      }])
      .select()
      .single();

    if (userError) throw userError;

    // 6. Create profile based on user type
    if (user_type === 'freelancer') {
      await supabase.from('freelancer_profiles').insert([{ user_id: user.id, created_at: new Date() }]);
    } else {
      // For client, entrepreneur, business, enterprise
      await supabase.from('client_profiles').insert([{
        user_id: user.id,
        verification_status: 'unverified',
        created_at: new Date()
      }]);
    }

    // 7. Initialize wallet
    await supabase.from('wallets').insert([{ user_id: user.id, balance: 0, currency: 'USD', created_at: new Date() }]);

    return NextResponse.json({
      success: true,
      token: 'temp-session-token', // Bypassed OTP token
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        el_space_id: user.el_space_id
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
