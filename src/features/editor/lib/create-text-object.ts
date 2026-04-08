import { fabric } from 'fabric';
import { inferLayerRoleForObject, tagLayerObject } from '@/features/editor/lib/layer-system';

type CreateTextObjectInput = {
  canvas: fabric.Canvas;
  text?: string;
};

export function createTextObject({
  canvas,
  text = 'New Text',
}: CreateTextObjectInput): fabric.IText | fabric.Textbox {
  const canvasWidth = canvas.getWidth() || 1200;
  const canvasHeight = canvas.getHeight() || 800;

  const textObject = new fabric.IText(text, {
    left: canvasWidth / 2,
    top: canvasHeight / 2,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 48,
    lineHeight: 1.16,
    charSpacing: 0,
    fill: '#111111',
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

  return textObject;
}