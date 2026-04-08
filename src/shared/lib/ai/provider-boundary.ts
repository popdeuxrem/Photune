export const ACTIVE_AI_PROVIDERS = ['groq', 'cloudflare'] as const;
export type ActiveAIProvider = (typeof ACTIVE_AI_PROVIDERS)[number];

export const CLOUDFLARE_WORKER_TASKS = ['image-gen', 'text-gen'] as const;
export type CloudflareWorkerTask = (typeof CLOUDFLARE_WORKER_TASKS)[number];

export function isCloudflareWorkerTask(value: unknown): value is CloudflareWorkerTask {
  return (
    typeof value === 'string' &&
    (CLOUDFLARE_WORKER_TASKS as readonly string[]).includes(value)
  );
}
