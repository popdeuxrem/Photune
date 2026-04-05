'use client';

export type EditorMode =
  | 'upload'
  | 'text'
  | 'erase'
  | 'rewrite'
  | 'background'
  | 'layers'
  | 'export';

type ModeItem = {
  id: EditorMode;
  label: string;
  icon: string;
};

const MODES: ModeItem[] = [
  { id: 'upload', label: 'Upload', icon: '↑' },
  { id: 'text', label: 'Text', icon: 'T' },
  { id: 'erase', label: 'Erase', icon: '⌫' },
  { id: 'rewrite', label: 'Rewrite', icon: '✎' },
  { id: 'background', label: 'Background', icon: '▭' },
  { id: 'layers', label: 'Layers', icon: '≡' },
  { id: 'export', label: 'Export', icon: '↓' },
];

type EditorModeNavProps = {
  activeMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
};

export function EditorModeNav({ activeMode, onModeChange }: EditorModeNavProps) {
  return (
    <nav className="flex items-center justify-around gap-1 overflow-x-auto border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-2 lg:hidden">
      {MODES.map((mode) => {
        const isActive = mode.id === activeMode;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onModeChange(mode.id)}
            className={[
              'flex shrink-0 flex-col items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition',
              isActive
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700',
            ].join(' ')}
          >
            <span className="text-base mb-1">{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        );
      })}
    </nav>
  );
}