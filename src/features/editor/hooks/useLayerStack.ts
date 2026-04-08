'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fabric } from 'fabric';
import { useAppStore } from '@/shared/store/useAppStore';
import {
  applyLayerLockState,
  assignLayerMetadata,
  enforceSemanticOrder,
  getLayerLabel,
  getLayerRole,
  type LayerObject,
} from '@/features/editor/lib/layer-system';

export type LayerEntry = {
  id: string;
  label: string;
  role: ReturnType<typeof getLayerRole>;
  visible: boolean;
  locked: boolean;
  index: number;
  object: LayerObject;
};

export function useLayerStack() {
  const { fabricCanvas, activeObject, setActiveObject, saveState } = useAppStore();
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleRefresh = () => refresh();

    fabricCanvas.on('object:added', handleRefresh);
    fabricCanvas.on('object:removed', handleRefresh);
    fabricCanvas.on('object:modified', handleRefresh);
    fabricCanvas.on('selection:created', handleRefresh);
    fabricCanvas.on('selection:updated', handleRefresh);
    fabricCanvas.on('selection:cleared', handleRefresh);

    refresh();

    return () => {
      fabricCanvas.off('object:added', handleRefresh);
      fabricCanvas.off('object:removed', handleRefresh);
      fabricCanvas.off('object:modified', handleRefresh);
      fabricCanvas.off('selection:created', handleRefresh);
      fabricCanvas.off('selection:updated', handleRefresh);
      fabricCanvas.off('selection:cleared', handleRefresh);
    };
  }, [fabricCanvas, refresh]);

  const layers = useMemo<LayerEntry[]>(() => {
    if (!fabricCanvas) return [];

    const objects = fabricCanvas.getObjects();

    return [...objects]
      .map((obj, index) => {
        const typed = assignLayerMetadata(obj, index);
        return {
          id: typed.photuneId || getLayerLabel(obj, index),
          label: typed.photuneId || getLayerLabel(obj, index),
          role: getLayerRole(obj),
          visible: obj.visible !== false,
          locked: typed.locked === true,
          index,
          object: typed,
        };
      })
      .reverse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricCanvas, version]);

  const selectLayer = useCallback(
    (entry: LayerEntry) => {
      if (!fabricCanvas) return;
      fabricCanvas.setActiveObject(entry.object);
      setActiveObject(entry.object);
      fabricCanvas.renderAll();
      refresh();
    },
    [fabricCanvas, refresh, setActiveObject]
  );

  const toggleVisibility = useCallback(
    (entry: LayerEntry) => {
      if (!fabricCanvas) return;
      entry.object.set('visible', !(entry.object.visible !== false));
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      saveState();
      refresh();
    },
    [fabricCanvas, refresh, saveState]
  );

  const toggleLock = useCallback(
    (entry: LayerEntry) => {
      if (!fabricCanvas) return;

      const nextLocked = !(entry.object.locked === true);
      applyLayerLockState(entry.object, nextLocked);

      if (activeObject === entry.object && nextLocked) {
        fabricCanvas.discardActiveObject();
        setActiveObject(null);
      }

      fabricCanvas.renderAll();
      saveState();
      refresh();
    },
    [activeObject, fabricCanvas, refresh, saveState, setActiveObject]
  );

  const moveLayer = useCallback(
    (entry: LayerEntry, direction: 'up' | 'down') => {
      if (!fabricCanvas) return;

      if (direction === 'up') {
        entry.object.bringForward();
      } else {
        entry.object.sendBackwards();
      }

      enforceSemanticOrder(fabricCanvas);
      saveState();
      refresh();
    },
    [fabricCanvas, refresh, saveState]
  );

  const deleteLayer = useCallback(
    (entry: LayerEntry) => {
      if (!fabricCanvas) return;

      fabricCanvas.remove(entry.object);
      fabricCanvas.discardActiveObject();
      setActiveObject(null);
      fabricCanvas.renderAll();
      saveState();
      refresh();
    },
    [fabricCanvas, refresh, saveState, setActiveObject]
  );

  return {
    layers,
    selectLayer,
    toggleVisibility,
    toggleLock,
    moveLayer,
    deleteLayer,
  };
}