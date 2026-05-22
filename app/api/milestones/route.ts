import { NextRequest, NextResponse } from 'next/server';
import { 
  createMilestone, 
  getMilestonesByProject, 
  updateMilestoneStatus, 
  getProject, 
  getUserById, 
  updateWalletBalance, 
  createPayment 
} from '@/lib/supabase';
import { sendPaymentReceivedEmail, sendProjectCompletionEmail } from '@/lib/email';
import { calculateFreelancerPayout, LATE_SUBMISSION_PENALTY } from '@/lib/fees';

export async function POST(request: NextRequest) {
  try {
    const { projectId, title, description, amount, dueDate } = await request.json();

    if (!projectId || !title || !amount || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const milestoneData = {
      project_id: projectId,
      title,
      description: description || '',
      amount,
      due_date: dueDate,
      status: 'pending' as const,
    };

    const { data, error } = await createMilestone(milestoneData);

    if (error) throw error;

    return NextResponse.json({ success: true, milestone: data }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating milestone:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId required' }, { status: 400 });
    }

    const { data, error } = await getMilestonesByProject(projectId);

    if (error) throw error;

    return NextResponse.json({ milestones: data });
  } catch (error: unknown) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { milestoneId, status, isLate } = await request.json();

    if (!milestoneId || !status) {
      return NextResponse.json({ error: 'milestoneId and status required' }, { status: 400 });
    }

    const { data: milestone, error } = await updateMilestoneStatus(milestoneId, status);
    if (error) throw error;

    if (status === 'approved') {
        // 1. Release payment from escrow to freelancer
        const { data: project } = await getProject(milestone.project_id);
        const { data: freelancer } = await getUserById(milestone.freelancer_id);
        const { data: client } = await getUserById(project.client_id);

        // Auto-detect lateness: strictly check against due_date
        let lateFlag = isLate;
        if (lateFlag === undefined && milestone.due_date) {
            // Milestone is late if it was submitted after due date, or if it's being approved now and was never "submitted" officially but is past due
            const submittedDate = milestone.submitted_at ? new Date(milestone.submitted_at) : new Date();
            lateFlag = submittedDate > new Date(milestone.due_date);
        }

        const payout = calculateFreelancerPayout(milestone.amount, lateFlag);
        const penaltyAmount = lateFlag ? LATE_SUBMISSION_PENALTY : 0;
        
        // 2. Update freelancer wallet
        // Need to handle balance update carefully - typically adding to existing
        const { data: currentWallet } = await getWallet(milestone.freelancer_id);
        const newBalance = (currentWallet?.balance || 0) + payout;
        const newTotalEarned = (currentWallet?.total_earned || 0) + payout;

        await updateWalletBalance(milestone.freelancer_id, newBalance, currentWallet?.pending_balance || 0, newTotalEarned);

        // 3. Create payment record
        await createPayment({
            user_id: milestone.freelancer_id,
            project_id: milestone.project_id,
            milestone_id: milestone.id,
            amount: payout,
            fee_amount: milestone.amount - payout - penaltyAmount,
            currency: 'USD',
            status: 'completed',
            payment_type: 'payout',
            metadata: {
              is_late: lateFlag,
              late_penalty: penaltyAmount,
              original_amount: milestone.amount,
              base_payout: milestone.amount - (milestone.amount - payout - penaltyAmount)
            }
        });

        // 4. Send emails
        if (freelancer && client) {
            await sendPaymentReceivedEmail(freelancer.email, {
                freelancerName: freelancer.name,
                clientName: client.name,
                milestoneNumber: 1, 
                projectTitle: project.title,
                milestoneDescription: milestone.description,
                milestoneAmount: milestone.amount,
                feePercentage: '5%',
                platformFee: milestone.amount - payout,
                yourEarnings: payout,
                walletBalance: 0, 
                instantFeeAmount: payout * 0.05,
                instantWithdrawUrl: '#',
                standardWithdrawUrl: '#',
                m1Amount: milestone.amount,
                m2Amount: 0,
                m3Amount: 0,
                totalProjectValue: project.total_budget || 0,
                earnedSoFar: payout,
                remainingValue: (project.total_budget || 0) - milestone.amount,
                dashboardUrl: '#',
                clientFeedbackSnippet: 'Great work!',
                monthToDateEarnings: payout,
                monthlyCompletedProjects: 1,
                averageProjectValue: project.total_budget || 0,
                earningsUrl: '#',
            });

            await sendProjectCompletionEmail(client.email, 'client', {
                clientName: client.name,
                projectTitle: project.title,
                freelancerName: freelancer.name,
                totalProjectValue: project.total_budget || 0,
                projectDuration: 7,
                completedMilestones: 1,
                totalMilestones: 1,
                commitCount: 10,
                standupCount: 5,
                fileCount: 3,
                reviewUrl: '#',
                postJobUrl: '#',
                rehireUrl: '#',
                directHireUrl: '#',
                archiveUrl: '#',
            });

            await sendProjectCompletionEmail(freelancer.email, 'freelancer', {
                freelancerName: freelancer.name,
                projectTitle: project.title,
                clientName: client.name,
                totalEarned: payout,
                projectDuration: 7,
                completedMilestones: 1,
                totalMilestones: 1,
                reviewUrl: '#',
                availabilityUrl: '#',
                portfolioUrl: '#',
                matchesUrl: '#',
                elitesUrl: '#',
                totalCompletedProjects: 1,
                averageRating: 5,
                lifetimeEarned: payout,
                matchScore: 95,
                profileUrl: '#',
                projectsNeeded: 4,
            });
        }
    }

    return NextResponse.json({ success: true, milestone });
  } catch (error: unknown) {
    console.error('Error updating milestone:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
  }
}
