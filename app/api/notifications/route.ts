import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

interface Notification {
  user_id: string;
  type: string;
  channel: 'email' | 'in-app' | 'both';
  title: string;
  message: string;
  html?: string;
  subject?: string;
  action_url?: string;
  data?: Record<string, any>;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const status = request.nextUrl.searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: notifications, error } = await query.limit(50);

    if (error) {
      return NextResponse.json(
        { error: (error instanceof Error ? error.message : "Unknown error") },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      unread: (notifications as any[])?.filter((n: any) => n.status === 'unread').length || 0
    });
  } catch (error) {
    console.error('[Notifications] Error fetching:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Notification;
    const { user_id, type, channel = 'both', title, message, html, subject, action_url, data } = body;

    if (!user_id || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, type, title, message' },
        { status: 400 }
      );
    }

    // Get user email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let emailSent = false;
    let inAppCreated = false;

    // Send email if channel includes email
    if (channel === 'email' || channel === 'both') {
      try {
        await sendEmail({
          to: user.email,
          subject: subject || title,
          html: html || `<p>${message}</p>`,
          text: message,
        });
        emailSent = true;
        console.log(`[Notifications] Email sent to ${user.email}`);
      } catch (emailError) {
        console.warn('[Notifications] Email send failed:', emailError);
      }
    }

    // Create in-app notification if channel includes in-app
    if (channel === 'in-app' || channel === 'both') {
      const { error: createError } = await supabase
        .from('notifications')
        .insert([{
          user_id,
          type,
          title,
          message,
          action_url: action_url || null,
          data: data || {},
          status: 'unread',
          created_at: new Date().toISOString(),
        }]);

      if (!createError) {
        inAppCreated = true;
        console.log(`[Notifications] In-app notification created for user ${user_id}`);
      } else {
        console.warn('[Notifications] In-app creation failed:', createError);
      }
    }

    return NextResponse.json({
      success: emailSent || inAppCreated,
      message: 'Notification sent',
      emailSent,
      inAppCreated
    });
  } catch (error) {
    console.error('[Notifications] Error sending:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, status } = body;

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('notifications')
      .update({ status: status || 'read' })
      .eq('id', notificationId);

    if (error) {
      return NextResponse.json(
        { error: (error instanceof Error ? error.message : "Unknown error") },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification updated'
    });
  } catch (error) {
    console.error('[Notifications] Error updating:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
