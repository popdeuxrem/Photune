'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Sidebar } from './Toolbar/Sidebar';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { JobStatusPanel } from './JobStatusPanel';
import { EditorShell } from './EditorShell';
import { fabric } from 'fabric';
import { useToast } from '@/shared/components/ui/use-toast';
import { EditorEmptyState } from './EditorEmptyState';
import { EditorIngestionStatus } from './EditorIngestionStatus';
import { EditorModeNav, type EditorMode } from './EditorModeNav';
import { validateImageUpload, MAX_UPLOAD_BYTES } from '@/shared/lib/security/upload-validation';
import { UploadModePanel } from './Panels/UploadModePanel';
import { ExportModePanel } from './Panels/ExportModePanel';
import { TextModePanel } from './Panels/TextModePanel';
import { EraseModePanel } from './Panels/EraseModePanel';
import { RewriteModePanel } from './Panels/RewriteModePanel';
import { BackgroundModePanel } from './Panels/BackgroundModePanel';
import { LayersModePanel } from './Panels/LayersModePanel';
import { EffectModePanel } from './Panels/EffectModePanel';
import { applyLayerLockState, inferLayerRoleForObject, tagLayerObject } from '@/features/editor/lib/layer-system';
import { createTextObject } from '@/features/editor/lib/create-text-object';
import { autoSaveProject } from '@/shared/lib/auto-save';
import { extractCanvasToPersistence, hydrateCanvasFromPersistence } from '@/features/editor/lib/canvas-persistence';
import { ConflictResolutionDialog } from './ConflictResolutionDialog';

interface EditorClientProps {
  projectId: string;
  initialProjectData: any;
}

export function EditorClient({ projectId, initialProjectData }: EditorClientProps) {
  const { fabricCanvas, activeObject, saveState, undo, redo, canUndo, canRedo, uploadedImageUrl, setUploadedImageUrl } = useAppStore();
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
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState<string | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<string | null>(initialProjectData?.updated_at || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCanvasReady = useCallback(() => {
    console.log('[canvas] ready signal received');
    setIsCanvasReady(true);
  }, []);

  const handleUploadClick = () => {
    setIngestionError('');
    setIngestionMessage('');
    setIngestionState('selecting');
    fileInputRef.current?.click();
  };

  const processUpload = useCallback(async (file: File) => {
    const validation = validateImageUpload(file);
    if (!validation.ok) {
      console.log('[upload] validation failed:', validation.message);
      setIngestionState('error');
      setIngestionError(validation.message);
      toast({ title: validation.message || 'Invalid file', variant: 'destructive' });
      return;
    }

    setIngestionError('');
    setIngestionMessage('Your image has been accepted.');
    setIngestionState('uploading');

    setIngestionMessage('Preparing editor...');
    setIngestionState('processing');

    // Read file as data URL for persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImageDataUrl(dataUrl);
      setUploadedImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);

    const objectUrl = URL.createObjectURL(file);
    setPendingUploadUrl(objectUrl);
    setIngestionMessage('Waiting for editor to initialize...');
  }, [setUploadedImageUrl, toast]);

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
        fontSize: typeof input.fontSize === 'number' ? input.fontSize : (activeObject as any).fontSize,
        textAlign: typeof input.textAlign === 'string' ? input.textAlign : (activeObject as any).textAlign,
        charSpacing: typeof input.charSpacing === 'number' ? input.charSpacing : (activeObject as any).charSpacing,
        lineHeight: typeof input.lineHeight === 'number' ? input.lineHeight : (activeObject as any).lineHeight,
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
          : ((textObject.shadow as fabric.Shadow | undefined)?.color as string | undefined) || '#000000';

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

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[upload] handleFileChange:start');
    
    const file = e.target.files?.[0];
    console.log('[upload] selected file:', { exists: Boolean(file), type: file?.type, size: file?.size });
    
    if (!file) {
      console.log('[upload] no file selected');
      setIngestionState('idle');
      return;
    }

    await processUpload(file);
    e.target.value = '';
    console.log('[upload] handleFileChange:end');
  }, [processUpload]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!fabricCanvas) return;

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    // Delete selected objects
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

    // Ctrl/Cmd + Z = Undo
    if (ctrlKey && e.key === 'z' && !e.shiftKey) {
      if (canUndo()) {
        undo();
        e.preventDefault();
      }
      return;
    }

    // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z = Redo
    if ((ctrlKey && e.key === 'y') || (ctrlKey && e.shiftKey && e.key === 'z')) {
      if (canRedo()) {
        redo();
        e.preventDefault();
      }
      return;
    }

    // Ctrl/Cmd + S = Save
    if (ctrlKey && e.key === 's') {
      e.preventDefault();
      // Trigger save via custom event
      window.dispatchEvent(new CustomEvent('photune-save'));
      return;
    }

    // Ctrl/Cmd + D = Duplicate
    if (ctrlKey && e.key === 'd') {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        activeObject.clone((cloned: fabric.Object) => {
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

    // Ctrl/Cmd + A = Select all
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

    // Escape = Deselect
    if (e.key === 'Escape') {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      return;
    }

  }, [fabricCanvas, saveState, undo, redo, canUndo, canRedo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Single deterministic restore path on reload
  // Track if we've already attempted hydration to prevent duplicates
  const hasAttemptedHydrationRef = useRef(false);
  
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Prevent duplicate hydration on re-renders
    if (hasAttemptedHydrationRef.current) {
      console.log('[reload] skipping duplicate hydration attempt');
      return;
    }
    
    // Skip hydration if canvas already has content (user uploaded new image)
    if (fabricCanvas.getObjects().length > 0 || fabricCanvas.backgroundImage) {
      console.log('[reload] canvas already has content, skipping hydration');
      hasAttemptedHydrationRef.current = true;
      return;
    }

    let cancelled = false;
    hasAttemptedHydrationRef.current = true;

    const restore = async () => {
      const hasCanvasData = Boolean(initialProjectData?.canvas_data);
      const hasOriginalImageUrl = Boolean(initialProjectData?.original_image_url);
      
      console.log('[reload] checking restore options:', {
        hasCanvasData,
        hasOriginalImageUrl,
        canvasObjectCount: fabricCanvas.getObjects().length,
      });
      
      // Nothing to restore
      if (!hasCanvasData && !hasOriginalImageUrl) {
        console.log('[reload] no saved data to restore');
        return;
      }

      (fabricCanvas as any).isImporting = true;

      // Step 1: Restore canvas_data (includes all objects + their positions)
      if (hasCanvasData) {
        console.log('[reload] restoring from canvas_data');

        try {
          // Validate JSON before loading
          let parsedJson: any;
          try {
            parsedJson = JSON.parse(initialProjectData!.canvas_data!);
          } catch (parseErr) {
            throw new Error(`Invalid canvas JSON: ${String(parseErr)}`);
          }

          // Check basic structure
          if (!parsedJson || typeof parsedJson !== 'object' || !Array.isArray(parsedJson.objects)) {
            throw new Error('Canvas data missing required structure');
          }
          
          // Check for unreasonable object count (potential corruption)
          if (parsedJson.objects.length > 10000) {
            throw new Error('Canvas data has too many objects (possible corruption)');
          }

          // Load canvas JSON
          await new Promise<void>((resolve, reject) => {
            fabricCanvas.loadFromJSON(
              initialProjectData!.canvas_data!, 
              () => {
                if (cancelled) {
                  reject(new Error('Cancelled'));
                  return;
                }

                try {
                  // Re-tag objects that don't have layer metadata
                  // Preserve existing metadata for objects that already have it
                  fabricCanvas.getObjects().forEach((obj, index) => {
                    const objects = fabricCanvas.getObjects();
                    const existingRole = (obj as any).photuneRole;
                    
                    if (existingRole) {
                      // Object already has layer metadata from persistence
                      // Just ensure lock state is correct for background
                      if (existingRole === 'background') {
                        applyLayerLockState(obj, true);
                      }
                    } else {
                      // Object missing metadata, infer and tag
                      const tagged = tagLayerObject(obj, inferLayerRoleForObject(obj), index, objects);
                      if (tagged.photuneRole === 'background') {
                        applyLayerLockState(tagged, true);
                      }
                    }
                  });

                  console.log('[reload] canvas_data loaded, objects:', fabricCanvas.getObjects().length);
                  resolve();
                } catch (restoreErr) {
                  reject(restoreErr);
                }
              },
              (error: any) => {
                reject(new Error(`loadFromJSON failed: ${String(error)}`));
              }
            );
          });
          
          fabricCanvas.renderAll();
          setHasContent(true);
          saveState();
          console.log('[reload] canvas_data restored successfully');
          
        } catch (err) {
          console.error('[reload] canvas_data restore error:', err);
          // Don't set error yet - try image fallback
        }
      }

      // Step 2: Restore background image if canvas_data didn't include it
      // or if canvas_data failed but we have an image URL
      if (hasOriginalImageUrl && !fabricCanvas.backgroundImage) {
        console.log('[reload] restoring background image');
        
        try {
          await new Promise<void>((resolve, reject) => {
            fabric.Image.fromURL(
              initialProjectData!.original_image_url!,
              (img) => {
                if (cancelled) {
                  reject(new Error('Cancelled'));
                  return;
                }

                try {
                  img.set({ crossOrigin: 'anonymous' });
                  tagLayerObject(img, 'background', 0, fabricCanvas.getObjects());
                  applyLayerLockState(img, true);
                  
                  fabricCanvas.setBackgroundImage(
                    img,
                    () => {
                      fabricCanvas.renderAll();
                      console.log('[reload] background image set');
                      resolve();
                    },
                    {
                      scaleX: fabricCanvas.width ? fabricCanvas.width / (img.width || 1) : 1,
                      scaleY: fabricCanvas.height ? fabricCanvas.height / (img.height || 1) : 1,
                    }
                  );
                } catch (imgErr) {
                  reject(imgErr);
                }
              },
              { crossOrigin: 'anonymous' }
            );
          });
          
          setHasContent(true);
          if (!hasCanvasData) {
            saveState(); // Only save if we didn't already save from canvas_data
          }
          console.log('[reload] background image restored successfully');
          
        } catch (err) {
          console.error('[reload] image restore error:', err);
          setIngestionError('Failed to restore saved image.');
        }
      }

      (fabricCanvas as any).isImporting = false;
      
      // Final verification
      const finalObjects = fabricCanvas.getObjects().length;
      const hasBgImage = Boolean(fabricCanvas.backgroundImage);
      console.log('[reload] hydration complete:', { finalObjects, hasBgImage });
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, [fabricCanvas, initialProjectData, saveState]);

  // Log canvas hydration status for debugging and verification
  useEffect(() => {
    if (hasContent && fabricCanvas) {
      const objects = fabricCanvas.getObjects();
      const bgImage = fabricCanvas.backgroundImage;
      
      // Count objects by layer role
      const layerRoles = objects.reduce((acc, obj) => {
        const role = (obj as any).photuneRole || 'unknown';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Check for locked backgrounds
      const lockedBackgrounds = objects.filter(
        (obj) => (obj as any).photuneRole === 'background' && obj.lockMovementX
      ).length;
      
      console.log('[hydration-complete]', {
        objectCount: objects.length,
        hasBackgroundImage: !!bgImage,
        backgroundImageDims: bgImage ? { w: bgImage.width, h: bgImage.height } : null,
        layerRoles,
        lockedBackgrounds,
        firstObjectType: objects[0]?.type || null,
      });
    }
  }, [hasContent, fabricCanvas]);

  // Update hasContent when fabricCanvas becomes available with background
  useEffect(() => {
    console.log('[hasContent] useEffect fired, fabricCanvas:', Boolean(fabricCanvas), 'current hasContent:', hasContent);
    if (fabricCanvas) {
      const bg = fabricCanvas.backgroundImage;
      console.log('[hasContent] backgroundImage:', Boolean(bg));
      if (bg && !hasContent) {
        console.log('[hasContent] setting hasContent to true from backgroundImage');
        setHasContent(true);
      }
    }
  }, [fabricCanvas, hasContent]);

  // Consume pending upload when canvas becomes ready
  useEffect(() => {
    console.log('[upload] checking pending consumption:', { isCanvasReady, pendingUploadUrl: Boolean(pendingUploadUrl), fabricCanvas: Boolean(fabricCanvas) });
    if (!isCanvasReady || !pendingUploadUrl || !fabricCanvas) return;

    console.log('[upload] applying pending image to canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      fabric.Image.fromURL(pendingUploadUrl, (fabricImg) => {
        fabricImg.set({ crossOrigin: 'anonymous' });
        tagLayerObject(fabricImg, 'background', 0, fabricCanvas.getObjects());
        applyLayerLockState(fabricImg, true);
        fabricCanvas.setBackgroundImage(fabricImg, fabricCanvas.renderAll.bind(fabricCanvas), {
          scaleX: fabricCanvas.width ? fabricCanvas.width / (fabricImg.width || 1) : 1,
          scaleY: fabricCanvas.height ? fabricCanvas.height / (fabricImg.height || 1) : 1,
        });
        fabricCanvas.renderAll();
        console.log('[upload] background image applied, setting hasContent');
        setHasContent(true);
        setPendingUploadUrl(null);
        setIngestionState('ready');
        setIngestionMessage('');
        saveState();
        URL.revokeObjectURL(pendingUploadUrl);
      }, { crossOrigin: 'anonymous' });
    };
    img.onerror = () => {
      console.error('[upload] failed to load pending image');
      setPendingUploadUrl(null);
      setIngestionState('error');
      setIngestionError('Failed to load the image. Please try again.');
    };
    img.src = pendingUploadUrl;
  }, [isCanvasReady, pendingUploadUrl, fabricCanvas, saveState, toast]);

  // Sync ingestion state with hasContent
  useEffect(() => {
    if (hasContent) {
      setIngestionState((current) => (current === 'idle' ? current : 'ready'));
      setIngestionError('');
      setIngestionMessage('');
    }
  }, [hasContent]);

  // Auto-save effect: debounced save to Supabase every 30 seconds
  useEffect(() => {
    if (!fabricCanvas || !hasContent) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    // Set new auto-save timer
    autoSaveTimerRef.current = setInterval(async () => {
      try {
        setIsSaving(true);
        const { canvasJson, imageUrl } = extractCanvasToPersistence(fabricCanvas, uploadedImageDataUrl || '');
        
        const result = await autoSaveProject(
          projectId,
          canvasJson,
          imageUrl,
          lastSaveTime,
        );

        if (result.success && result.saved) {
          setLastSaveTime(new Date().toISOString());
          console.log('[autosave] project saved successfully');
        } else if (!result.success && result.message === 'Conflict: another client has updated this project. Reload to sync.') {
          // Show conflict resolution dialog
          setShowConflictDialog(true);
          console.warn('[autosave] conflict detected:', result.message);
        }
      } catch (error) {
        console.error('[autosave] error:', error);
      } finally {
        setIsSaving(false);
      }
    }, 30_000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [fabricCanvas, hasContent, projectId, uploadedImageDataUrl, lastSaveTime, toast]);

  // Route panel based on active mode
  const activePanel = (() => {
    switch (activeMode) {
      case 'upload':
        return (
          <UploadModePanel
            hasContent={hasContent}
            onUploadClick={handleUploadClick}
          />
        );
      case 'export':
        return (
          <ExportModePanel
            hasContent={hasContent}
          />
        );
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
        return (
          <EraseModePanel
            hasContent={hasContent}
          />
        );
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
        return (
          <RewriteModePanel
            hasContent={hasContent}
            canRewrite={false}
          />
        );
      case 'background':
        return (
          <BackgroundModePanel
            hasContent={hasContent}
          />
        );
      case 'layers':
        return (
          <LayersModePanel
            hasContent={hasContent}
            hasObjectSelection={false}
          />
        );
      default:
        return <Sidebar />;
    }
  })();

  return (
    <EditorShell
      header={
        <Header 
          projectId={projectId} 
          projectName={initialProjectData?.name || 'Untitled Project'} 
        />
      }
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
            {/* Always render canvas - overlay shows when loading */}
            <div className="relative shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all duration-500 ease-in-out">
              <Canvas onReady={handleCanvasReady} />
            </div>
            
            {/* Overlay for empty state */}
            {!hasContent && ingestionState === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <EditorEmptyState onUploadClick={handleUploadClick} />
              </div>
            )}
            
            {/* Overlay for loading states */}
            {(ingestionState === 'uploading' || ingestionState === 'processing') && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/90 dark:bg-zinc-900/90">
                <EditorIngestionStatus
                  state={ingestionState}
                  message={ingestionMessage}
                />
              </div>
            )}
            
            {/* Overlay for error state */}
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
    {showConflictDialog && (
      <ConflictResolutionDialog
        open={showConflictDialog}
        onReload={() => {
          setShowConflictDialog(false);
          window.location.reload();
        }}
        onKeepLocal={() => {
          setShowConflictDialog(false);
          // Local changes are already saved via auto-save
          toast({
            title: 'Local changes saved',
            description: 'Your current work has been preserved.',
          });
        }}
        onCancel={() => setShowConflictDialog(false)}
      />
    )}
  );
}
