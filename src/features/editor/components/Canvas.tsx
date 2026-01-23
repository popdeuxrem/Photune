'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useAppStore } from '@/shared/store/useAppStore';

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setFabricCanvas, setActiveObject, saveState } = useAppStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the Fabric.js Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      stopContextMenu: true, 
    });

    const handleSelection = (e: fabric.IEvent) => {
      setActiveObject(e.selected ? e.selected[0] : null);
    };

    // Attach Event Listeners individually to satisfy TS definitions
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setActiveObject(null));
    canvas.on('object:modified', () => saveState());
    
    canvas.on('object:added', (e: any) => {
      // Prevents history entry when objects are added via OCR/initial load
      if (e.target && !e.target.isImporting) {
        saveState();
      }
    });

    canvas.on('object:moving', (e: any) => {
      if (e.target) {
        e.target.setCoords();
      }
    });

    // Keyboard Delete Support
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && 
          !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        const active = canvas.getActiveObject();
        if (active && !(active as any).isEditing) {
          canvas.remove(active);
          canvas.discardActiveObject().renderAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setFabricCanvas(canvas);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, [setFabricCanvas, setActiveObject, saveState]);

  return (
    <div className="canvas-container shadow-2xl overflow-hidden rounded-sm border border-zinc-200">
      <canvas ref={canvasRef} />
    </div>
  );
}
