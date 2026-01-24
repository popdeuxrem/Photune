import FormData from 'form-data';
import Mailgun from 'mailgun.js';

/**
 * Production-hardened Email Utility
 */
export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM_EMAIL || `phoTextAI <hello@${domain}>`;

  if (!apiKey || !domain) {
    console.error('[Email] FAILED: Missing Mailgun credentials.');
    return { success: false, error: 'Configuration Error' };
  }

  try {
    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({ username: 'api', key: apiKey });

    const result = await client.messages.create(domain, {
      from,
      to: [to],
      subject,
      html,
    });

    return { success: true, messageId: result.id };
  } catch (err: any) {
    console.error('[Email SDK Error]:', err.message);
    return { success: false, error: err.message };
  }
}
