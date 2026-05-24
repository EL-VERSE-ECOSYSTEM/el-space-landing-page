import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/otp';
// import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const otp = generateOTP();
    const { error } = await storeOTP(email, otp, 900, type || 'login');

    if (error) throw error;

    // In dev mode, we just return the OTP for convenience
    // In production, we'd call sendOTPEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
