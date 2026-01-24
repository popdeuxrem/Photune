import { NextResponse } from 'next/server';
import { sendEmail } from '@/shared/lib/email';
import { createClient } from '@/shared/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // NOTE: If using a Mailgun Sandbox, this user.email MUST be added 
  // to the 'Authorized Recipients' list in the Mailgun Dashboard.
  const result = await sendEmail({
    to: user.email,
    subject: "phoTextAI Mailgun Verification",
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h1 style="color: #333;">Mailgun Pipeline Active</h1>
        <p>This confirms your app can send emails via <strong>Mailgun SDK</strong>.</p>
        <hr />
        <p style="font-size: 12px; color: #999;">Sent at: ${new Date().toISOString()}</p>
      </div>
    `
  });

  return NextResponse.json({ 
    engine: "Mailgun",
    success: result.success,
    messageId: result.messageId || null,
    error: result.error || null
  });
}
