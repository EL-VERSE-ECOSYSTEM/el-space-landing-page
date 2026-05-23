export async function sendEmail({ to, subject, html, text }: { to: string, subject: string, html?: string, text?: string }) {
  console.log('Sending email to:', to);
  return { success: true };
}

export async function sendClientWelcomeEmail(email: string, data: any) {
  return sendEmail({ to: email, subject: 'Welcome to EL SPACE', html: '<p>Welcome</p>' });
}

export async function sendFreelancerWelcomeEmail(email: string, data: any) {
  return sendEmail({ to: email, subject: 'Welcome to EL SPACE', html: '<p>Welcome</p>' });
}

export async function sendPaymentReceivedEmail(email: string, data: any) {
  return sendEmail({ to: email, subject: 'Payment Received', html: '<p>Payment Received</p>' });
}

export async function sendProjectCompletionEmail(email: string, role: string, data: any) {
  return sendEmail({ to: email, subject: 'Project Completed', html: '<p>Project Completed</p>' });
}

export async function sendNotificationEmail(email: string, data: any) {
    return sendEmail({ to: email, subject: data.subject || 'Notification', html: `<p>${data.message}</p>` });
}

export async function sendApplicationStatusEmail(email: string, data: any) {
    return sendEmail({ to: email, subject: 'Application Status Updated', html: '<p>Status updated</p>' });
}

export async function sendMilestoneFundedEmail(email: string, roleOrData: any, dataOrNothing?: any) {
    return sendEmail({ to: email, subject: 'Milestone Funded', html: '<p>Milestone Funded</p>' });
}
