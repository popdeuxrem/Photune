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
    const json = JSON.stringify(canvas.toJSON(['isImporting', 'selectable', 'hasControls']));
    const { history, historyIndex } = get();
    
    // Don't save if state hasn't changed
    if (history[historyIndex] === json) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    
    // Limit history to 50 steps to save memory
    if (newHistory.length > 50) newHistory.shift();

    set({ 
      history: newHistory, 
      historyIndex: newHistory.length - 1 
    });
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
