'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useAppStore } from '@/shared/store/useAppStore';

export function Canvas() {
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
    canvas.on('selection:created', (e) => setActiveObject(e.selected?.[0] || null));
    canvas.on('selection:updated', (e) => setActiveObject(e.selected?.[0] || null));
    canvas.on('selection:cleared', () => setActiveObject(null));

    // 4. Persistence & History Events
    canvas.on('object:modified', () => saveState());
    canvas.on('object:added', (e: any) => {
      if (e.target && !e.target.isImporting) saveState();
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

    // 6. Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, [setFabricCanvas, setActiveObject, saveState]);

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
