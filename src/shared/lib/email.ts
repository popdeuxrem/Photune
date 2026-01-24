import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM_EMAIL || `postmaster@${domain}`;

  // DIAGNOSTIC LOGS
  console.log("--- Mailgun Debug Info ---");
  console.log("To:", to);
  console.log("API Key Present:", !!apiKey);
  console.log("Domain Present:", !!domain);
  console.log("Domain Value:", domain);

  if (!apiKey || !domain) {
    let missing = [];
    if (!apiKey) missing.push("MAILGUN_API_KEY");
    if (!domain) missing.push("MAILGUN_DOMAIN");
    
    return { 
      success: false, 
      error: `Missing Config: ${missing.join(", ")}. Ensure these are in your .env.local or Vercel env settings.` 
    };
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
    console.error('[Mailgun SDK Error]:', err);
    return { success: false, error: err.message || "Unknown Mailgun Error" };
  }
}
