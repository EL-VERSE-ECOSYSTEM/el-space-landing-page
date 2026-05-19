import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'el-space-secret-key';
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUserInfo {
  id: string;
  login: string;
  email: string | null;
  name: string | null;
  avatar_url?: string;
  bio?: string;
  company?: string;
  location?: string;
  blog?: string;
}

/**
 * GET /api/auth/github/callback - Handle GitHub OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.redirect(`${REDIRECT_URI}/auth/login?error=no_code`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${REDIRECT_URI}/api/auth/github/callback`,
      }),
    });

    const tokenData: GitHubTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${REDIRECT_URI}/auth/login?error=token_exchange_failed`);
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userInfo: GitHubUserInfo = await userResponse.json();

    // Get primary email if not set
    let email = userInfo.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      const emails: any[] = await emailResponse.json();
      const primaryEmail = emails.find(e => e.primary) || emails[0];
      email = primaryEmail?.email || userInfo.login + '@github.com';
    }

    // Check if user exists in database
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    let user = existingUser;

    if (!existingUser) {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email,
            name: userInfo.name || userInfo.login,
            profile_picture: userInfo.avatar_url,
            oauth_provider: 'github',
            oauth_id: userInfo.id.toString(),
            user_type: 'freelancer', // Default to freelancer
            verified: true, // GitHub verified emails
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return NextResponse.redirect(`${REDIRECT_URI}/auth/login?error=user_creation_failed`);
      }

      user = newUser;
    } else {
      // Update existing user with GitHub OAuth info if not already set
      if (!existingUser.oauth_provider) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            oauth_provider: 'github',
            oauth_id: userInfo.id.toString(),
            profile_picture: userInfo.profile_picture || userInfo.avatar_url,
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Error updating user:', updateError);
        }
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Redirect with token
    const redirectUrl = new URL(`${REDIRECT_URI}/auth/github-success`);
    redirectUrl.searchParams.append('token', token);
    redirectUrl.searchParams.append('user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      user_type: user.user_type,
      profile_picture: user.profile_picture,
    }));

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.redirect(`${REDIRECT_URI}/auth/login?error=oauth_error`);
  }
}
