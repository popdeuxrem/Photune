import { create } from 'zustand';
import { fabric } from 'fabric';

type Job = { id: number; text: string; status: 'processing' | 'completed' | 'failed' };

interface AppState {
  fabricCanvas: fabric.Canvas | null;
  activeObject: fabric.Object | null;
  history: string[];
  historyIndex: number;
  jobs: Job[];
  setFabricCanvas: (canvas: fabric.Canvas) => void;
  setActiveObject: (obj: fabric.Object | null) => void;
  addJob: (job: Job) => void;
  updateJob: (id: number, status: Job['status'], text?: string) => void;
  removeJob: (id: number) => void;
  saveState: () => void;
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

  setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),
  setActiveObject: (obj) => set({ activeObject: obj }),
  
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, status, text) => set((state) => ({
    jobs: state.jobs.map(j => j.id === id ? { ...j, status, text: text || j.text } : j)
  })),
  removeJob: (id) => set((state) => ({ jobs: state.jobs.filter(j => j.id !== id) })),

  saveState: () => {
    const canvas = get().fabricCanvas;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    const { history, historyIndex } = get();
    
    if (history[historyIndex] === json) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { fabricCanvas, history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      fabricCanvas?.loadFromJSON(history[prevIndex], () => {
        fabricCanvas.renderAll();
        set({ historyIndex: prevIndex });
      });
    }
  },

  redo: () => {
    const { fabricCanvas, history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      fabricCanvas?.loadFromJSON(history[nextIndex], () => {
        fabricCanvas.renderAll();
        set({ historyIndex: nextIndex });
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
