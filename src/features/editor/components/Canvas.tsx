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

    const handleSelection = (e: any) => setActiveObject(e.selected ? e.selected[0] : null);

    canvas.on({
      'selection:created': handleSelection,
      'selection:updated': handleSelection,
      'selection:cleared': () => setActiveObject(null),
      'object:modified': () => saveState(),
      'object:added': (e: any) => !e.target?.isImporting && saveState(),
    });

    setFabricCanvas(canvas);
    return () => { canvas.dispose(); };
  }, [setFabricCanvas, setActiveObject, saveState]);

  return <canvas ref={canvasRef} />;
}
