import { normalizeCanvasPayload } from './canvas-serialization';
import {
  isPersistedProjectId,
  normalizeProjectName,
  normalizeImageReference,
  assertCanvasDataSerializable,
} from '@/shared/lib/persistence/project-guards';

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

export function parseProjectSaveInput(input: {
  id: string;
  name: string;
  canvasData: unknown;
  imageUrl: unknown;
}): ParsedProjectSaveInput {
  assert(typeof input.id === 'string', 'Project id must be a string.');
  assert(input.id === 'new' || isPersistedProjectId(input.id), 'Project id is invalid.');
  assert(typeof input.name === 'string', 'Project name must be a string.');

  // Normalize and validate canvas payload using the shared guards (single source of truth)
  const normalizedCanvasData = normalizeCanvasPayload(input.canvasData);
  assertCanvasDataSerializable(normalizedCanvasData);

  const imageUrl = normalizeImageReference(input.imageUrl);

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
