import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'el-space-secret-key';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

/**
 * GET /api/auth/google - Generate Google OAuth URL
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'url') {
    const state = Math.random().toString(36).substring(7);
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    googleAuthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID || '');
    googleAuthUrl.searchParams.append('redirect_uri', `${REDIRECT_URI}/api/auth/google/callback`);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('state', state);
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');

    return NextResponse.json(
      { url: googleAuthUrl.toString(), state },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { error: 'Action not specified' },
    { status: 400 }
  );
}

/**
 * POST /api/auth/google - Handle Google OAuth callback
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${REDIRECT_URI}/api/auth/google/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

    // Get user info from ID token or from Google API
    let userInfo: GoogleUserInfo;
    
    try {
      // First try to decode the ID token (it's a JWT)
      const decoded = jwt.decode(tokenData.id_token) as any;
      userInfo = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        email_verified: decoded.email_verified || false,
      };
    } catch (error) {
      // Fallback: fetch from Google API
      const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
      const userDataResponse = await fetch(userInfoUrl, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      
      if (!userDataResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userDataResponse.statusText}`);
      }
      
      userInfo = await userDataResponse.json();
    }

    // Check if user exists in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', userInfo.email)
      .single();

    let user = existingUser;

    // If user doesn't exist, create one
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            email: userInfo.email,
            name: userInfo.name,
            profile_picture: userInfo.picture,
            email_verified: userInfo.email_verified,
            auth_provider: 'google',
            auth_provider_id: userInfo.id,
            metadata: {
              google_id: userInfo.id,
              joined_via: 'google_oauth',
            },
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error('[Google Auth] Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      user = newUser;
    } else {
      // Update existing user with Google info if needed
      await supabase
        .from('users')
        .update({
          auth_provider: 'google',
          auth_provider_id: userInfo.id,
          email_verified: userInfo.email_verified,
          profile_picture: userInfo.picture || user.profile_picture,
        })
        .eq('id', user.id);
    }

    // Create JWT token
    const payload = {
      email: user.email,
      userId: user.id,
      userType: user.user_type,
      elSpaceId: user.el_space_id,
      authProvider: 'google',
      verified: true,
      timestamp: Date.now(),
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Google authentication successful',
        token,
        user,
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
    console.error('[Google Auth] Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
