'use client';

import { useMemo, useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Layers, MoveUp, MoveDown, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/store/useAppStore';
import { useLayerStack } from '@/features/editor/hooks/useLayerStack';
import { filterLayers, type LayerFilter } from '@/features/editor/lib/layer-filters';

type LayersModePanelProps = {
  hasContent: boolean;
  hasObjectSelection: boolean;
};

export function LayersModePanel({
  hasContent,
  hasObjectSelection,
}: LayersModePanelProps) {
  const { activeObject } = useAppStore();
  const {
    layers,
    selectLayer,
    toggleVisibility,
    toggleLock,
    moveLayer,
    deleteLayer,
  } = useLayerStack();

  const [filter, setFilter] = useState<LayerFilter>('all');

  const visibleLayers = useMemo(() => {
    return filterLayers(layers, filter);
  }, [layers, filter]);

  if (!hasContent) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Layers</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload or open a project before using layer controls.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Layers</h3>
          </div>
          <div className="text-xs text-muted-foreground">
            {visibleLayers.length} item{visibleLayers.length === 1 ? '' : 's'}
          </div>
        </div>

        {!hasObjectSelection && (
          <p className="mt-2 text-xs text-muted-foreground">
            Select an object on the canvas or from this list to inspect and reorder it.
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {(['all', 'text', 'vector', 'background', 'locked', 'hidden'] as LayerFilter[]).map((value) => {
            const active = filter === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={[
                  'rounded-full border px-3 py-1 text-xs font-medium transition',
                  active
                    ? 'border-primary/40 bg-primary/10 text-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted',
                ].join(' ')}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {visibleLayers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            No layers match the current filter.
          </div>
        ) : (
          <div className="space-y-1">
            {visibleLayers.map((layer) => {
              const isActive = activeObject === layer.object;

              return (
                <div
                  key={layer.id}
                  className={[
                    'group rounded-xl border px-3 py-3 transition',
                    isActive
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-transparent hover:border-border hover:bg-muted/40',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={() => selectLayer(layer)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-[10px] font-semibold uppercase text-muted-foreground">
                      {layer.role}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-foreground">
                        {layer.label}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        z-index {layer.index}
                      </div>
                    </div>
                  </button>

                  <div className="mt-3 flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleVisibility(layer)}
                      aria-label={layer.visible ? 'Hide layer' : 'Show layer'}
                    >
                      {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleLock(layer)}
                      aria-label={layer.locked ? 'Unlock layer' : 'Lock layer'}
                    >
                      {layer.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveLayer(layer, 'up')}
                      aria-label="Move layer up"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveLayer(layer, 'down')}
                      aria-label="Move layer down"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                      onClick={() => deleteLayer(layer)}
                      aria-label="Delete layer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}