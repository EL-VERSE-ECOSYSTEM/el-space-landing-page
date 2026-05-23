import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProjectsByClient, getOpenProjects, getUserById } from '@/lib/supabase';
import { sendClientWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { clientId, title, description, category, budget, skills, timeline, visibility } = await request.json();

    if (!clientId || !title || !description || !budget) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const projectData = {
      client_id: clientId,
      title,
      description,
      category: category || 'Development',
      budget_min: budget.min || budget,
      budget_max: budget.max || budget,
      required_skills: skills || [],
      timeline: timeline || 'Not specified',
      total_budget: budget.max || budget,
      visibility: visibility || 'public',
    };

    const { data, error } = await createProject(projectData);
    if (error) throw error;

    // Send confirmation email to client
    const { data: client } = await getUserById(clientId);
    if (client) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elspace.tech';
        await sendClientWelcomeEmail(client.email, {
            clientName: client.name,
            jobTitle: title,
            dashboardUrl: `${appUrl}/dashboard`,
            slackInviteUrl: 'https://slack.com/invite/elspace',
        });
    }

    return NextResponse.json({ success: true, project: data }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientId = request.nextUrl.searchParams.get('clientId');

    if (clientId) {
      const { data, error } = await getProjectsByClient(clientId);
      if (error) throw error;
      return NextResponse.json({ projects: data });
    }

    const { data, error } = await getOpenProjects();
    if (error) throw error;
    return NextResponse.json({ projects: data });
  } catch (error: unknown) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
  }
}
