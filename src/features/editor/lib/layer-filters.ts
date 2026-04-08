import type { LayerEntry } from '@/features/editor/hooks/useLayerStack';
import type { LayerRole } from '@/features/editor/lib/layer-system';

export type LayerFilter =
  | 'all'
  | LayerRole
  | 'locked'
  | 'hidden';

export function filterLayers(
  layers: LayerEntry[],
  filter: LayerFilter
): LayerEntry[] {
  switch (filter) {
    case 'all':
      return layers;
    case 'locked':
      return layers.filter((layer) => layer.locked);
    case 'hidden':
      return layers.filter((layer) => !layer.visible);
    default:
      return layers.filter((layer) => layer.role === filter);
  }
}