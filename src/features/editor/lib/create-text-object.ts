import { fabric } from 'fabric';
import { inferLayerRoleForObject, tagLayerObject } from '@/features/editor/lib/layer-system';
import { getDefaultTextFill, sampleImageColorAtPoint } from '@/features/editor/lib/color-sampling';

type CreateTextObjectInput = {
  canvas: fabric.Canvas;
  text?: string;
};

type EditableTextObject = fabric.IText | fabric.Textbox;

/**
 * Focus hidden textarea and select all text with retry logic
 * Handles timing issues where textarea may not be ready immediately
 */
function focusHiddenTextarea(textObject: EditableTextObject, retries = 0) {
  const textarea = (textObject as EditableTextObject & { hiddenTextarea?: HTMLTextAreaElement | null })
    .hiddenTextarea;

  if (!textarea) {
    // Retry if textarea not yet available (timing issue)
    if (retries < 3) {
      setTimeout(() => focusHiddenTextarea(textObject, retries + 1), 50);
    }
    return;
  }

  try {
    // Check if textarea is actually in the DOM and visible
    if (!document.contains(textarea)) {
      if (retries < 3) {
        setTimeout(() => focusHiddenTextarea(textObject, retries + 1), 50);
      }
      return;
    }

    textarea.focus();
    textarea.setSelectionRange(0, textarea.value.length);
    console.log('[text-edit] textarea focused and text selected');
  } catch (err) {
    console.error('[text-edit] failed to focus textarea:', err);
    if (retries < 3) {
      setTimeout(() => focusHiddenTextarea(textObject, retries + 1), 50);
    }
  }
}

export function createTextObject({
  canvas,
  text = 'New Text',
}: CreateTextObjectInput): EditableTextObject {
  const canvasWidth = canvas.getWidth() || 1200;
  const canvasHeight = canvas.getHeight() || 800;

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const sampledFill = sampleImageColorAtPoint({
    canvas,
    x: centerX,
    y: centerY,
    radius: 18,
  });

  const textObject = new fabric.IText(text, {
    left: centerX,
    top: centerY,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 48,
    lineHeight: 1.16,
    charSpacing: 0,
    fill: sampledFill || getDefaultTextFill(),
    editable: true,
  });

  canvas.add(textObject);

  const objects = canvas.getObjects();
  const index = objects.indexOf(textObject);

  tagLayerObject(
    textObject,
    inferLayerRoleForObject(textObject),
    index >= 0 ? index : 0,
    objects
  );

  canvas.setActiveObject(textObject);
  canvas.renderAll();

  // Delayed setup to ensure canvas is ready and object is properly added
  // Use single RAF instead of nested to avoid race conditions
  requestAnimationFrame(() => {
    try {
      // Verify object is still on canvas
      if (!canvas.contains(textObject)) {
        console.warn('[text-edit] object removed from canvas during setup');
        return;
      }

      // Re-set active object to ensure it's current
      canvas.setActiveObject(textObject);

      // Check if not already editing before calling enterEditing
      if (!textObject.isEditing) {
        textObject.enterEditing();
        console.log('[text-edit] entered editing mode');
      }

      // Select all text with error handling
      if (textObject.isEditing) {
        try {
          textObject.selectAll();
          console.log('[text-edit] text selected');
        } catch (err) {
          console.warn('[text-edit] selectAll failed:', err);
        }
      }

      canvas.renderAll();

      // Defer textarea focus to next frame to ensure textarea is DOM-ready
      requestAnimationFrame(() => {
        focusHiddenTextarea(textObject);
      });
    } catch (err) {
      console.error('[text-edit] error during text object setup:', err);
    }
  });

  return textObject;
}
