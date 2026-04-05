export type LogLevel = 'info' | 'warn' | 'error';

export type LogSurface =
  | 'auth'
  | 'dashboard'
  | 'editor'
  | 'persistence'
  | 'billing'
  | 'email'
  | 'ai'
  | 'deployment';

export type LogProvider =
  | 'supabase'
  | 'stripe'
  | 'mailgun'
  | 'groq'
  | 'cloudflare';

export type LogEvent = {
  event: string;
  level: LogLevel;
  surface: LogSurface;
  route?: string;
  provider?: LogProvider;
  projectId?: string;
  userId?: string;
  operation?: string;
  statusCode?: number;
  message?: string;
  errorName?: string;
  errorMessage?: string;
};

function sanitize(event: LogEvent): LogEvent {
  return {
    event: event.event,
    level: event.level,
    surface: event.surface,
    route: event.route,
    provider: event.provider,
    projectId: event.projectId,
    userId: event.userId,
    operation: event.operation,
    statusCode: event.statusCode,
    message: event.message,
    errorName: event.errorName,
    errorMessage: event.errorMessage,
  };
}

export function logInfo(event: Omit<LogEvent, 'level'>) {
  console.info(sanitize({ ...event, level: 'info' }));
}

export function logWarn(event: Omit<LogEvent, 'level'>) {
  console.warn(sanitize({ ...event, level: 'warn' }));
}

export function logError(event: Omit<LogEvent, 'level'>) {
  console.error(sanitize({ ...event, level: 'error' }));
}

export function getErrorSummary(error: unknown): Pick<LogEvent, 'errorName' | 'errorMessage'> {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
    };
  }

  return {
    errorName: 'UnknownError',
    errorMessage: String(error),
  };
}
