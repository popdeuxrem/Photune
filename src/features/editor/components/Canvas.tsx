'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useAppStore } from '@/shared/store/useAppStore';
import { applyLayerLockState, inferLayerRoleForObject, isLayerLocked, tagLayerObject } from '@/features/editor/lib/layer-system';

interface CanvasProps {
  onReady?: () => void;
}

export function Canvas({ onReady }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setFabricCanvas, setActiveObject, saveState } = useAppStore();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Initialize Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      imageSmoothingEnabled: true,
    });

    // 2. Setup Global Object Styling (matching photext.shop)
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#2563eb', // Blue-600
      cornerStyle: 'circle',
      borderColor: '#2563eb',
      cornerSize: 8,
      padding: 4,
      borderDashArray: [3, 3]
    });

    // 3. Selection Events
    const handleSelection = (event: fabric.IEvent) => {
      const selected = event.selected?.[0] || canvas.getActiveObject() || null;

      if (selected && isLayerLocked(selected)) {
        canvas.discardActiveObject();
        canvas.renderAll();
        setActiveObject(null);
        return;
      }

      setActiveObject(selected);
    };

    const handleSelectionCleared = () => {
      setActiveObject(null);
    };

    const handleMouseDown = (event: fabric.IEvent) => {
      const target = event.target || null;
      if (!target) return;

      if (isLayerLocked(target)) {
        canvas.discardActiveObject();
        canvas.renderAll();
        setActiveObject(null);
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('mouse:down', handleMouseDown);

    // 4. Persistence & History Events
    canvas.on('object:modified', () => saveState());
    canvas.on('object:added', (event: fabric.IEvent) => {
      const target = event.target as (fabric.Object & { isImporting?: boolean }) | undefined;
      if (!target) return;

      const objects = canvas.getObjects();
      const index = objects.indexOf(target);
      tagLayerObject(
        target,
        inferLayerRoleForObject(target),
        index >= 0 ? index : 0,
        objects
      );

      if (!target.isImporting) {
        saveState();
      }
    });

    // 5. Delete Logic (Backspace/Delete keys)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && 
          !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        const active = canvas.getActiveObjects();
        if (active.length > 0) {
          active.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject().renderAll();
          saveState();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setFabricCanvas(canvas);
    console.log('[canvas] fabricCanvas initialized and stored in zustand');
    
    // Signal canvas is ready
    if (onReady) {
      setTimeout(() => onReady(), 0);
    }

    // 6. Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('object:modified', () => saveState());
      canvas.off('object:added', (e: fabric.IEvent) => {
        const target = e.target as (fabric.Object & { isImporting?: boolean }) | undefined;
        if (!target) return;
        const index = canvas.getObjects().indexOf(target);
        tagLayerObject(target, inferLayerRoleForObject(target), index >= 0 ? index : 0);
        if (!target.isImporting) saveState();
      });
      canvas.dispose();
    };
  }, [setFabricCanvas, setActiveObject, saveState, onReady]);

  return (
    <div ref={containerRef} className="canvas-shadow bg-white rounded shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-zinc-200">
      <canvas ref={canvasRef} />
      <style jsx global>{`
        .canvas-container { margin: 0 auto !important; }
        .canvas-shadow { transition: transform 0.2s ease-out; }
      `}</style>
    </div>
  );
}
