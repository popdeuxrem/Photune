import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { getErrorSummary, logError, logInfo } from '@/shared/lib/logging/logger';
import { requireMailgunEnv } from '@/shared/lib/env/email';

/**
 * Aligned with mg.avanterdor.xyz deliverability standards
 */
export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  const mailgunEnv = requireMailgunEnv();

  const from = mailgunEnv.fromEmail || `Photune <noreply@${mailgunEnv.domain}>`;

  logInfo({
    event: 'mailgun_send_start',
    surface: 'email',
    provider: 'mailgun',
    operation: 'mail_send',
  });

  try {
    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({ username: 'api', key: mailgunEnv.apiKey });

    const result = await client.messages.create(mailgunEnv.domain, {
      from,
      to: [to],
      subject,
      html,
    });

    console.log(`[Email] Transactional success: ${result.id}`);
    logInfo({
      event: 'mailgun_send_success',
      surface: 'email',
      provider: 'mailgun',
      operation: 'mail_send',
      message: result.id,
    });
    return { success: true, messageId: result.id };
  } catch (err: any) {
    console.error('[Email SDK Error]:', err.message);
    logError({
      event: 'mailgun_send_failure',
      surface: 'email',
      provider: 'mailgun',
      operation: 'mail_send',
      ...getErrorSummary(err),
    });
    return { success: false, error: err.message };
  }
}
