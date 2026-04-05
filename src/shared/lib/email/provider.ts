import { requireMailgunEnv } from '@/shared/lib/env/email';

export type TransactionalEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export function getEmailProvider() {
  const provider = 'mailgun' as const;
  const config = requireMailgunEnv();

  return {
    provider,
    config,
  };
}

export async function assertEmailProviderReady() {
  const { provider } = getEmailProvider();

  if (provider !== 'mailgun') {
    throw new Error(`Unsupported email provider configured: ${provider}`);
  }

  return provider;
}
