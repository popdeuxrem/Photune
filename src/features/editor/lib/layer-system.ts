import { fabric } from 'fabric';

export type LayerRole = 'background' | 'heal' | 'mask' | 'vector' | 'text';

const ROLE_PRIORITY: Record<LayerRole, number> = {
  background: 0,
  heal: 100,
  mask: 200,
  vector: 300,
  text: 1000,
};

export type LayerObject = fabric.Object & {
  photuneRole?: LayerRole;
  photuneId?: string;
  locked?: boolean;
};

export function getLayerRole(obj: fabric.Object | null | undefined): LayerRole {
  if (!obj) return 'vector';

  const typed = obj as LayerObject;
  if (typed.photuneRole) return typed.photuneRole;

  if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
    return 'text';
  }

  return 'vector';
}

export function getLayerPriority(obj: fabric.Object | null | undefined): number {
  return ROLE_PRIORITY[getLayerRole(obj)];
}

export function getLayerLabel(obj: fabric.Object, index: number): string {
  const typed = obj as LayerObject;

  if (typed.photuneId) return typed.photuneId;

  const role = getLayerRole(obj);
  return `${role}_${String(index + 1).padStart(2, '0')}`;
}

export function assignLayerMetadata(obj: fabric.Object, index: number): LayerObject {
  const typed = obj as LayerObject;

  if (!typed.photuneRole) {
    typed.photuneRole = getLayerRole(obj);
  }

  if (!typed.photuneId) {
    typed.photuneId = getLayerLabel(obj, index);
  }

  if (typeof typed.locked !== 'boolean') {
    typed.locked = false;
  }

  return typed;
}

export function sortCanvasObjectsBySemanticRole(objects: fabric.Object[]): fabric.Object[] {
  return [...objects].sort((a, b) => {
    const priorityDiff = getLayerPriority(a) - getLayerPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return 0;
  });
}

export function enforceSemanticOrder(canvas: fabric.Canvas) {
  const ordered = sortCanvasObjectsBySemanticRole(canvas.getObjects());

  ordered.forEach((obj, index) => {
    canvas.moveTo(obj, index);
  });

  canvas.renderAll();
}

export function tagLayerObject(
  obj: fabric.Object,
  role?: LayerRole,
  index: number = 0,
  objects: fabric.Object[] = []
): LayerObject {
  const typed = obj as LayerObject;

  if (role && !typed.photuneRole) {
    typed.photuneRole = role;
  }

  assignLayerMetadata(typed, index);

  if (objects.length > 0 && !typed.photuneId) {
    typed.photuneId = getLayerLabelFromObjects(obj, objects, index);
  }

  return typed;
}

export function getLayerLabelFromObjects(
  obj: fabric.Object,
  objects: fabric.Object[],
  index: number
): string {
  const role = getLayerRole(obj);
  const prefix = `${role}_`;
  
  const existingIds = objects
    .map((o) => (o as LayerObject).photuneId)
    .filter((id): id is string => typeof id === 'string' && id.startsWith(prefix));

  const existingNumbers = existingIds.map((id) => {
    const match = id.match(/_(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const nextNumber = index + 1;
  const useNumber = nextNumber > maxNumber ? nextNumber : maxNumber + 1;

  return `${role}_${String(useNumber).padStart(2, '0')}`;
}

export function inferLayerRoleForObject(obj: fabric.Object): LayerRole {
  if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
    return 'text';
  }

  return 'vector';
}

export function applyLayerLockState(obj: fabric.Object, locked: boolean): LayerObject {
  const typed = obj as LayerObject;
  typed.locked = locked;

  obj.set({
    selectable: !locked,
    evented: !locked,
  });

  return typed;
}

export function isLayerLocked(obj: fabric.Object | null | undefined): boolean {
  if (!obj) return false;
  return (obj as LayerObject).locked === true;
}