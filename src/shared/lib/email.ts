import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  
  console.log(`[Email] Attempting to send to: ${to} | Subject: ${subject}`);

  if (!resend) {
    console.error('[Email] FAILED: RESEND_API_KEY is not configured.');
    return { success: false, error: 'Missing API Key' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] SDK Error:', error);
      return { success: false, error };
    }

    console.log(`[Email] SUCCESS: Message ID ${data?.id}`);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[Email] Unexpected Error:', err);
    return { success: false, error: err };
  }
}
