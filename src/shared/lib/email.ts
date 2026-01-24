import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(FormData);
const client = process.env.MAILGUN_API_KEY 
  ? mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY }) 
  : null;

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM_EMAIL || `postmaster@${domain}`;

  console.log(`[Mailgun] Attempting to send to: ${to} | Subject: ${subject}`);

  if (!client || !domain) {
    console.error('[Mailgun] FAILED: Missing configuration (API Key or Domain).');
    return { success: false, error: 'Missing Config' };
  }

  try {
    const result = await client.messages.create(domain, {
      from,
      to: [to],
      subject,
      html,
    });

    console.log(`[Mailgun] SUCCESS: ${result.id}`);
    return { success: true, messageId: result.id };
  } catch (err: any) {
    console.error('[Mailgun] Error:', err.details || err.message);
    return { success: false, error: err.message };
  }
}
