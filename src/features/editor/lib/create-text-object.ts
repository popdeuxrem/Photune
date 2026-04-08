import { fabric } from 'fabric';
import { inferLayerRoleForObject, tagLayerObject } from '@/features/editor/lib/layer-system';
import { getDefaultTextFill, sampleImageColorAtPoint } from '@/features/editor/lib/color-sampling';
import { getTextEffectDefaults } from '@/features/editor/lib/text-effect-defaults';

type CreateTextObjectInput = {
  canvas: fabric.Canvas;
  text?: string;
};

type EditableTextObject = fabric.IText | fabric.Textbox;

function focusHiddenTextarea(textObject: EditableTextObject) {
  const textarea = (textObject as EditableTextObject & { hiddenTextarea?: HTMLTextAreaElement | null })
    .hiddenTextarea;

  if (!textarea) return;

  textarea.focus();

  try {
    textarea.setSelectionRange(0, textarea.value.length);
  } catch {
    // no-op
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

  const resolvedFill = sampledFill || getDefaultTextFill();
  const defaults = getTextEffectDefaults(resolvedFill);

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
    fill: resolvedFill,
    stroke: defaults.stroke,
    strokeWidth: defaults.strokeWidth,
    shadow: defaults.shadow as fabric.Shadow | undefined,
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

  requestAnimationFrame(() => {
    canvas.setActiveObject(textObject);
    textObject.enterEditing();

    try {
      textObject.selectAll();
    } catch {
      // no-op
    }

    canvas.renderAll();

    requestAnimationFrame(() => {
      focusHiddenTextarea(textObject);
    });
  });

  return textObject;
}