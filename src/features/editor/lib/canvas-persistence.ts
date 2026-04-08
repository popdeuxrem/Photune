import { fabric } from 'fabric';
import { logInfo, logError, getErrorSummary } from '@/shared/lib/logging/logger';

export type CanvasPersistenceData = {
  canvasJson: string;
  imageUrl: string;
};

export type CanvasHydrationResult =
  | { success: true; image: string }
  | { success: false; error: string };

/**
 * Validate canvas JSON schema before hydration
 * Catches corrupted or tampered data before it hits Fabric.js
 */
function validateCanvasJson(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    
    // Check basic structure
    if (!parsed || typeof parsed !== 'object') return false;
    if (!('objects' in parsed) || !Array.isArray(parsed.objects)) return false;
    
    // Check for suspicious data
    if (parsed.objects.length > 10000) return false; // unreasonable object count
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Restore canvas from persisted JSON + image URL
 * Automatically falls back to empty canvas if data is corrupted
 */
export async function hydrateCanvasFromPersistence(
  canvas: fabric.Canvas,
  canvasJson: string,
  imageUrl: string,
  onImageLoaded?: (url: string) => void,
): Promise<CanvasHydrationResult> {
  try {
    // 1. Validate JSON structure
    if (!validateCanvasJson(canvasJson)) {
      logError({
        event: 'canvas_restore_invalid_json',
        surface: 'persistence',
        operation: 'canvas_restore',
        message: 'Canvas JSON failed validation',
      });
      return {
        success: false,
        error: 'Invalid canvas data',
      };
    }

    // 2. Load canvas from JSON
    await new Promise<void>((resolve, reject) => {
      canvas.loadFromJSON(canvasJson, () => {
        canvas.renderAll();
        logInfo({
          event: 'canvas_restore_json_loaded',
          surface: 'persistence',
          operation: 'canvas_restore',
          message: 'Canvas state restored from JSON',
        });
        resolve();
      }, (error: any) => {
        logError({
          event: 'canvas_restore_load_failed',
          surface: 'persistence',
          operation: 'canvas_restore',
          message: 'Failed to load canvas JSON',
          errorMessage: String(error),
        });
        reject(error);
      });
    });

    // 3. Load and restore background image
    if (imageUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          fabric.Image.fromURL(
            imageUrl,
            (imgObj) => {
              // Scale image to fit canvas
              const scale = Math.min(
                (canvas.width || 800) / imgObj.width!,
                (canvas.height || 600) / imgObj.height!,
              );
              
              imgObj.scale(scale);
              imgObj.selectable = false;
              imgObj.evented = false;
              imgObj.set({ opacity: 0.7 });
              
              // Send to back
              canvas.insertAt(imgObj, 0);
              canvas.renderAll();
              
              logInfo({
                event: 'canvas_restore_image_loaded',
                surface: 'persistence',
                operation: 'canvas_restore',
                message: 'Background image restored',
              });
              
              if (onImageLoaded) {
                onImageLoaded(imageUrl);
              }
              
              resolve();
            },
            undefined,
            { crossOrigin: 'anonymous' },
          );
        };
        
        img.onerror = () => {
          logError({
            event: 'canvas_restore_image_failed',
            surface: 'persistence',
            operation: 'canvas_restore',
            message: 'Failed to load background image',
          });
          resolve(); // Continue even if image fails
        };
        
        img.src = imageUrl;
      });
    }

    return { success: true, image: imageUrl };
  } catch (error) {
    logError({
      event: 'canvas_restore_exception',
      surface: 'persistence',
      operation: 'canvas_restore',
      ...getErrorSummary(error),
    });
    
    // Fallback: return empty canvas state
    return {
      success: false,
      error: `Restore failed: ${error instanceof Error ? error.message : 'unknown'}`,
    };
  }
}

/**
 * Extract current canvas state for persistence
 * Includes canvas JSON + uploaded image URL
 * Preserves layer metadata (photuneRole, photuneLayerId, locked state)
 */
export function extractCanvasToPersistence(
  canvas: fabric.Canvas,
  imageUrl: string,
): CanvasPersistenceData {
  // Include all Photune layer metadata in serialization
  const canvasJson = JSON.stringify(
    canvas.toJSON([
      'isImporting',
      'selectable',
      'hasControls',
      'evented',
      'lockMovementX',
      'lockMovementY',
      'lockRotation',
      'lockScalingX',
      'lockScalingY',
      // Photune layer system properties
      'photuneRole',
      'photuneLayerId',
      'photunePriority',
    ]),
  );

  return {
    canvasJson,
    imageUrl,
  };
}
