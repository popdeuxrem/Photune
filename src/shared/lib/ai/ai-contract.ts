import { isCloudflareWorkerTask, type CloudflareWorkerTask } from './provider-boundary';

export type AIErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'rate_limited'
  | 'provider_unavailable'
  | 'provider_error'
  | 'invalid_response'
  | 'unsupported_task';

export type AISuccessEnvelope<T> = {
  ok: true;
  provider: 'groq' | 'cloudflare';
  data: T;
};

export type AIErrorEnvelope = {
  ok: false;
  provider: 'groq' | 'cloudflare';
  error: {
    code: AIErrorCode;
    message: string;
  };
};

export type AIEnvelope<T> = AISuccessEnvelope<T> | AIErrorEnvelope;

export type GroqRequestPayload = {
  model: string;
  messages: Array<
    | { role: 'system' | 'user' | 'assistant'; content: string }
    | {
        role: 'user';
        content: Array<
          | { type: 'text'; text: string }
          | { type: 'image_url'; image_url: { url: string } }
        >;
      }
  >;
  temperature?: number;
  max_tokens?: number;
};

export type GroqTextResult = {
  outputText: string;
  model: string;
  raw: unknown;
};

export type CloudflareTextResult = {
  outputText: string;
  task: 'text-gen';
  raw: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function makeAIError<TProvider extends 'groq' | 'cloudflare'>(
  provider: TProvider,
  code: AIErrorCode,
  message: string
): AIErrorEnvelope {
  return {
    ok: false,
    provider,
    error: { code, message },
  };
}

export function makeAISuccess<TProvider extends 'groq' | 'cloudflare', TData>(
  provider: TProvider,
  data: TData
): AISuccessEnvelope<TData> {
  return {
    ok: true,
    provider,
    data,
  };
}

export function parseGroqRequestPayload(input: unknown): GroqRequestPayload {
  if (!isRecord(input)) {
    throw new Error('Request body must be an object.');
  }

  const { model, messages, temperature, max_tokens } = input;

  if (typeof model !== 'string' || model.trim().length === 0) {
    throw new Error('Field "model" is required.');
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Field "messages" must be a non-empty array.');
  }

  if (
    temperature !== undefined &&
    (typeof temperature !== 'number' || !Number.isFinite(temperature))
  ) {
    throw new Error('Field "temperature" must be a number when provided.');
  }

  if (
    max_tokens !== undefined &&
    (typeof max_tokens !== 'number' || !Number.isFinite(max_tokens) || max_tokens <= 0)
  ) {
    throw new Error('Field "max_tokens" must be a positive number when provided.');
  }

  return {
    model: model.trim(),
    messages: messages as GroqRequestPayload['messages'],
    temperature,
    max_tokens,
  };
}

export function extractGroqOutputText(input: unknown): string {
  if (!isRecord(input)) {
    throw new Error('Provider response must be an object.');
  }

  const choices = input.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new Error('Provider response did not include choices.');
  }

  const firstChoice = choices[0];
  if (!isRecord(firstChoice)) {
    throw new Error('Provider response choice was invalid.');
  }

  const message = firstChoice.message;
  if (!isRecord(message)) {
    throw new Error('Provider response message was invalid.');
  }

  const content = message.content;
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Provider response did not include text content.');
  }

  return content.trim();
}

export function parseCloudflareWorkersRequest(input: unknown): {
  task: CloudflareWorkerTask;
  prompt: unknown;
} {
  if (!isRecord(input)) {
    throw new Error('Request body must be an object.');
  }

  const { task, prompt } = input;

  if (!isCloudflareWorkerTask(task)) {
    throw new Error('Field "task" is invalid or unsupported.');
  }

  if (prompt === undefined || prompt === null) {
    throw new Error('Field "prompt" is required.');
  }

  return {
    task,
    prompt,
  };
}

export function extractCloudflareTextOutput(input: unknown): string {
  if (!isRecord(input)) {
    throw new Error('Provider response must be an object.');
  }

  const result = input.result;

  if (typeof result === 'string' && result.trim().length > 0) {
    return result.trim();
  }

  if (isRecord(result)) {
    if (typeof result.response === 'string' && result.response.trim().length > 0) {
      return result.response.trim();
    }

    if (typeof result.text === 'string' && result.text.trim().length > 0) {
      return result.text.trim();
    }
  }

  throw new Error('Provider response did not include text output.');
}
