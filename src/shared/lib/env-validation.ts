/**
 * Environment variable validation and documentation.
 * Ensures all required AI/integration env vars are configured.
 * 
 * Usage:
 *   validateEnvironment(); // throws if missing critical vars
 *   getEnvDocumentation();  // returns setup guide
 */

export type EnvRequirement = {
  key: string;
  description: string;
  required: boolean;
  example: string;
  docsUrl?: string;
};

const ENV_REQUIREMENTS: Record<string, EnvRequirement> = {
  GROQ_API_KEY: {
    key: 'GROQ_API_KEY',
    description: 'Groq API key for fast LLM inference (text rewrite, captions)',
    required: true,
    example: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
  },
  NEXT_PUBLIC_SUPABASE_URL: {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL for auth and project persistence',
    required: true,
    example: 'https://your-project.supabase.co',
    docsUrl: 'https://supabase.com/docs/guides/getting-started',
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous key for client-side auth',
    required: true,
    example: 'eyJ...',
    docsUrl: 'https://supabase.com/docs/guides/getting-started',
  },
  CLOUDFLARE_API_TOKEN: {
    key: 'CLOUDFLARE_API_TOKEN',
    description: 'Cloudflare API token for image inpainting (background removal, healing)',
    required: false,
    example: 'v1.0c3f...',
    docsUrl: 'https://developers.cloudflare.com/fundamentals/api/get-started/',
  },
  STRIPE_SECRET_KEY: {
    key: 'STRIPE_SECRET_KEY',
    description: 'Stripe secret key for premium billing (optional)',
    required: false,
    example: 'sk_live_...',
    docsUrl: 'https://stripe.com/docs/keys',
  },
};

/**
 * Validate that all required environment variables are set.
 * Throws an error with helpful message if critical vars missing.
 */
export function validateEnvironment(throwOnMissing: boolean = true): {
  valid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  Object.entries(ENV_REQUIREMENTS).forEach(([, req]) => {
    const value = process.env[req.key] || process.env[`NEXT_PUBLIC_${req.key}`];
    
    if (!value) {
      if (req.required) {
        missing.push(req.key);
      } else {
        warnings.push(`Optional env var ${req.key} not configured`);
      }
    }
  });

  if (missing.length > 0 && throwOnMissing) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Run 'npx photune --setup-env' or see SETUP.md for configuration.`,
    );
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Get human-readable environment setup documentation.
 */
export function getEnvDocumentation(): string {
  return `
# Photune Environment Setup

## Required Variables

${Object.entries(ENV_REQUIREMENTS)
  .filter(([, req]) => req.required)
  .map(
    ([, req]) => `
### ${req.key}
**Description:** ${req.description}
**Example:** \`${req.example}\`
**Setup:** ${req.docsUrl ? `[View docs](${req.docsUrl})` : 'See project README'}
`,
  )
  .join('\n')}

## Optional Variables

${Object.entries(ENV_REQUIREMENTS)
  .filter(([, req]) => !req.required)
  .map(
    ([, req]) => `
### ${req.key}
**Description:** ${req.description}
**Example:** \`${req.example}\`
**Setup:** ${req.docsUrl ? `[View docs](${req.docsUrl})` : 'See project README'}
`,
  )
  .join('\n')}

## Verification

Run this to check your setup:
\`\`\`bash
npx photune --check-env
\`\`\`

All variables should appear as ✓ CONFIGURED.
`;
}

/**
 * Get a specific env requirement for documentation purposes.
 */
export function getEnvRequirement(key: string): EnvRequirement | null {
  return ENV_REQUIREMENTS[key] || null;
}

/**
 * List all environment requirements.
 */
export function getAllEnvRequirements(): EnvRequirement[] {
  return Object.values(ENV_REQUIREMENTS);
}
