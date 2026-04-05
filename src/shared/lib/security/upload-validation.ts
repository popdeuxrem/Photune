export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export type UploadValidationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      code: 'missing_file' | 'empty_file' | 'unsupported_type' | 'file_too_large';
      message: string;
    };

export function validateImageUpload(file: File | null | undefined): UploadValidationResult {
  if (!file) {
    return {
      ok: false,
      code: 'missing_file',
      message: 'No file was provided.',
    };
  }

  if (file.size === 0) {
    return {
      ok: false,
      code: 'empty_file',
      message: 'The selected file is empty.',
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      code: 'file_too_large',
      message: 'The selected file exceeds the 10 MB upload limit.',
    };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return {
      ok: false,
      code: 'unsupported_type',
      message: 'Only PNG, JPEG, and WebP images are supported.',
    };
  }

  return { ok: true };
}