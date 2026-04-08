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
import { applyLayerLockState, inferLayerRoleForObject, tagLayerObject } from '@/features/editor/lib/layer-system';

interface EditorClientProps {
  projectId: string;
  initialProjectData: any;
}

export function EditorClient({ projectId, initialProjectData }: EditorClientProps) {
  const { fabricCanvas, saveState, undo, redo, canUndo, canRedo, uploadedImageUrl, setUploadedImageUrl } = useAppStore();
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
  useEffect(() => {
    if (!fabricCanvas) return;

    let cancelled = false;

    const restore = async () => {
      console.log('[reload] checking restore options:', {
        hasCanvasData: Boolean(initialProjectData?.canvas_data),
        hasOriginalImageUrl: Boolean(initialProjectData?.original_image_url),
      });

      // Priority 1: durable uploaded image restore
      if (initialProjectData?.original_image_url) {
        console.log('[reload] restoring from original_image_url');
        fabric.Image.fromURL(
          initialProjectData.original_image_url,
          (img) => {
            if (cancelled) return;

            img.set({ crossOrigin: 'anonymous' });
            tagLayerObject(img, 'background', 0, fabricCanvas.getObjects());
            applyLayerLockState(img, true);
            fabricCanvas.setBackgroundImage(
              img,
              fabricCanvas.renderAll.bind(fabricCanvas),
              {
                scaleX: fabricCanvas.width ? fabricCanvas.width / (img.width || 1) : 1,
                scaleY: fabricCanvas.height ? fabricCanvas.height / (img.height || 1) : 1,
              }
            );

            fabricCanvas.renderAll();
            setHasContent(true);
            console.log('[reload] original_image_url restored successfully');
          },
          { crossOrigin: 'anonymous' }
        );
        return;
      }

      // Priority 2: fallback restore from canvas_data
      if (initialProjectData?.canvas_data) {
        console.log('[reload] restoring from canvas_data');
        (fabricCanvas as any).isImporting = true;

        fabricCanvas.loadFromJSON(initialProjectData.canvas_data, () => {
          if (cancelled) return;

          fabricCanvas.getObjects().forEach((obj, index) => {
            const objects = fabricCanvas.getObjects();
            const tagged = tagLayerObject(obj, inferLayerRoleForObject(obj), index, objects);
            if (tagged.photuneRole === 'background') {
              applyLayerLockState(tagged, true);
            }
          });

          fabricCanvas.renderAll();
          (fabricCanvas as any).isImporting = false;
          setHasContent(true);
          console.log('[reload] canvas_data restored successfully');
          saveState();
        });
      }
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, [fabricCanvas, initialProjectData, saveState]);

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
            hasTextSelected={false}
          />
        );
      case 'erase':
        return (
          <EraseModePanel
            hasContent={hasContent}
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
  );
}