import { NextResponse } from 'next/server';
import { sendEmail } from '@/shared/lib/email';
import { createClient } from '@/shared/lib/supabase/server';

export async function GET() {
  // 1. Verify Session
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2. Trigger Test Email
  const result = await sendEmail({
    to: user.email,
    subject: "phoTextAI System Verification",
    html: `
      <h1>Email Pipeline Active</h1>
      <p>This proves the <strong>Resend SDK</strong> is correctly configured.</p>
      <p>User: ${user.id}</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    `
  });

  return NextResponse.json({ 
    info: "Proof of functionality result",
    sdk_success: result.success,
    resend_id: result.messageId || null,
    error: result.error || null
  });
}
