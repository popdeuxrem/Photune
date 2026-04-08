import { create } from 'zustand';
import { fabric } from 'fabric';
import { serializeCanvasSnapshot } from '@/features/editor/lib/canvas-serialization';

type Job = { id: number; text: string; status: 'processing' | 'completed' | 'failed' };

interface AppState {
  fabricCanvas: fabric.Canvas | null;
  activeObject: fabric.Object | null;
  history: string[];
  historyIndex: number;
  jobs: Job[];
  uploadedImageUrl: string | null;
  setFabricCanvas: (canvas: fabric.Canvas) => void;
  setActiveObject: (obj: fabric.Object | null) => void;
  addJob: (job: Job) => void;
  updateJob: (id: number, status: Job['status'], text?: string) => void;
  removeJob: (id: number) => void;
  saveState: () => void;
  replaceHistoryWithCurrentState: () => void;
  resetEditorSession: () => void;
  setUploadedImageUrl: (url: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  fabricCanvas: null,
  activeObject: null,
  history: [],
  historyIndex: -1,
  jobs: [],
  uploadedImageUrl: null,

  setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),
  setActiveObject: (obj) => set({ activeObject: obj }),
  setUploadedImageUrl: (url) => set({ uploadedImageUrl: url }),
  resetEditorSession: () =>
    set({ activeObject: null, history: [], historyIndex: -1, uploadedImageUrl: null }),

  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, status, text) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, status, text: text || j.text } : j)),
    })),
  removeJob: (id) => set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),

  saveState: () => {
    const canvas = get().fabricCanvas;
    if (!canvas) return;

    const json = serializeCanvasSnapshot(canvas);
    const { history, historyIndex } = get();

    if (history[historyIndex] === json) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);

    if (newHistory.length > 50) newHistory.shift();

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  replaceHistoryWithCurrentState: () => {
    const canvas = get().fabricCanvas;
    if (!canvas) return;

    const json = serializeCanvasSnapshot(canvas);
    set({ history: [json], historyIndex: 0 });
  },

  undo: () => {
    const { fabricCanvas, history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const state = history[prevIndex];
      fabricCanvas?.loadFromJSON(state, () => {
        fabricCanvas.renderAll();
        set({ historyIndex: prevIndex });
      });
    }
  },

  redo: () => {
    const { fabricCanvas, history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const state = history[nextIndex];
      fabricCanvas?.loadFromJSON(state, () => {
        fabricCanvas.renderAll();
        set({ historyIndex: nextIndex });
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
