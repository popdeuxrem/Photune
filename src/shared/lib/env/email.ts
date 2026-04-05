export function requireMailgunEnv() {
  const keys = [
    'MAILGUN_API_KEY',
    'MAILGUN_DOMAIN',
    'MAILGUN_FROM_EMAIL',
  ] as const;

  const missing = keys.filter((key) => !process.env[key] || process.env[key]!.trim() === '');

  if (missing.length > 0) {
    throw new Error(`Missing required Mailgun environment variables: ${missing.join(', ')}`);
  }

  return {
    apiKey: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string,
    fromEmail: process.env.MAILGUN_FROM_EMAIL as string,
  };
}
