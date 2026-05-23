import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const { userId, updates } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // List of allowed fields to update
    // Restricted: full_name, business_name
    const allowedUserFields = ['email', 'phone_number', 'bio', 'location', 'avatar_url'];
    const allowedFreelancerFields = ['hourly_rate', 'years_experience', 'portfolio_url', 'github_url', 'linkedin_url', 'skills', 'bio', 'timezone', 'languages'];
    const allowedClientFields = ['business_type', 'business_sector', 'business_phone', 'business_email', 'company_url', 'company_size', 'budget_limit'];

    const userUpdates: any = {};
    const profileUpdates: any = {};

    Object.keys(updates).forEach(key => {
      if (allowedUserFields.includes(key)) {
        userUpdates[key] = updates[key];
      } else if (allowedFreelancerFields.includes(key)) {
        profileUpdates[key] = updates[key];
      } else if (allowedClientFields.includes(key)) {
        profileUpdates[key] = updates[key];
      }
    });

    if (Object.keys(userUpdates).length > 0) {
      const { error: userError } = await supabase
        .from('users')
        .update(userUpdates)
        .eq('id', userId);

      if (userError) throw userError;
    }

    if (Object.keys(profileUpdates).length > 0) {
      // Find which profile to update
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single();

      const profileTable = userData?.user_type === 'freelancer' ? 'freelancer_profiles' : 'client_profiles';

      const { error: profileError } = await supabase
        .from(profileTable)
        .update(profileUpdates)
        .eq('user_id', userId);

      if (profileError) throw profileError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
