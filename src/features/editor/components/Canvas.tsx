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
      stopContextMenu: true, // Prevents browser menu on right click
    });

    const handleSelection = (e: any) => {
      setActiveObject(e.selected ? e.selected[0] : null);
    };

    // Attach Event Listeners
    canvas.on({
      'selection:created': handleSelection,
      'selection:updated': handleSelection,
      'selection:cleared': () => setActiveObject(null),
      'object:modified': () => saveState(),
      'object:added': (e: any) => {
        // Prevents history entry when objects are added via OCR/initial load
        if (!e.target?.isImporting) {
          saveState();
        }
      },
      // Optional: Handle object scaling/moving for real-time state if needed
      'object:moving': (e: any) => {
          e.target.setCoords();
      },
    });

    // Keyboard Delete Support
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && 
          !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        const active = canvas.getActiveObject();
        if (active && !active.isEditing) {
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
