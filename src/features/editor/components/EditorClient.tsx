'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Sidebar } from './Toolbar/Sidebar';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { EditorShell } from './EditorShell';
import { fabric } from 'fabric';
import { useToast } from '@/shared/components/ui/use-toast';
import { EditorEmptyState } from './EditorEmptyState';
import { EditorIngestionStatus } from './EditorIngestionStatus';
import { EditorModeNav, type EditorMode } from './EditorModeNav';
import { validateImageUpload } from '@/shared/lib/security/upload-validation';
import { UploadModePanel } from './Panels/UploadModePanel';
import { ExportModePanel } from './Panels/ExportModePanel';
import { TextModePanel } from './Panels/TextModePanel';
import { EraseModePanel } from './Panels/EraseModePanel';
import { RewriteModePanel } from './Panels/RewriteModePanel';
import { BackgroundModePanel } from './Panels/BackgroundModePanel';
import { LayersModePanel } from './Panels/LayersModePanel';
import { EffectModePanel } from './Panels/EffectModePanel';
import {
  applyLayerLockState,
  inferLayerRoleForObject,
  tagLayerObject,
} from '@/features/editor/lib/layer-system';
import { createTextObject } from '@/features/editor/lib/create-text-object';
import { tryNormalizeCanvasPayload } from '@/features/editor/lib/canvas-serialization';

type EditorProjectData = {
  name?: string | null;
  canvas_data?: unknown;
  original_image_url?: string | null;
} | null;

interface EditorClientProps {
  projectId: string;
  initialProjectData: EditorProjectData;
}

function hydrateLayerMetadata(canvas: fabric.Canvas) {
  const objects = canvas.getObjects();

  objects.forEach((obj, index) => {
    const tagged = tagLayerObject(obj, inferLayerRoleForObject(obj), index, objects);
    if (tagged.photuneRole === 'background') {
      applyLayerLockState(tagged, true);
    }
  });
}

function loadBackgroundImage(canvas: fabric.Canvas, imageUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        try {
          img.set({ crossOrigin: 'anonymous' });
          tagLayerObject(img, 'background', 0, canvas.getObjects());
          applyLayerLockState(img, true);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width ? canvas.width / (img.width || 1) : 1,
            scaleY: canvas.height ? canvas.height / (img.height || 1) : 1,
          });
          canvas.renderAll();
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      { crossOrigin: 'anonymous' }
    );
  });
}

function loadCanvasJson(canvas: fabric.Canvas, canvasData: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const parsed = tryNormalizeCanvasPayload(canvasData);

    if (!parsed.ok) {
      reject(new Error(parsed.error));
      return;
    }

    (canvas as fabric.Canvas & { isImporting?: boolean }).isImporting = true;
    canvas.loadFromJSON(parsed.data, () => {
      try {
        hydrateLayerMetadata(canvas);
        canvas.renderAll();
        (canvas as fabric.Canvas & { isImporting?: boolean }).isImporting = false;
        resolve();
      } catch (error) {
        (canvas as fabric.Canvas & { isImporting?: boolean }).isImporting = false;
        reject(error);
      }
    });
  });
}

export function EditorClient({ projectId, initialProjectData }: EditorClientProps) {
  const {
    fabricCanvas,
    activeObject,
    saveState,
    replaceHistoryWithCurrentState,
    resetEditorSession,
    undo,
    redo,
    canUndo,
    canRedo,
    uploadedImageUrl,
    setUploadedImageUrl,
  } = useAppStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasContent, setHasContent] = useState(false);
  const [activeMode, setActiveMode] = useState<EditorMode>('upload');
  const [ingestionState, setIngestionState] = useState<
    'idle' | 'selecting' | 'uploading' | 'processing' | 'ready' | 'error'
  >('idle');
  const [ingestionMessage, setIngestionMessage] = useState('');
  const [ingestionError, setIngestionError] = useState('');
  const [pendingUploadUrl, setPendingUploadUrl] = useState<string | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const handleCanvasReady = useCallback(() => {
    setIsCanvasReady(true);
  }, []);

  const handleUploadClick = () => {
    setIngestionError('');
    setIngestionMessage('');
    setIngestionState('selecting');
    fileInputRef.current?.click();
  };

  const processUpload = useCallback(
    async (file: File) => {
      const validation = validateImageUpload(file);
      if (!validation.ok) {
        setIngestionState('error');
        setIngestionError(validation.message);
        toast({ title: validation.message || 'Invalid file', variant: 'destructive' });
        return;
      }

      setIngestionError('');
      setIngestionMessage('Preparing editor...');
      setIngestionState('processing');

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);

      const objectUrl = URL.createObjectURL(file);
      setPendingUploadUrl(objectUrl);
      setIngestionMessage('Waiting for editor to initialize...');
    },
    [setUploadedImageUrl, toast]
  );

  const handleUpdateTextStyle = useCallback(
    (input: {
      fontSize?: number;
      textAlign?: 'left' | 'center' | 'right' | 'justify';
      charSpacing?: number;
      lineHeight?: number;
    }) => {
      if (!fabricCanvas || !activeObject) return;

      const isTextObject =
        activeObject.type === 'i-text' ||
        activeObject.type === 'text' ||
        activeObject.type === 'textbox';

      if (!isTextObject) return;

      activeObject.set({
        fontSize:
          typeof input.fontSize === 'number' ? input.fontSize : (activeObject as any).fontSize,
        textAlign:
          typeof input.textAlign === 'string' ? input.textAlign : (activeObject as any).textAlign,
        charSpacing:
          typeof input.charSpacing === 'number'
            ? input.charSpacing
            : (activeObject as any).charSpacing,
        lineHeight:
          typeof input.lineHeight === 'number'
            ? input.lineHeight
            : (activeObject as any).lineHeight,
      } as Record<string, unknown>);

      fabricCanvas.renderAll();
      saveState();
    },
    [activeObject, fabricCanvas, saveState]
  );

  const handleUpdateTextEffects = useCallback(
    (input: {
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
      opacity?: number;
      shadowColor?: string;
      shadowBlur?: number;
      shadowOffsetX?: number;
      shadowOffsetY?: number;
    }) => {
      if (!fabricCanvas || !activeObject) return;

      const isTextObject =
        activeObject.type === 'i-text' ||
        activeObject.type === 'text' ||
        activeObject.type === 'textbox';

      if (!isTextObject) return;

      const textObject = activeObject as fabric.IText | fabric.Text | fabric.Textbox;

      if (typeof input.fill === 'string') {
        textObject.fill = input.fill;
      }

      if (typeof input.stroke === 'string') {
        textObject.stroke = input.stroke;
      }

      if (typeof input.strokeWidth === 'number') {
        textObject.strokeWidth = input.strokeWidth;
      }

      if (typeof input.opacity === 'number') {
        textObject.opacity = input.opacity;
      }

      const nextShadowColor =
        typeof input.shadowColor === 'string'
          ? input.shadowColor
          : ((textObject.shadow as fabric.Shadow | undefined)?.color as string | undefined) ||
            '#000000';

      const nextShadowBlur =
        typeof input.shadowBlur === 'number'
          ? input.shadowBlur
          : ((textObject.shadow as fabric.Shadow | undefined)?.blur ?? 0);

      const nextShadowOffsetX =
        typeof input.shadowOffsetX === 'number'
          ? input.shadowOffsetX
          : ((textObject.shadow as fabric.Shadow | undefined)?.offsetX ?? 0);

      const nextShadowOffsetY =
        typeof input.shadowOffsetY === 'number'
          ? input.shadowOffsetY
          : ((textObject.shadow as fabric.Shadow | undefined)?.offsetY ?? 0);

      const shouldApplyShadow =
        nextShadowBlur > 0 || nextShadowOffsetX !== 0 || nextShadowOffsetY !== 0;

      (textObject.shadow as fabric.Shadow | null | undefined) = shouldApplyShadow
        ? new fabric.Shadow({
            color: nextShadowColor,
            blur: nextShadowBlur,
            offsetX: nextShadowOffsetX,
            offsetY: nextShadowOffsetY,
          })
        : null;

      fabricCanvas.renderAll();
      saveState();
    },
    [activeObject, fabricCanvas, saveState]
  );

  const handleAddText = useCallback(() => {
    if (!fabricCanvas) return;

    createTextObject({
      canvas: fabricCanvas,
      text: 'New Text',
    });

    saveState();
    setActiveMode('text');
  }, [fabricCanvas, saveState]);

  const handleApplyFontSuggestion = useCallback(
    (input: { family: string; weight: string }) => {
      if (!fabricCanvas || !activeObject) return;

      const isTextObject =
        activeObject.type === 'i-text' ||
        activeObject.type === 'text' ||
        activeObject.type === 'textbox';

      if (!isTextObject) return;

      const textObject = activeObject as fabric.IText | fabric.Text | fabric.Textbox;
      textObject.fontFamily = input.family;
      textObject.fontWeight = input.weight;

      fabricCanvas.renderAll();
      saveState();
    },
    [activeObject, fabricCanvas, saveState]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) {
        setIngestionState('idle');
        return;
      }

      await processUpload(file);
      e.target.value = '';
    },
    [processUpload]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!fabricCanvas) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey && !e.metaKey) {
        const activeObjects = fabricCanvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach((obj) => fabricCanvas.remove(obj));
          fabricCanvas.discardActiveObject();
          fabricCanvas.renderAll();
          saveState();
          e.preventDefault();
        }
        return;
      }

      if (ctrlKey && e.key === 'z' && !e.shiftKey) {
        if (canUndo()) {
          undo();
          e.preventDefault();
        }
        return;
      }

      if ((ctrlKey && e.key === 'y') || (ctrlKey && e.shiftKey && e.key === 'z')) {
        if (canRedo()) {
          redo();
          e.preventDefault();
        }
        return;
      }

      if (ctrlKey && e.key === 's') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('photune-save'));
        return;
      }

      if (ctrlKey && e.key === 'd') {
        const selectedObject = fabricCanvas.getActiveObject();
        if (selectedObject) {
          selectedObject.clone((cloned: fabric.Object) => {
            cloned.set({
              left: (cloned.left || 0) + 20,
              top: (cloned.top || 0) + 20,
            });
            fabricCanvas.add(cloned);
            fabricCanvas.setActiveObject(cloned);
            fabricCanvas.renderAll();
            saveState();
          });
          e.preventDefault();
        }
        return;
      }

      if (ctrlKey && e.key === 'a') {
        fabricCanvas.discardActiveObject();
        const objects = fabricCanvas.getObjects();
        if (objects.length > 0) {
          const selection = new fabric.ActiveSelection(objects, { canvas: fabricCanvas });
          fabricCanvas.setActiveObject(selection);
          fabricCanvas.renderAll();
        }
        e.preventDefault();
        return;
      }

      if (e.key === 'Escape') {
        fabricCanvas.discardActiveObject();
        fabricCanvas.renderAll();
      }
    },
    [fabricCanvas, saveState, undo, redo, canUndo, canRedo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    resetEditorSession();
  }, [projectId, resetEditorSession]);

  useEffect(() => {
    if (!fabricCanvas) return;

    let cancelled = false;

    const restore = async () => {
      const originalImageUrl = initialProjectData?.original_image_url || null;
      const serializedCanvas = initialProjectData?.canvas_data;

      try {
        if (serializedCanvas) {
          await loadCanvasJson(fabricCanvas, serializedCanvas);

          if (cancelled) return;

          if (originalImageUrl) {
            setUploadedImageUrl(originalImageUrl);
          }

          setHasContent(fabricCanvas.getObjects().length > 0 || Boolean(fabricCanvas.backgroundImage));
          replaceHistoryWithCurrentState();
          return;
        }

        if (originalImageUrl) {
          await loadBackgroundImage(fabricCanvas, originalImageUrl);

          if (cancelled) return;

          setUploadedImageUrl(originalImageUrl);
          setHasContent(true);
          replaceHistoryWithCurrentState();
        }
      } catch (error) {
        console.error('[editor-restore] failed:', error);

        if (!cancelled && originalImageUrl) {
          try {
            fabricCanvas.clear();
            await loadBackgroundImage(fabricCanvas, originalImageUrl);
            setUploadedImageUrl(originalImageUrl);
            setHasContent(true);
            replaceHistoryWithCurrentState();
            toast({
              title: 'Project restored with fallback image only',
              description: 'Saved canvas data was invalid, so Photune recovered the original image.',
              variant: 'destructive',
            });
            return;
          } catch (fallbackError) {
            console.error('[editor-restore:fallback] failed:', fallbackError);
          }
        }

        if (!cancelled) {
          fabricCanvas.clear();
          setHasContent(false);
          replaceHistoryWithCurrentState();
          toast({
            title: 'Project restore failed',
            description: 'The saved canvas data was invalid or incomplete.',
            variant: 'destructive',
          });
        }
      }
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, [
    fabricCanvas,
    initialProjectData,
    replaceHistoryWithCurrentState,
    setUploadedImageUrl,
    toast,
  ]);

  useEffect(() => {
    if (fabricCanvas) {
      const bg = fabricCanvas.backgroundImage;
      if (bg && !hasContent) {
        setHasContent(true);
      }
    }
  }, [fabricCanvas, hasContent]);

  useEffect(() => {
    if (!isCanvasReady || !pendingUploadUrl || !fabricCanvas) return;

    const applyPendingImage = async () => {
      try {
        await loadBackgroundImage(fabricCanvas, pendingUploadUrl);
        setHasContent(true);
        setPendingUploadUrl(null);
        setIngestionState('ready');
        setIngestionMessage('');
        replaceHistoryWithCurrentState();
        URL.revokeObjectURL(pendingUploadUrl);
      } catch (error) {
        console.error('[upload] failed to load pending image', error);
        setPendingUploadUrl(null);
        setIngestionState('error');
        setIngestionError('Failed to load the image. Please try again.');
      }
    };

    void applyPendingImage();
  }, [isCanvasReady, pendingUploadUrl, fabricCanvas, replaceHistoryWithCurrentState]);

  useEffect(() => {
    if (hasContent) {
      setIngestionState((current) => (current === 'idle' ? current : 'ready'));
      setIngestionError('');
      setIngestionMessage('');
    }
  }, [hasContent]);

  const activePanel = (() => {
    switch (activeMode) {
      case 'upload':
        return <UploadModePanel hasContent={hasContent} onUploadClick={handleUploadClick} />;
      case 'export':
        return <ExportModePanel hasContent={hasContent} />;
      case 'text':
        return (
          <TextModePanel
            hasContent={hasContent}
            hasTextSelected={
              activeObject?.type === 'i-text' ||
              activeObject?.type === 'text' ||
              activeObject?.type === 'textbox'
            }
            imageDataUrl={uploadedImageUrl || initialProjectData?.original_image_url || null}
            onAddText={handleAddText}
            onApplyFontSuggestion={handleApplyFontSuggestion}
            selectedTextStyle={{
              fontSize: (activeObject as any)?.fontSize || 40,
              textAlign: (activeObject as any)?.textAlign || 'left',
              charSpacing: (activeObject as any)?.charSpacing || 0,
              lineHeight: (activeObject as any)?.lineHeight || 1.16,
            }}
            onUpdateTextStyle={handleUpdateTextStyle}
          />
        );
      case 'erase':
        return <EraseModePanel hasContent={hasContent} />;
      case 'effect':
        return (
          <EffectModePanel
            hasContent={hasContent}
            hasTextSelected={
              activeObject?.type === 'i-text' ||
              activeObject?.type === 'text' ||
              activeObject?.type === 'textbox'
            }
            selectedTextEffects={{
              fill: (activeObject as any)?.fill || '#111111',
              stroke: (activeObject as any)?.stroke || '#000000',
              strokeWidth: (activeObject as any)?.strokeWidth || 0,
              opacity: (activeObject as any)?.opacity ?? 1,
              shadowColor: ((activeObject as any)?.shadow as any)?.color || '#000000',
              shadowBlur: ((activeObject as any)?.shadow as any)?.blur ?? 0,
              shadowOffsetX: ((activeObject as any)?.shadow as any)?.offsetX ?? 0,
              shadowOffsetY: ((activeObject as any)?.shadow as any)?.offsetY ?? 0,
            }}
            onUpdateTextEffects={handleUpdateTextEffects}
          />
        );
      case 'rewrite':
        return <RewriteModePanel hasContent={hasContent} canRewrite={false} />;
      case 'background':
        return <BackgroundModePanel hasContent={hasContent} />;
      case 'layers':
        return <LayersModePanel hasContent={hasContent} hasObjectSelection={false} />;
      default:
        return <Sidebar />;
    }
  })();

  return (
    <EditorShell
      header={<Header projectId={projectId} projectName={initialProjectData?.name || 'Untitled Project'} />}
      sidebar={<Sidebar />}
      panel={activePanel}
      mobilePanel={activePanel}
      mobileModeNav={<EditorModeNav activeMode={activeMode} onModeChange={setActiveMode} />}
      canvas={
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-auto bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="relative shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all duration-500 ease-in-out">
              <Canvas onReady={handleCanvasReady} />
            </div>

            {!hasContent && ingestionState === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <EditorEmptyState onUploadClick={handleUploadClick} />
              </div>
            )}

            {(ingestionState === 'uploading' || ingestionState === 'processing') && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/90 dark:bg-zinc-900/90">
                <EditorIngestionStatus state={ingestionState} message={ingestionMessage} />
              </div>
            )}

            {ingestionState === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <EditorIngestionStatus
                  state="error"
                  errorMessage={ingestionError}
                  onRetry={handleUploadClick}
                />
              </div>
            )}
          </main>
        </>
      }
    />
  );
}
