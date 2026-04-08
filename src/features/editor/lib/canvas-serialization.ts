const CANVAS_OBJECT_KEYS = ['objects'] as const;

export const CANVAS_CUSTOM_PROPERTIES = [
  'isImporting',
  'selectable',
  'hasControls',
  'photuneRole',
  'photuneId',
  'locked',
] as const;

export type CanvasPayload = Record<string, unknown> & {
  version: string;
  objects: Array<Record<string, unknown>>;
};

export type CanvasPayloadParseResult =
  | { ok: true; data: CanvasPayload }
  | { ok: false; error: string };

export type SerializableCanvas = {
  toJSON: (propertiesToInclude?: string[]) => unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseUnknownCanvasPayload(input: unknown): unknown {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch {
      throw new Error('Canvas data is not valid JSON.');
    }
  }

  return input;
}

export function normalizeCanvasPayload(input: unknown): CanvasPayload {
  const parsed = parseUnknownCanvasPayload(input);

  if (!isPlainObject(parsed)) {
    throw new Error('Canvas data must be a JSON object.');
  }

  const cloned = cloneJsonValue(parsed);

  if (!isPlainObject(cloned)) {
    throw new Error('Canvas data could not be normalized.');
  }

  const normalizedObjects = Array.isArray(cloned.objects)
    ? cloned.objects.filter(isPlainObject).map((object) => cloneJsonValue(object))
    : [];

  return {
    ...cloned,
    version: typeof cloned.version === 'string' ? cloned.version : 'unknown',
    objects: normalizedObjects,
  };
}

export function tryNormalizeCanvasPayload(input: unknown): CanvasPayloadParseResult {
  try {
    return {
      ok: true,
      data: normalizeCanvasPayload(input),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Canvas data could not be normalized.',
    };
  }
}

export function serializeCanvasPayload(canvas: SerializableCanvas): CanvasPayload {
  return normalizeCanvasPayload(canvas.toJSON([...CANVAS_CUSTOM_PROPERTIES, ...CANVAS_OBJECT_KEYS]));
}

export function serializeCanvasSnapshot(canvas: SerializableCanvas): string {
  return JSON.stringify(serializeCanvasPayload(canvas));
}
