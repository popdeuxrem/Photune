import { normalizeCanvasPayload } from './canvas-serialization';

const UUIDISH_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_PROJECT_NAME_LENGTH = 120;
const MAX_IMAGE_URL_LENGTH = 10 * 1024 * 1024;
const MAX_CANVAS_JSON_BYTES = 2 * 1024 * 1024;

export type ParsedProjectSaveInput = {
  id: string;
  name: string;
  canvasData: Record<string, unknown>;
  imageUrl: string | null;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function isPersistedProjectId(id: string): boolean {
  return UUIDISH_RE.test(id);
}

export function normalizeProjectName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.slice(0, MAX_PROJECT_NAME_LENGTH) : 'Untitled Project';
}

export function parseProjectSaveInput(input: {
  id: string;
  name: string;
  canvasData: unknown;
  imageUrl: unknown;
}): ParsedProjectSaveInput {
  assert(typeof input.id === 'string', 'Project id must be a string.');
  assert(input.id === 'new' || isPersistedProjectId(input.id), 'Project id is invalid.');
  assert(typeof input.name === 'string', 'Project name must be a string.');

  const normalizedCanvasData = normalizeCanvasPayload(input.canvasData);
  const canvasBytes = new TextEncoder().encode(JSON.stringify(normalizedCanvasData)).length;
  assert(canvasBytes <= MAX_CANVAS_JSON_BYTES, 'Canvas data exceeds the maximum allowed size.');

  const imageUrl =
    typeof input.imageUrl === 'string' && input.imageUrl.trim().length > 0
      ? input.imageUrl.trim()
      : null;

  if (imageUrl) {
    assert(imageUrl.length <= MAX_IMAGE_URL_LENGTH, 'Image reference is too large.');
    assert(
      imageUrl.startsWith('data:image/') ||
        imageUrl.startsWith('blob:') ||
        imageUrl.startsWith('http://') ||
        imageUrl.startsWith('https://') ||
        imageUrl.startsWith('/'),
      'Image reference must be a data URL, blob URL, relative path, or HTTP(S) URL.'
    );
  }

  return {
    id: input.id,
    name: normalizeProjectName(input.name),
    canvasData: normalizedCanvasData,
    imageUrl,
  };
}

export function parseProjectDeleteId(id: string): string {
  assert(typeof id === 'string' && isPersistedProjectId(id), 'Project id is invalid.');
  return id;
}
