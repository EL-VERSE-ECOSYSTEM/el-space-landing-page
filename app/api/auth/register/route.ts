import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      email, password, full_name, user_type, phoneNumber,
      transaction_pin, id_type, id_serial, id_url
    } = data;

    if (!email || !password || !full_name || !user_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 3. Hash password and PIN
    const password_hash = await bcrypt.hash(password, 12);
    let transaction_pin_hash = null;
    if (transaction_pin) {
      transaction_pin_hash = await bcrypt.hash(transaction_pin, 10);
    }

    // 4. Generate EL Space ID (Format: 3 letters + 7 numbers, e.g., ELS1234567)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    const randomNumbers = Math.floor(1000000 + Math.random() * 9000000).toString();
    const el_space_id = `${randomLetters}${randomNumbers}`;

    // 5. Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash,
        transaction_pin_hash,
        full_name,
        user_type,
        el_space_id,
        phone_number: phoneNumber,
        id_type,
        id_serial,
        id_url,
        role: 'user',
        status: 'active',
        created_at: new Date()
      }])
      .select()
      .single();

    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
    }

    // 6. Create profile based on user type
    if (user_type === 'freelancer') {
      await supabase.from('freelancer_profiles').insert([{
        user_id: user.id,
        skills: data.tech_stack || [],
        bio: data.about_you,
        github_url: data.github_url,
        project_links: data.project_links || [],
        created_at: new Date()
      }]);
    } else {
      // For client, entrepreneur, business, enterprise
      await supabase.from('client_profiles').insert([{
        user_id: user.id,
        business_name: data.business_name,
        business_type: data.business_type,
        business_sector: data.business_sector,
        business_phone: data.business_phone,
        business_email: data.business_email,
        business_reg_url: data.business_reg_url,
        company_url: data.business_website,
        company_size: data.company_size,
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
