import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/google/callback - Handle Google OAuth callback
 * This endpoint receives the authorization code from Google
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      const errorDescription = searchParams.get('error_description') || 'Authorization failed';
      console.error('[Google OAuth] Error:', error, errorDescription);
      
      // Redirect back to login with error
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(errorDescription)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/auth/login?error=No authorization code received', request.url)
      );
    }

    if (!state) {
      return NextResponse.redirect(
        new URL('/auth/login?error=Invalid state parameter', request.url)
      );
    }

    // Call our Google auth API to exchange code for tokens
    const authUrl = new URL('/api/auth/google', request.nextUrl.origin);
    
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Google OAuth] Auth failed:', data.error);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(data.error || 'Authentication failed')}`, request.url)
      );
    }

    // Store token and redirect to dashboard
    const redirectUrl = new URL('/client/dashboard', request.nextUrl.origin);
    redirectUrl.searchParams.append('token', data.token);

    const res = NextResponse.redirect(redirectUrl);

    // Set the auth cookie
    res.cookies.set('el-space-auth', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('[Google OAuth Callback] Error:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=Callback processing failed', request.url)
    );
  }
}
