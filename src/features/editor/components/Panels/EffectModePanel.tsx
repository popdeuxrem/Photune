'use client';

import { useState } from 'react';
import {
  TEXT_EFFECT_PRESETS,
  type SelectedTextEffects,
} from '@/features/editor/lib/text-effect-presets';

type EffectModePanelProps = {
  hasContent: boolean;
  hasTextSelected: boolean;
  onApplyReadableDefaults?: () => void;
  selectedTextEffects?: SelectedTextEffects;
  onUpdateTextEffects?: (input: Partial<SelectedTextEffects>) => void;
};

export function EffectModePanel({
  hasContent,
  hasTextSelected,
  onApplyReadableDefaults,
  selectedTextEffects,
  onUpdateTextEffects,
}: EffectModePanelProps) {
  const [draftStrokeWidth, setDraftStrokeWidth] = useState<number | ''>('');
  const [draftOpacity, setDraftOpacity] = useState<number | ''>('');
  const [draftShadowBlur, setDraftShadowBlur] = useState<number | ''>('');
  const [draftShadowOffsetX, setDraftShadowOffsetX] = useState<number | ''>('');
  const [draftShadowOffsetY, setDraftShadowOffsetY] = useState<number | ''>('');

  const canEdit = Boolean(hasTextSelected && selectedTextEffects && onUpdateTextEffects);

  const effects = selectedTextEffects ?? {
    fill: '#111111',
    stroke: '#000000',
    strokeWidth: 0,
    opacity: 1,
    shadowColor: '#000000',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  };

  const commitNumber = (
    key:
      | 'strokeWidth'
      | 'opacity'
      | 'shadowBlur'
      | 'shadowOffsetX'
      | 'shadowOffsetY',
    value: number | ''
  ) => {
    if (!canEdit || value === '') return;
    onUpdateTextEffects?.({ [key]: Number(value) });
  };

  if (!hasContent) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Effect</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload or open a project before using effect controls.
          </p>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Effect</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a text object to edit fill, stroke, opacity, and shadow effects.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Effect</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Apply non-destructive visual styling to the selected text object.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-foreground">
              Readable defaults
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Re-apply the built-in readable shadow/stroke strategy for the current fill color.
            </div>
          </div>

          <button
            type="button"
            onClick={onApplyReadableDefaults}
            disabled={!onApplyReadableDefaults}
            className="rounded-xl border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            Apply defaults
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-4 text-sm font-medium text-foreground">
          Presets
        </div>

        <div className="grid grid-cols-2 gap-2">
          {TEXT_EFFECT_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => onUpdateTextEffects?.(preset.values)}
              className="rounded-xl border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-4 text-sm font-medium text-foreground">
          Fill and stroke
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-sm text-foreground">Fill</label>
            <input
              type="color"
              value={effects.fill || '#111111'}
              onChange={(event) => onUpdateTextEffects?.({ fill: event.target.value })}
              className="h-10 w-full rounded-md border border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-foreground">Stroke</label>
            <input
              type="color"
              value={effects.stroke || '#000000'}
              onChange={(event) => onUpdateTextEffects?.({ stroke: event.target.value })}
              className="h-10 w-full rounded-md border border-border bg-background"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="block text-sm text-foreground">Stroke width</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="1"
              value={
                draftStrokeWidth === ''
                  ? effects.strokeWidth
                  : draftStrokeWidth
              }
              onChange={(event) => setDraftStrokeWidth(Number(event.target.value))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            />
            <button
              type="button"
              onClick={() => {
                commitNumber('strokeWidth', draftStrokeWidth);
                setDraftStrokeWidth('');
              }}
              className="rounded-xl border border-border px-3 py-2 text-sm text-foreground"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-4 text-sm font-medium text-foreground">
          Opacity
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-foreground">Opacity (0–1)</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={draftOpacity === '' ? effects.opacity : draftOpacity}
              onChange={(event) => setDraftOpacity(Number(event.target.value))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
            />
            <button
              type="button"
              onClick={() => {
                commitNumber('opacity', draftOpacity);
                setDraftOpacity('');
              }}
              className="rounded-xl border border-border px-3 py-2 text-sm text-foreground"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-4 text-sm font-medium text-foreground">
          Shadow
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-sm text-foreground">Shadow color</label>
            <input
              type="color"
              value={effects.shadowColor || '#000000'}
              onChange={(event) =>
                onUpdateTextEffects?.({ shadowColor: event.target.value })
              }
              className="h-10 w-full rounded-md border border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-foreground">Shadow blur</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="1"
                value={
                  draftShadowBlur === ''
                    ? effects.shadowBlur
                    : draftShadowBlur
                }
                onChange={(event) => setDraftShadowBlur(Number(event.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              />
              <button
                type="button"
                onClick={() => {
                  commitNumber('shadowBlur', draftShadowBlur);
                  setDraftShadowBlur('');
                }}
                className="rounded-xl border border-border px-3 py-2 text-sm text-foreground"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-sm text-foreground">Shadow offset X</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="1"
                value={
                  draftShadowOffsetX === ''
                    ? effects.shadowOffsetX
                    : draftShadowOffsetX
                }
                onChange={(event) => setDraftShadowOffsetX(Number(event.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              />
              <button
                type="button"
                onClick={() => {
                  commitNumber('shadowOffsetX', draftShadowOffsetX);
                  setDraftShadowOffsetX('');
                }}
                className="rounded-xl border border-border px-3 py-2 text-sm text-foreground"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-foreground">Shadow offset Y</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="1"
                value={
                  draftShadowOffsetY === ''
                    ? effects.shadowOffsetY
                    : draftShadowOffsetY
                }
                onChange={(event) => setDraftShadowOffsetY(Number(event.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              />
              <button
                type="button"
                onClick={() => {
                  commitNumber('shadowOffsetY', draftShadowOffsetY);
                  setDraftShadowOffsetY('');
                }}
                className="rounded-xl border border-border px-3 py-2 text-sm text-foreground"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}