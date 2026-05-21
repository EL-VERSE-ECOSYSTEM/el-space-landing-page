import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';
import { getUser } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

const VALID_TYPES = ['register', 'login', 'transfer', 'withdrawal'] as const;

export async function POST(request: NextRequest) {
  try {
    const { email, type, metadata, password } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid request type. Must be one of: ' + VALID_TYPES.join(', ') },
        { status: 400 }
      );
    }

    // For login type, verify password first
    if (type === 'login') {
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required for login' },
          { status: 400 }
        );
      }

      // Get user and verify password
      const { data: user, error: userError } = await getUser(email);
      
      if (userError || !user) {
        return NextResponse.json(
          { error: 'No account found with this email' },
          { status: 404 }
        );
      }

      if (!user.password_hash) {
        return NextResponse.json(
          { error: 'Account not properly configured. Please contact support.' },
          { status: 400 }
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    // Generate OTP
    const otp = generateOTP(6);
    await storeOTP(email, otp, 900, type, metadata); // 15 minutes

    // Try to send email, but don't fail if email is not configured
    let emailSent = false;
    try {
      await sendOTPEmail(email, otp, type);
      console.log(`[OTP] Sent to ${email} for ${type}`);
      emailSent = true;
    } catch (emailError) {
      console.warn('[OTP] Email sending failed, but OTP is stored:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: `OTP for ${type} sent to your email`,
        otp: otp,
        emailSent
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[OTP] Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
