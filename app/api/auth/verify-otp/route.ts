import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { email, code, type } = await request.json();
    if (!email || !code) return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });

    const { success, error } = await verifyOTP(email, code, type || 'login');

    if (!success) {
      return NextResponse.json({ error: error || 'Invalid or expired OTP' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
