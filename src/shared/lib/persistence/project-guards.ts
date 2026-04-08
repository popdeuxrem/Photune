const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_PROJECT_NAME_LENGTH = 120;
const MAX_CANVAS_DATA_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_REFERENCE_BYTES = 2 * 1024 * 1024;

function getByteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

export function isPersistedProjectId(value: string): boolean {
  return UUID_RE.test(value);
}

export function isAllowedProjectRouteId(value: string): boolean {
  return value === 'new' || isPersistedProjectId(value);
}

export function normalizeProjectName(input: unknown): string {
  if (typeof input !== 'string') {
    return 'Untitled Project';
  }

  const normalized = input.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return 'Untitled Project';
  }

  return normalized.slice(0, MAX_PROJECT_NAME_LENGTH);
}

export function assertCanvasDataSerializable(input: unknown): void {
  let serialized: string;

  try {
    serialized = JSON.stringify(input);
  } catch {
    throw new Error('Canvas data is not serializable.');
  }

  if (!serialized) {
    throw new Error('Canvas data is required.');
  }

  if (getByteLength(serialized) > MAX_CANVAS_DATA_BYTES) {
    throw new Error('Canvas data exceeds the maximum allowed size.');
  }
}

export function normalizeImageReference(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  const normalized = input.trim();

  if (!normalized) {
    return null;
  }

  if (getByteLength(normalized) > MAX_IMAGE_REFERENCE_BYTES) {
    throw new Error('Image reference exceeds the maximum allowed size.');
  }

  const isAllowedReference =
    normalized.startsWith('data:image/') ||
    normalized.startsWith('blob:') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('/');

  if (!isAllowedReference) {
    throw new Error('Image reference format is not allowed.');
  }

  return normalized;
}
