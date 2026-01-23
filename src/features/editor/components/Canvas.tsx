'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useAppStore } from '@/shared/store/useAppStore';

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setFabricCanvas, setActiveObject, saveState } = useAppStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    const updateSelection = (e: any) => {
      setActiveObject(e.selected ? e.selected[0] : null);
    };

    canvas.on({
      'selection:created': updateSelection,
      'selection:updated': updateSelection,
      'selection:cleared': () => setActiveObject(null),
      'object:modified': () => saveState(),
      'object:added': (e) => !e.target?.get('isImporting') && saveState(),
    });

    // Keyboard support: Delete/Backspace
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        const active = canvas.getActiveObject();
        if (active && !active.isEditing) {
          canvas.remove(active);
          canvas.discardActiveObject().renderAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setFabricCanvas(canvas);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, [setFabricCanvas, setActiveObject, saveState]);

  return <canvas ref={canvasRef} />;
}
