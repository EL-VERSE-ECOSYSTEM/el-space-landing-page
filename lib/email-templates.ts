export const CLIENT_WELCOME_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to EL SPACE</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F8FAFC;
      color: #1E1B4B;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1E1B4B 0%, #2D2A6E 100%);
      padding: 40px 32px;
      text-align: center;
    }
    .logo-img {
      height: 48px;
      margin-bottom: 16px;
    }
    .header-tagline {
      color: #A5B4FC;
      font-size: 16px;
      margin-top: 8px;
    }
    .content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #1E1B4B;
    }
    .steps {
      margin: 32px 0;
    }
    .step {
      display: flex;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    .step-number {
      width: 36px;
      height: 36px;
      background-color: #06B6D4;
      color: #1E1B4B;
      font-weight: 700;
      font-size: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-weight: 700;
      margin-bottom: 4px;
      color: #1E1B4B;
    }
    .step-desc {
      color: #475569;
      font-size: 14px;
    }
    .info-box {
      background-color: #EFF6FF;
      border-left: 4px solid #06B6D4;
      padding: 20px 24px;
      border-radius: 8px;
      margin: 32px 0;
    }
    .info-box-title {
      font-weight: 700;
      margin-bottom: 8px;
      color: #1E1B4B;
    }
    .info-box-list {
      margin: 0;
      padding-left: 20px;
      color: #475569;
    }
    .info-box-list li {
      margin-bottom: 6px;
    }
    .button {
      display: inline-block;
      background-color: #F59E0B;
      color: #1E1B4B;
      font-weight: 600;
      font-size: 16px;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      margin: 16px 0;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .button-secondary {
      background-color: transparent;
      color: #06B6D4;
      border: 1.5px solid #06B6D4;
      margin-left: 12px;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      display: inline-block;
    }
    .divider {
      height: 1px;
      background-color: #E2E8F0;
      margin: 32px 0;
    }
    .footer {
      background-color: #F8FAFC;
      padding: 24px 32px;
      text-align: center;
      font-size: 13px;
      color: #64748B;
    }
    .ecosystem {
      margin: 16px 0;
    }
    .ecosystem span {
      display: inline-block;
      margin: 0 8px;
      color: #475569;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      color: #64748B;
      text-decoration: none;
      margin: 0 12px;
    }
    .project-badge {
      background-color: #1E1B4B;
      color: #06B6D4;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 16px;
    }
  </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #F8FAFC;">
  <div class="container">
    <div class="header">
      <img src="{{logoUrl}}" alt="EL SPACE" class="logo-img">
      <div class="header-tagline">Freelance Without the Friction.</div>
    </div>
    <div class="content">
      <div class="project-badge">🎯 PROJECT POSTED</div>
      <div class="greeting">Welcome to EL SPACE, {{clientName}}!</div>
      <p style="margin-bottom: 24px; color: #334155;">
        Your project <strong>"{{jobTitle}}"</strong> is now live in our marketplace. 
        We're already working on matching you with vetted freelancers who can deliver exactly what you need.
      </p>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">We're Matching You</div>
            <div class="step-desc">Within 24 hours, we'll handpick 3-5 vetted freelancers perfectly suited for your project.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">You Choose</div>
            <div class="step-desc">Review profiles, chat with candidates, and select the freelancer you want to work with.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">Fund & Start</div>
            <div class="step-desc">Fund the first milestone (held securely in escrow). Freelancer begins work immediately.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <div class="step-title">Daily Visibility</div>
            <div class="step-desc">Get daily Slack standups. See progress every single day. Pay only when milestones are approved.</div>
          </div>
        </div>
      </div>
      <div class="info-box">
        <div class="info-box-title">📋 What Happens Next?</div>
        <ul class="info-box-list">
          <li><strong>Today:</strong> Our matching team reviews your project requirements.</li>
          <li><strong>Within 24 Hours:</strong> You'll receive an email with 3-5 freelancer matches.</li>
          <li><strong>This Week:</strong> Interview candidates and select your freelancer.</li>
          <li><strong>Day 1 of Project:</strong> Freelancer joins your Slack and begins work.</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <a href="{{dashboardUrl}}" class="button">📊 View Project Dashboard →</a>
        <a href="{{slackInviteUrl}}" class="button-secondary">💬 Join Slack Community</a>
      </div>
      <div class="divider"></div>
      <p style="font-size: 14px; color: #64748B; text-align: center;">
        💡 Reminder: You only pay when you hire. Platform fees are simple:
      </p>
      <p style="font-size: 14px; color: #64748B; text-align: center;">
        Micro (<$500): $19 flat • Standard ($500-$5k): 5% • Premium ($5k+): 3%
      </p>
      <div class="divider"></div>
      <p style="text-align: center; margin-top: 24px;">
        Have questions? Reply to this email or reach us at 
        <a href="mailto:support@elspace.tech" style="color: #06B6D4; text-decoration: none;">support@elspace.tech</a>
      </p>
    </div>
    <div class="footer">
      <div class="ecosystem">
        <span>ELCODERS</span> • <span>ELACCESS</span> • <span>EL SPACE</span> • <span>NEXEL</span> • <span>ELITES</span>
      </div>
      <p style="margin: 12px 0;">EL SPACE is a product of EL VERSE TECHNOLOGIES</p>
      <p style="margin: 12px 0; font-size: 12px;">© 2026 EL VERSE TECHNOLOGIES. All rights reserved.</p>
      <div class="social-links">
        <a href="{{linkedinUrl}}">LinkedIn</a> • <a href="{{twitterUrl}}">X</a> • <a href="{{privacyUrl}}">Privacy</a> • <a href="{{unsubscribeUrl}}">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const FREELANCER_WELCOME_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to EL SPACE</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #F8FAFC; color: #1E1B4B; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #1E1B4B 0%, #2D2A6E 100%); padding: 40px 32px; text-align: center; }
    .logo-img { height: 48px; margin-bottom: 16px; }
    .header-tagline { color: #A5B4FC; font-size: 16px; margin-top: 8px; }
    .content { padding: 40px 32px; }
    .greeting { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #1E1B4B; }
    .verified-badge { background: linear-gradient(120deg, #06B6D4 0%, #475569 100%); color: #FFFFFF; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 20px; }
    .skills-container { margin: 20px 0; }
    .skill-tag { display: inline-block; background-color: #EFF6FF; color: #1E1B4B; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; margin: 0 6px 8px 0; }
    .steps { margin: 32px 0; }
    .step { display: flex; align-items: flex-start; margin-bottom: 24px; }
    .step-number { width: 36px; height: 36px; background-color: #F59E0B; color: #1E1B4B; font-weight: 700; font-size: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; }
    .step-content { flex: 1; }
    .step-title { font-weight: 700; margin-bottom: 4px; color: #1E1B4B; }
    .step-desc { color: #475569; font-size: 14px; }
    .highlight-box { background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); padding: 24px; border-radius: 12px; margin: 32px 0; text-align: center; }
    .highlight-number { font-size: 36px; font-weight: 800; color: #1E1B4B; margin-bottom: 4px; }
    .highlight-label { font-size: 14px; color: #78350F; font-weight: 500; }
    .info-box { background-color: #EFF6FF; border-left: 4px solid #06B6D4; padding: 20px 24px; border-radius: 8px; margin: 32px 0; }
    .info-box-title { font-weight: 700; margin-bottom: 8px; color: #1E1B4B; }
    .info-box-list { margin: 0; padding-left: 20px; color: #475569; }
    .info-box-list li { margin-bottom: 6px; }
    .button { display: inline-block; background-color: #F59E0B; color: #1E1B4B; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin: 16px 8px 16px 0; border: none; cursor: pointer; transition: background-color 0.2s; }
    .button-secondary { background-color: transparent; color: #06B6D4; border: 1.5px solid #06B6D4; padding: 14px 32px; border-radius: 8px; text-decoration: none; display: inline-block; }
    .divider { height: 1px; background-color: #E2E8F0; margin: 32px 0; }
    .footer { background-color: #F8FAFC; padding: 24px 32px; text-align: center; font-size: 13px; color: #64748B; }
    .fee-comparison { display: flex; justify-content: space-around; margin: 24px 0; }
    .fee-item { text-align: center; }
    .fee-amount { font-size: 24px; font-weight: 700; }
    .fee-platform { font-size: 12px; color: #64748B; }
  </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #F8FAFC;">
  <div class="container">
    <div class="header">
      <img src="{{logoUrl}}" alt="EL SPACE" class="logo-img">
      <div class="header-tagline">You're In. Welcome to the top 5%.</div>
    </div>
    <div class="content">
      <div class="verified-badge">✅ VERIFIED FREELANCER</div>
      <div class="greeting">Welcome, {{freelancerName}}!</div>
      <p style="margin-bottom: 16px; color: #334155;">Your application has been approved. You're now part of EL SPACE—the curated freelance marketplace by EL VERSE TECHNOLOGIES.</p>
      {{#if skills}}
      <div class="skills-container">
        <p style="font-weight: 600; margin-bottom: 8px;">Your Listed Skills:</p>
        {{#each skills}}<span class="skill-tag">{{this}}</span>{{/each}}
      </div>
      {{/if}}
      <div class="highlight-box">
        <div class="highlight-number">97%</div>
        <div class="highlight-label">OF YOUR EARNINGS. YOU KEEP IT.</div>
        <p style="margin-top: 12px; font-size: 14px; color: #78350F;">vs. 80% on Upwork or Fiverr</p>
      </div>
      <div class="fee-comparison">
        <div class="fee-item"><div class="fee-amount" style="color: #DC2626;">20%</div><div class="fee-platform">Upwork</div></div>
        <div class="fee-item"><div class="fee-amount" style="color: #DC2626;">20%</div><div class="fee-platform">Fiverr</div></div>
        <div class="fee-item"><div class="fee-amount" style="color: #059669;">3-5%</div><div class="fee-platform">EL SPACE</div></div>
      </div>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content"><div class="step-title">Complete Your Profile</div><div class="step-desc">Add your portfolio, set your hourly rate, and verify your skills. Better profiles get matched faster.</div></div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content"><div class="step-title">Get Matched</div><div class="step-desc">No bidding wars. We match you with relevant clients based on your skills and availability.</div></div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content"><div class="step-title">Ship & Earn</div><div class="step-desc">Complete milestones. Get paid. Withdraw instantly (5% fee) or wait 3 days for free.</div></div>
        </div>
      </div>
      <div class="info-box">
        <div class="info-box-title">🚀 Your First 7 Days</div>
        <ul class="info-box-list">
          <li><strong>Today:</strong> Complete your profile (takes 10 mins).</li>
          <li><strong>Tomorrow:</strong> Join our Slack community. Introduce yourself in #introductions.</li>
          <li><strong>This Week:</strong> You'll start receiving match notifications for relevant projects.</li>
          <li><strong>Ongoing:</strong> Post daily standups when on active projects.</li>
        </ul>
      </div>
      <div style="background: linear-gradient(135deg, #1E1B4B 0%, #2D2A6E 100%); padding: 20px 24px; border-radius: 12px; margin: 24px 0; color: #FFFFFF;">
        <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">🎓 Free ELITES Access Included</div>
        <p style="margin-bottom: 16px; color: #A5B4FC;">As an EL SPACE freelancer, you get free access to ELITES—our micro-learning platform for developers.</p>
        <a href="{{elitesUrl}}" style="color: #F59E0B; text-decoration: none; font-weight: 600;">Start Learning →</a>
      </div>
      <div style="text-align: center;">
        <a href="{{profileUrl}}" class="button">✨ Complete Your Profile →</a>
        <a href="{{slackInviteUrl}}" class="button-secondary">💬 Join Slack Community</a>
      </div>
      <div class="divider"></div>
      <p style="font-size: 14px; color: #64748B; text-align: center;">📋 <strong>Daily Standups:</strong> When on a project, you'll receive a Slack reminder at 9 AM to post your daily update. This is what keeps clients happy and projects on track.</p>
      <div class="divider"></div>
      <p style="text-align: center; margin-top: 24px;">Questions? Reply to this email or join #freelancer-support in Slack.</p>
    </div>
    <div class="footer">
      <div class="ecosystem">
        <span>ELCODERS</span> • <span>ELACCESS</span> • <span>EL SPACE</span> • <span>NEXEL</span> • <span>ELITES</span>
      </div>
      <p style="margin: 12px 0;">EL SPACE is a product of EL VERSE TECHNOLOGIES</p>
      <p style="margin: 12px 0; font-size: 12px;">© 2026 EL VERSE TECHNOLOGIES. All rights reserved.</p>
      <div class="social-links">
        <a href="{{linkedinUrl}}">LinkedIn</a> • <a href="{{twitterUrl}}">X</a> • <a href="{{privacyUrl}}">Privacy</a> • <a href="{{unsubscribeUrl}}">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const CLIENT_MATCHES_TEXT = `
YOUR MATCHES ARE READY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{clientName}},

Good news. We've handpicked {{matchCount}} vetted freelancers for your project:

"{{projectTitle}}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 YOUR MATCHES

{{#each matches}}
────────────────────────────────────────────
{{@index}}. {{name}} – {{title}}
────────────────────────────────────────────

✅ Verified: {{verificationLevel}}
⭐ Rating: {{rating}}/5 ({{completedProjects}} projects)
💰 Rate: \${{hourlyRate}}/hr
🛠️ Skills: {{skillsList}}
📅 Availability: {{availability}}

View Full Profile: {{profileUrl}}

{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 NEXT STEPS

1. Review Profiles
   Browse full portfolios, past work, and client reviews.

2. Schedule Interviews
   Book 15-min calls with your top choices directly through their profiles.

3. Select Your Freelancer
   Once you've chosen, click "Hire" to fund the first milestone and start the project.

4. Join Slack
   After hiring, you'll both be added to a dedicated Slack channel for daily standups.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 QUICK LINKS

View All Matches: {{dashboardUrl}}
Compare Side-by-Side: {{compareUrl}}
Need Help Deciding?: {{supportUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ MATCHES EXPIRE IN 72 HOURS

These freelancers have been notified and are expecting to hear from you. Matches refresh after 72 hours to keep availability current.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIP

Look for freelancers with the 🥇 "ELACCESS Graduate" badge. They've completed our in-house training program and consistently deliver high-quality work.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Reply to this email or schedule a call with our matching team: {{calendarUrl}}

Best,

The EL SPACE Team
hello@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EL SPACE is a product of EL VERSE TECHNOLOGIES
ELCODERS • ELACCESS • EL SPACE • NEXEL • ELITES

Manage notifications: {{notificationSettingsUrl}}
`;

export const FREELANCER_MATCH_TEXT = `
YOU'VE BEEN MATCHED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

A client has been shown your profile for a new project.

This is NOT a bidding situation. The client is reviewing 3-5 handpicked freelancers and will reach out to interview their top choices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PROJECT DETAILS

Title: {{projectTitle}}
Budget: \${{budgetMin}} – \${{budgetMax}}
Timeline: {{timeline}}
Client: {{clientCompany}} ({{clientIndustry}})

Description:
{{projectDescription}}

Required Skills: {{skillsRequired}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ WHAT HAPPENS NEXT

• Client reviews matches (typically 24-48 hours)
• If selected for interview: You'll receive an email with a Calendly link
• If hired: First milestone is funded. Project begins immediately.

You do NOT need to take any action right now. We'll notify you if the client wants to move forward.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 INCREASE YOUR CHANCES

• Keep your availability calendar updated: {{availabilityUrl}}
• Add recent portfolio items: {{portfolioUrl}}
• Respond quickly if selected for interview (clients value speed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 YOUR MATCH STATS

Profile Views This Month: {{profileViews}}
Current Match Rate: {{matchRate}}%
Projects Completed: {{completedProjects}}

View Full Stats: {{dashboardUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Good luck!

The EL SPACE Team
freelancers@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EL SPACE is a product of EL VERSE TECHNOLOGIES
ELCODERS • ELACCESS • EL SPACE • NEXEL • ELITES

Pause matching: {{pauseMatchingUrl}}
`;

export const CLIENT_MILESTONE_FUNDED_TEXT = `
MILESTONE FUNDED – PROJECT READY TO START

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{clientName}},

You've successfully funded Milestone 1 for:

"{{projectTitle}}"

Freelancer: {{freelancerName}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 PAYMENT DETAILS

Milestone Amount: \${{milestoneAmount}}
EL SPACE Fee: \${{platformFee}}
Escrow Protection: Included
Total Charged: \${{totalCharged}}

Payment Method: {{paymentMethodLast4}}
Transaction ID: {{transactionId}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 YOUR FUNDS ARE SECURE

The \${{milestoneAmount}} is held in escrow by Korapay (our payment partner). Funds will ONLY be released to the freelancer when:

1. Freelancer submits work for this milestone
2. You review and approve the submission
3. You click "Release Payment"

You have full control. If the work doesn't meet requirements, you can request revisions or open a dispute.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 WHAT HAPPENS NOW

1. {{freelancerName}} has been notified and will begin work within 24 hours.

2. You'll receive a Slack invitation to a dedicated channel:
   #elspace-{{projectSlug}}

3. Daily standups start tomorrow at 9 AM ({{timezone}}). You'll see exactly what's being worked on every single day.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 MILESTONE TIMELINE

Milestone 1: {{milestone1Description}}
Due Date: {{milestone1DueDate}}
Amount in Escrow: \${{milestoneAmount}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 QUICK LINKS

Project Dashboard: {{dashboardUrl}}
Slack Channel: {{slackChannelUrl}}
View Receipt: {{receiptUrl}}
Contact Support: support@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Excited to see what you build together.

The EL SPACE Team
hello@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EL SPACE is a product of EL VERSE TECHNOLOGIES
`;

export const FREELANCER_MILESTONE_FUNDED_TEXT = `
MILESTONE FUNDED – YOU'RE CLEARED TO START

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

Great news. {{clientName}} has funded Milestone 1 for:

"{{projectTitle}}"

You are now cleared to begin work.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 MILESTONE DETAILS

Amount: \${{milestoneAmount}}
Your Earnings (after {{feePercentage}} fee): \${{yourEarnings}}
Status: Held in escrow – guaranteed upon approval

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 MILESTONE REQUIREMENTS

Description: {{milestone1Description}}
Due Date: {{milestone1DueDate}}
Deliverables: {{milestone1Deliverables}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 NEXT STEPS (DO THESE TODAY)

1. Join the Slack Channel
   {{slackChannelUrl}}

2. Send a Welcome Message
   Introduce yourself and confirm you're starting work.

3. Review Project Details
   {{dashboardUrl}}

4. Post First Standup Tomorrow by 9 AM ({{timezone}})
   Format:
   - Yesterday: (N/A – first day)
   - Today's Goal: [What you'll accomplish]
   - Blockers: None

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 REMINDERS

• Daily standups are REQUIRED. They keep the client happy and protect you if disputes arise.
• If you hit a blocker, communicate immediately in Slack.
• Submit work 24-48 hours before the due date to allow time for revisions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PAYMENT TIMELINE

Submit Work → Client Reviews (up to 3 days) → Approval → Funds Released

Once approved, you can withdraw instantly (5% fee) or wait 3 days for free.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let's ship this.

The EL SPACE Team
freelancers@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EL SPACE is a product of EL VERSE TECHNOLOGIES
`;

export const DAILY_STANDUP_REMINDER_TEXT = `
DAILY STANDUP REMINDER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

We noticed you haven't posted your daily standup in Slack yet for:

Project: {{projectTitle}}
Client: {{clientName}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PLEASE POST YOUR UPDATE NOW

Reply in the Slack channel #elspace-{{projectSlug}} with:

1️⃣ What I shipped yesterday:
2️⃣ What I'm shipping today:
3️⃣ Any blockers:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ WHY THIS MATTERS

• Clients expect daily visibility (it's why they chose EL SPACE)
• Missing 2+ standups may affect your match score and visibility in searches
• Standups create a paper trail that protects you in disputes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 QUICK LINKS

Go to Slack Channel: {{slackChannelUrl}}
Update via Dashboard: {{dashboardStandupUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you've already posted in Slack, please ignore this email (Slack sync delay).

If you're unable to work today due to emergency, please message the client directly and CC support@elspace.tech.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The EL SPACE Team
support@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EL SPACE is a product of EL VERSE TECHNOLOGIES
`;

export const PAYMENT_RECEIVED_TEXT = `
PAYMENT RECEIVED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

Great work. {{clientName}} has approved Milestone {{milestoneNumber}} and released payment.

Project: {{projectTitle}}
Milestone: {{milestoneDescription}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 PAYMENT BREAKDOWN

Milestone Amount: \${{milestoneAmount}}
EL SPACE Fee ({{feePercentage}}): -\${{platformFee}}
────────────────────────────────────────────
Your Earnings: \${{yourEarnings}}

Status: ✅ Deposited to your EL SPACE Wallet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ WITHDRAW YOUR FUNDS

Available Balance: \${{walletBalance}}

Option 1: Instant Withdrawal
• Receive funds in minutes
• 5% fee (\${{instantFeeAmount}})
• Withdraw now: {{instantWithdrawUrl}}

Option 2: Standard Withdrawal
• Receive funds in 3 business days
• No fee
• Withdraw now: {{standardWithdrawUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PROJECT PROGRESS

Milestone 1: ✅ Completed – \${{m1Amount}} earned
Milestone 2: 🔄 In Progress – \${{m2Amount}} pending
Milestone 3: ⏳ Not Started – \${{m3Amount}} pending

Total Project Value: \${{totalProjectValue}}
Earned So Far: \${{earnedSoFar}}
Remaining: \${{remainingValue}}

View Full Project: {{dashboardUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 CLIENT FEEDBACK

"{{clientFeedbackSnippet}}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 YOUR EARNINGS THIS MONTH

Total Earned (MTD): \${{monthToDateEarnings}}
Projects Completed (MTD): {{monthlyCompletedProjects}}
Average Project Value: \${{averageProjectValue}}

View Earnings Dashboard: {{earningsUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep up the great work.

The EL SPACE Team
payments@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EL SPACE is a product of EL VERSE TECHNOLOGIES
`;

export const CLIENT_PROJECT_COMPLETE_TEXT = `
PROJECT COMPLETE – CONGRATULATIONS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{clientName}},

Congratulations! All milestones for "{{projectTitle}}" have been completed and approved.

Freelancer: {{freelancerName}}
Total Project Value: \${{totalProjectValue}}
Duration: {{projectDuration}} days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PROJECT SUMMARY

Milestones Completed: {{completedMilestones}}/{{totalMilestones}}
Commits Made: {{commitCount}}
Standups Posted: {{standupCount}}
Files Delivered: {{fileCount}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ LEAVE A REVIEW (2 MINUTES)

Your feedback helps other clients and recognizes great work.

Rate {{freelancerName}}:

{{reviewUrl}}

Your review will:
• Help other clients find quality talent
• Boost the freelancer's match score
• Shape the EL SPACE community

Both reviews are double-blind. Neither party sees the other's review until both are submitted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 WHAT'S NEXT?

Option 1: Start Another Project
Post a new job (free): {{postJobUrl}}

Option 2: Rehire {{freelancerName}}
Send a direct offer: {{rehireUrl}}

Option 3: Take {{freelancerName}} Off-Platform
After 6 months of collaboration, you can convert to direct hire for a one-time \$199 fee.
Learn more: {{directHireUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJECT ARCHIVE

All files, messages, and deliverables will be available in your dashboard for 12 months.

Download Project Archive: {{archiveUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing EL SPACE.

The EL SPACE Team
hello@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EL SPACE is a product of EL VERSE TECHNOLOGIES
`;

export const FREELANCER_PROJECT_COMPLETE_TEXT = `
PROJECT COMPLETE – GREAT WORK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

Congratulations on completing "{{projectTitle}}" with {{clientName}}!

All milestones have been approved and final payment has been released to your wallet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PROJECT SUMMARY

Total Earned: \${{totalEarned}}
Duration: {{projectDuration}} days
Milestones: {{completedMilestones}}/{{totalMilestones}}
Client Satisfaction: Pending review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ LEAVE A REVIEW FOR {{clientName}}

Your feedback helps other freelancers find great clients.

Rate {{clientName}}:

{{reviewUrl}}

Your review will:
• Help other freelancers identify quality clients
• Appear on the client's profile
• Shape the EL SPACE community

Both reviews are double-blind. Neither party sees the other's review until both are submitted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 WHAT'S NEXT?

1. Update Your Availability
   You're now available for new matches: {{availabilityUrl}}

2. Add This Project to Your Portfolio
   Showcase your work: {{portfolioUrl}}

3. Browse New Matches
   {{matchesUrl}}

4. Upskill with ELITES
   Free course: "How to 5x Your Freelance Income"
   {{elitesUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 YOUR UPDATED STATS

Completed Projects: {{totalCompletedProjects}}
Average Rating: {{averageRating}}/5
Total Earned on EL SPACE: \${{lifetimeEarned}}
Current Match Score: {{matchScore}}/100

View Full Profile: {{profileUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIP

Freelancers with 5+ completed projects and 4.8+ ratings get priority matching and appear at the top of client searches.

You're {{projectsNeeded}} projects away from Priority Status.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amazing work. Proud to have you in EL SPACE.

The EL SPACE Team
freelancers@elspace.tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EL SPACE is a product of EL VERSE TECHNOLOGIES
`;

// POST-MATCH NOTIFICATION EMAIL (CLIENT)
export const POST_MATCH_CLIENT = `
YOUR MATCHES ARE READY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{clientName}},

Good news. We've handpicked {{matchCount}} vetted freelancers for your project:

"{{projectTitle}}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 YOUR MATCHES

{{#each matches}}
────────────────────────────────────────────
{{@index}}. {{name}} – {{title}}
────────────────────────────────────────────

✅ Verified: {{verificationLevel}}
⭐ Rating: {{rating}}/5 ({{completedProjects}} projects)
💰 Rate: \${{hourlyRate}}/hr
🛠️ Skills: {{skillsList}}
📅 Availability: {{availability}}

View Full Profile: {{profileUrl}}

{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 NEXT STEPS

1. Review Profiles - Browse full portfolios, past work, and client reviews.
2. Schedule Interviews - Book 15-min calls with your top choices.
3. Select Your Freelancer - Click "Hire" to fund and start.
4. Join Slack - Get added to a dedicated channel for daily standups.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 QUICK LINKS

View All Matches: {{dashboardUrl}}
Compare Side-by-Side: {{compareUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ MATCHES EXPIRE IN 72 HOURS

These freelancers have been notified and are expecting to hear from you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best,

The EL SPACE Team
hello@elspace.tech
`;

// POST-MATCH NOTIFICATION EMAIL (FREELANCER)
export const POST_MATCH_FREELANCER = `
YOU'VE BEEN MATCHED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

A client has been shown your profile for a new project.

This is NOT a bidding situation. The client is reviewing 3-5 handpicked freelancers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PROJECT DETAILS

Title: {{projectTitle}}
Budget: \${{budgetMin}} – \${{budgetMax}}
Timeline: {{timeline}}
Client: {{clientCompany}} ({{clientIndustry}})
Description: {{projectDescription}}
Required Skills: {{skillsRequired}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ WHAT HAPPENS NEXT

• Client reviews matches (typically 24-48 hours)
• If selected: You'll receive an email with an interview link
• If hired: First milestone is funded. Project begins.

You do NOT need to take action right now.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 INCREASE YOUR CHANCES

• Keep your availability calendar updated: {{availabilityUrl}}
• Add recent portfolio items: {{portfolioUrl}}
• Respond quickly if selected for interview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Good luck!

The EL SPACE Team
freelancers@elspace.tech
`;

// MILESTONE FUNDED CONFIRMATION (CLIENT)
export const MILESTONE_FUNDED_CLIENT = `
MILESTONE FUNDED – PROJECT READY TO START

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{clientName}},

You've successfully funded Milestone 1 for:

"{{projectTitle}}"

Freelancer: {{freelancerName}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 PAYMENT DETAILS

Milestone Amount: \${{milestoneAmount}}
EL SPACE Fee: \${{platformFee}}
Escrow Protection: Included
Total Charged: \${{totalCharged}}

Payment Method: {{paymentMethodLast4}}
Transaction ID: {{transactionId}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 YOUR FUNDS ARE SECURE

The \${{milestoneAmount}} is held in escrow. Funds will ONLY be released when:

1. Freelancer submits work
2. You review and approve
3. You click "Release Payment"

You have full control. Request revisions or open a dispute if needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 WHAT HAPPENS NOW

1. {{freelancerName}} has been notified and will begin work within 24 hours.
2. You'll receive a Slack invitation to a dedicated channel.
3. Daily standups start tomorrow at 9 AM ({{timezone}}).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 MILESTONE TIMELINE

Milestone 1: {{milestone1Description}}
Due Date: {{milestone1DueDate}}
Amount in Escrow: \${{milestoneAmount}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 QUICK LINKS

Project Dashboard: {{dashboardUrl}}
Slack Channel: {{slackChannelUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Excited to see what you build together.

The EL SPACE Team
hello@elspace.tech
`;

// MILESTONE FUNDED CONFIRMATION (FREELANCER)
export const MILESTONE_FUNDED_FREELANCER = `
MILESTONE FUNDED – YOU'RE CLEARED TO START

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

Great news. {{clientName}} has funded Milestone 1 for:

"{{projectTitle}}"

You are now cleared to begin work.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 MILESTONE DETAILS

Amount: \${{milestoneAmount}}
Your Earnings (after {{feePercentage}} fee): \${{yourEarnings}}
Status: Held in escrow – guaranteed upon approval

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 MILESTONE REQUIREMENTS

Description: {{milestone1Description}}
Due Date: {{milestone1DueDate}}
Deliverables: {{milestone1Deliverables}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 NEXT STEPS (DO THESE TODAY)

1. Join the Slack Channel: {{slackChannelUrl}}
2. Send a Welcome Message to the client
3. Review Project Details: {{dashboardUrl}}
4. Post First Standup Tomorrow by 9 AM ({{timezone}})

Format:
- Yesterday: (N/A – first day)
- Today's Goal: [What you'll accomplish]
- Blockers: None

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 REMINDERS

• Daily standups are REQUIRED
• If you hit a blocker, communicate immediately
• Submit work 24-48 hours before due date

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PAYMENT TIMELINE

Submit Work → Client Reviews (3 days) → Approval → Funds Released

Once approved, withdraw instantly (5% fee) or wait 3 days free.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let's ship this.

The EL SPACE Team
freelancers@elspace.tech
`;

// DAILY STANDUP REMINDER EMAIL
export const DAILY_STANDUP_REMINDER = `
DAILY STANDUP REMINDER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

We noticed you haven't posted your daily standup in Slack yet for:

Project: {{projectTitle}}
Client: {{clientName}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PLEASE POST YOUR UPDATE NOW

Reply in Slack #elspace-{{projectSlug}} with:

1️⃣ What I shipped yesterday:
2️⃣ What I'm shipping today:
3️⃣ Any blockers:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ WHY THIS MATTERS

• Clients expect daily visibility
• Missing 2+ standups affects your match score
• Standups protect you in disputes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 QUICK LINKS

Go to Slack: {{slackChannelUrl}}
Update via Dashboard: {{dashboardStandupUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you've already posted, please ignore this email.

If you're unable to work, message the client and CC support@elspace.tech.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The EL SPACE Team
support@elspace.tech
`;

// PAYMENT RECEIVED CONFIRMATION EMAIL (FREELANCER)
export const PAYMENT_RECEIVED_FREELANCER = `
PAYMENT RECEIVED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

Great work. {{clientName}} has approved Milestone {{milestoneNumber}} and released payment.

Project: {{projectTitle}}
Milestone: {{milestoneDescription}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 PAYMENT BREAKDOWN

Milestone Amount: \${{milestoneAmount}}
EL SPACE Fee ({{feePercentage}}): -\${{platformFee}}
────────────────────────────────────────────
Your Earnings: \${{yourEarnings}}

Status: ✅ Deposited to your EL SPACE Wallet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ WITHDRAW YOUR FUNDS

Available Balance: \${{walletBalance}}

Option 1: Instant Withdrawal
• Receive funds in minutes
• 5% fee (\${{instantFeeAmount}})
• {{instantWithdrawUrl}}

Option 2: Standard Withdrawal
• Receive funds in 3 business days
• No fee
• {{standardWithdrawUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PROJECT PROGRESS

Milestone 1: ✅ Completed – \${{m1Amount}} earned
Milestone 2: 🔄 In Progress – \${{m2Amount}} pending
Milestone 3: ⏳ Not Started – \${{m3Amount}} pending

Total Earned: \${{earnedSoFar}}
Remaining: \${{remainingValue}}

View Full Project: {{dashboardUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 CLIENT FEEDBACK

"{{clientFeedbackSnippet}}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 YOUR EARNINGS THIS MONTH

Total Earned (MTD): \${{monthToDateEarnings}}
Projects Completed (MTD): {{monthlyCompletedProjects}}
Average Project Value: \${{averageProjectValue}}

View Earnings Dashboard: {{earningsUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep up the great work.

The EL SPACE Team
payments@elspace.tech
`;

// PROJECT COMPLETION EMAIL (CLIENT)
export const PROJECT_COMPLETE_CLIENT = `
PROJECT COMPLETE – CONGRATULATIONS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{clientName}},

Congratulations! All milestones for "{{projectTitle}}" have been completed.

Freelancer: {{freelancerName}}
Total Project Value: \${{totalProjectValue}}
Duration: {{projectDuration}} days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PROJECT SUMMARY

Milestones Completed: {{completedMilestones}}/{{totalMilestones}}
Commits Made: {{commitCount}}
Standups Posted: {{standupCount}}
Files Delivered: {{fileCount}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ LEAVE A REVIEW (2 MINUTES)

Your feedback helps other clients and recognizes great work.

Rate {{freelancerName}}: {{reviewUrl}}

Your review will:
• Help other clients find quality talent
• Boost the freelancer's match score
• Shape the EL SPACE community

Both reviews are double-blind. Neither party sees until both submit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 WHAT'S NEXT?

Option 1: Start Another Project - {{postJobUrl}}
Option 2: Rehire {{freelancerName}} - {{rehireUrl}}
Option 3: Take Off-Platform - After 6 months, $199 one-time fee

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 PROJECT ARCHIVE

All files available in your dashboard for 12 months.

Download Archive: {{archiveUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing EL SPACE.

The EL SPACE Team
hello@elspace.tech
`;

// PROJECT COMPLETION EMAIL (FREELANCER)
export const PROJECT_COMPLETE_FREELANCER = `
PROJECT COMPLETE – GREAT WORK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi {{freelancerName}},

Congratulations on completing "{{projectTitle}}" with {{clientName}}!

All milestones approved. Final payment released to your wallet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PROJECT SUMMARY

Total Earned: \${{totalEarned}}
Duration: {{projectDuration}} days
Milestones: {{completedMilestones}}/{{totalMilestones}}
Client Satisfaction: Pending review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ LEAVE A REVIEW FOR {{clientName}}

Your feedback helps other freelancers find great clients.

Rate {{clientName}}: {{reviewUrl}}

Your review will:
• Help other freelancers identify quality clients
• Appear on the client's profile
• Shape the EL SPACE community

Both reviews double-blind.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 WHAT'S NEXT?

1. Update Your Availability - {{availabilityUrl}}
2. Add This to Your Portfolio - {{portfolioUrl}}
3. Browse New Matches - {{matchesUrl}}
4. Upskill with ELITES - Free course on earning more

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 YOUR UPDATED STATS

Completed Projects: {{totalCompletedProjects}}
Average Rating: {{averageRating}}/5
Total Earned: \${{lifetimeEarned}}
Current Match Score: {{matchScore}}/100

View Full Profile: {{profileUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIP

Freelancers with 5+ projects and 4.8+ ratings get priority matching.

You're {{projectsNeeded}} projects away from Priority Status.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amazing work. Proud to have you in EL SPACE.

The EL SPACE Team
freelancers@elspace.tech
`;
