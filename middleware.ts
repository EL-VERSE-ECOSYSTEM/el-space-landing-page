import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = await createClient(request)

  if (!supabase) {
    return supabaseResponse
  }

  // Get the session to check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/freelancer/dashboard', '/client/dashboard', '/jobs/post', '/earnings', '/wallet', '/settings', '/messages'];
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Auth routes that should redirect if already logged in
  const authPaths = ['/auth/login', '/auth/register'];
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // If trying to access protected route without authentication
  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If already authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthPath && user) {
    // Try to determine role from metadata if possible, otherwise default to /dashboard
    const userRole = user.user_metadata?.role || user.user_metadata?.user_type;
    if (userRole === 'freelancer') return NextResponse.redirect(new URL('/freelancer/dashboard', request.url));
    if (userRole === 'client') return NextResponse.redirect(new URL('/client/dashboard', request.url));
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
