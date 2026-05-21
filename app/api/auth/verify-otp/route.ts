import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';
import { getUser } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'el-space-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, type = 'auth', password } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = await verifyOTP(email, otp);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    // Get user info
    const { data: user, error: userError } = await getUser(email);

    // For login type - user must exist
    if (type === 'login' || type === 'auth') {
      if (userError || !user) {
        return NextResponse.json(
          { error: 'No account found with this email. Please register first.' },
          { status: 404 }
        );
      }

      // Verify password if provided and user has password hash
      if (password && user.password_hash) {
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
          return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
          );
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create JWT token
    const payload = {
      email,
      userId: user.id,
      userType: user.user_type,
      elSpaceId: user.el_space_id,
      type: result.type || type,
      verified: true,
      timestamp: Date.now()
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json(
      {
        success: true,
        message: result.message,
        token,
        user,
        type: result.type || type
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('el-space-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
