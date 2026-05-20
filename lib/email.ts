import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function replacePlaceholders(content: string, data: Record<string, any>) {
  let result = content;
  
  for (const key in data) {
    const value = data[key];
    if (typeof value === 'string' || typeof value === 'number') {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
  }
  
  return result;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@elspace.tech',
      to,
      subject,
      html: html || text,
      text: text || html,
    });
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    throw error;
  }
}

// Welcome Emails
export async function sendClientWelcomeEmail(email: string, data: unknown) {
  const subject = 'Welcome to EL SPACE - Your Freelancer Marketplace';
  const text = `
Welcome ${data.clientName}!

You're now part of EL SPACE, where you can find and hire top freelancers.

Get Started:
- Browse Freelancers: {{dashboardUrl}}/browse
- Post Your First Job: {{dashboardUrl}}/jobs/post
- Join Our Community: {{slackInviteUrl}}

Questions? We're here to help.
Best,
The EL SPACE Team
  `.trim();
  
  return sendEmail({ to: email, subject, text: replacePlaceholders(text, data) });
}

export async function sendFreelancerWelcomeEmail(email: string, data: unknown) {
  const subject = 'Welcome to EL SPACE - Start Earning';
  const text = `
Welcome ${data.freelancerName}!

You're now part of EL SPACE, where you can find exciting projects and earn great money.

Get Started:
- View Your Profile: {{profileUrl}}
- Browse Available Projects: {{dashboardUrl}}/jobs
- Complete ELITES Training: {{elitesUrl}}

Questions? We're here to help.
Best,
The EL SPACE Team
  `.trim();
  
  return sendEmail({ to: email, subject, text: replacePlaceholders(text, data) });
}

// OTP Email with HTML template
export async function sendOTPEmail(email: string, otp: string, type: 'register' | 'login' | 'transfer' | 'withdrawal') {
  const subject = type === 'register' 
    ? 'Verify Your Email - EL SPACE'
    : 'Your OTP Code - EL SPACE';
  
  const getTitle = () => {
    switch(type) {
      case 'register': return 'Verify Your Email';
      case 'login': return 'Login Verification';
      case 'transfer': return 'Confirm Transfer';
      case 'withdrawal': return 'Confirm Withdrawal';
      default: return 'Verification Code';
    }
  };

  const getDescription = () => {
    switch(type) {
      case 'register': return 'Welcome to EL SPACE! Please verify your email to get started.';
      case 'login': return 'Someone tried to log in to your account. Use this code to proceed.';
      case 'transfer': return 'Please confirm this transfer with your verification code.';
      case 'withdrawal': return 'Please confirm this withdrawal with your verification code.';
      default: return 'Use this code to proceed with your verification.';
    }
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f9fafb;
    }
    .email-body {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 20px;
    }
    .otp-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #f3e8ff 100%);
      border: 2px solid #06b6d4;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .otp-code {
      font-size: 48px;
      font-weight: 700;
      color: #06b6d4;
      font-family: 'Courier New', monospace;
      letter-spacing: 8px;
      margin: 0;
      word-break: break-all;
    }
    .otp-expiry {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
    .info-box {
      background: #f9fafb;
      border-left: 4px solid #06b6d4;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box ul {
      margin: 0;
      padding-left: 20px;
    }
    .info-box li {
      color: #666;
      font-size: 14px;
      margin: 8px 0;
    }
    .footer {
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      color: white;
      padding: 12px 30px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    @media (max-width: 600px) {
      .container {
        padding: 10px;
      }
      .content {
        padding: 20px 15px;
      }
      .otp-code {
        font-size: 36px;
        letter-spacing: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-body">
      <div class="header">
        <h1>${getTitle()}</h1>
        <p>${getDescription()}</p>
      </div>
      
      <div class="content">
        <p>Hi there,</p>
        
        <p>Use this verification code to complete your ${type === 'register' ? 'registration' : type === 'login' ? 'login' : type === 'transfer' ? 'transfer' : 'withdrawal'}:</p>
        
        <div class="otp-box">
          <p class="otp-code">${otp.split('').join(' ')}</p>
          <p class="otp-expiry">⏰ This code expires in 15 minutes</p>
        </div>
        
        <div class="info-box">
          <ul>
            <li>✅ This code was sent to your registered email</li>
            <li>🔒 Never share this code with anyone</li>
            <li>⚠️ If you didn't request this, please ignore this email</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #666;">
          If you're having trouble, copy and paste this code into the verification field:
        </p>
        <p style="background: #f0f9ff; padding: 10px; border-radius: 4px; text-align: center; font-family: 'Courier New', monospace; font-size: 16px; color: #06b6d4; font-weight: 600;">
          ${otp}
        </p>
      </div>
      
      <div class="footer">
        <p>© 2026 EL SPACE - Freelance Without Friction</p>
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: email, subject, html });
}

// Milestone Funded Email
export async function sendMilestoneFundedEmail(to: string, type: 'client' | 'freelancer', data: unknown) {
  const subject = type === 'client'
    ? `✅ Milestone Funded – "${data.projectTitle}"`
    : `💰 Milestone Funded – Start Working on "${data.projectTitle}"`;
  
  const baseText = type === 'client'
    ? `
Hi ${data.clientName},

Your milestone payment of $${data.milestoneAmount} for "${data.projectTitle}" has been funded and is now in escrow.

Freelancer: ${data.freelancerName}
Amount: $${data.milestoneAmount}
Platform Fee: $${data.platformFee}

Next Steps:
- Monitor progress in your Project Dashboard
- Receive daily standups on Slack
- Review and approve milestones

Dashboard: {{dashboardUrl}}
    `
    : `
Hi ${data.freelancerName},

Great news! ${data.clientName} has funded Milestone 1 for "${data.projectTitle}".

Amount: $${data.milestoneAmount}
Your Earnings (after 5% fee): $${data.yourEarnings}

You're now cleared to begin work!

Next Steps:
1. Join the Slack channel
2. Post your first standup tomorrow at 9 AM
3. Begin working on the deliverables

Dashboard: {{dashboardUrl}}
    `.trim();
  
  return sendEmail({ to, subject, text: replacePlaceholders(baseText, data) });
}

// Daily Standup Reminder
export async function sendDailyStandupReminderEmail(to: string, data: unknown) {
  const subject = `⏰ Daily Standup Reminder – "${data.projectTitle}"`;
  
  const text = `
Hi {{freelancerName}},

It's time for your daily standup on {{projectTitle}}.

Please post in your Slack channel:
1. What I shipped yesterday
2. What I'm shipping today
3. Any blockers

Slack: {{slackChannelUrl}}
Dashboard: {{dashboardUrl}}
  `.trim();
  
  return sendEmail({ to, subject, text: replacePlaceholders(text, data) });
}

// Payment Received
export async function sendPaymentReceivedEmail(to: string, data: unknown) {
  const subject = `💵 Payment Received – $${data.yourEarnings} for "${data.projectTitle}"`;
  
  const text = `
Hi {{freelancerName}},

Great work! {{clientName}} has approved and released payment for {{projectTitle}}.

Amount: \${{milestoneAmount}}
Your Earnings (after 5% fee): \${{yourEarnings}}
Available in your wallet

Withdraw Options:
- Instant (5% fee): {{instantWithdrawUrl}}
- Standard (3 business days, free): {{standardWithdrawUrl}}

Keep it up!
The EL SPACE Team
  `.trim();
  
  return sendEmail({ to, subject, text: replacePlaceholders(text, data) });
}

// Project Completion
export async function sendProjectCompleteWithReviewEmail(to: string, type: 'client' | 'freelancer', data: unknown) {
  const subject = type === 'client'
    ? `🎉 Project Complete – Leave a Review`
    : `🎉 Project Complete – Leave a Review`;
  
  const baseText = type === 'client'
    ? `
Hi {{clientName}},

Congratulations! "{{projectTitle}}" is complete.

All milestones have been approved. Time to share your feedback!

Rate {{freelancerName}}: {{reviewUrl}}

Your review helps our community and recognizes great work.
    `
    : `
Hi {{freelancerName}},

Congratulations on completing "{{projectTitle}}"!

All payment has been released to your wallet.

Rate {{clientName}}: {{reviewUrl}}

Your feedback helps other freelancers find great clients.
    `.trim();
  
  return sendEmail({ to, subject, text: replacePlaceholders(baseText, data) });
}

// Alias for backwards compatibility
export async function sendProjectCompletionEmail(to: string, type: 'client' | 'freelancer', data: unknown) {
  return sendProjectCompleteWithReviewEmail(to, type, data);
}

// Post-Match Notifications
export async function sendPostMatchEmail(to: string, type: 'client' | 'freelancer', data: unknown) {
  const subject = type === 'client'
    ? `🎯 Your Matches Are Ready for "{{projectTitle}}"`
    : `🎯 New Match – Client Interested in Your Profile`;
  
  const baseText = type === 'client'
    ? `
Hi {{clientName}},

We found {{matchCount}} vetted freelancers for "{{projectTitle}}"

Browse Matches: {{dashboardUrl}}
    `
    : `
Hi {{freelancerName}},

A client has been shown your profile for a new project!

Project: "{{projectTitle}}"
Budget: \${{budgetMin}} - \${{budgetMax}}

You don't need to take action now. We'll notify you if they want to interview.
    `.trim();
  
  return sendEmail({ to, subject, text: replacePlaceholders(baseText, data) });
}

export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('Email connection verified');
    return true;
  } catch (error) {
    console.error('Email connection failed:', error);
    return false;
  }
}
