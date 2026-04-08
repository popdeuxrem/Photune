export const EDITOR_PROJECT_SELECT =
  'id, name, canvas_data, original_image_url, updated_at' as const;

export type EditorProjectRecord = {
  id: string;
  name: string | null;
  canvas_data: unknown;
  original_image_url: string | null;
  updated_at: string | null;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isAllowedEditorProjectId(value: string): boolean {
  return value === 'new' || UUID_RE.test(value);
}

export function isEditorProjectRecord(value: unknown): value is EditorProjectRecord {
  if (!isRecord(value)) return false;

  const id = value.id;
  const name = value.name;
  const originalImageUrl = value.original_image_url;
  const updatedAt = value.updated_at;

  return (
    typeof id === 'string' &&
    (typeof name === 'string' || name === null) &&
    (typeof originalImageUrl === 'string' || originalImageUrl === null) &&
    (typeof updatedAt === 'string' || updatedAt === null)
  );
}

export function coerceEditorProjectRecord(value: unknown): EditorProjectRecord {
  if (!isEditorProjectRecord(value)) {
    throw new Error('Project payload does not match the editor contract.');
  }

  return value;
}
