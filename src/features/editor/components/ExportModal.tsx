'use client';

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Download, FileImage, Loader2, Crown, Zap } from 'lucide-react';

import { useAppStore } from '@/shared/store/useAppStore';
import { useToast } from '@/shared/components/ui/use-toast';
import { useSubscription } from '@/shared/components/subscription-provider';
import { TIER_FEATURES } from '@/shared/lib/subscription';

import {
  exportCanvas,
  EXPORT_MULTIPLIERS,
  type ExportFormat,
} from '../lib/export-utils';

const RASTER_FORMATS: ExportFormat[] = ['png', 'jpeg', 'webp'];
const SCALE_OPTIONS = EXPORT_MULTIPLIERS.map((value) => String(value));

function isRasterFormat(format: ExportFormat): boolean {
  return RASTER_FORMATS.includes(format);
}

function getAllowedScaleOptions(tier: 'free' | 'pro' | 'enterprise'): string[] {
  return TIER_FEATURES[tier].maxExports === 'low-res' ? ['1'] : SCALE_OPTIONS;
}

function coerceScale(
  requestedScale: string,
  tier: 'free' | 'pro' | 'enterprise',
  format: ExportFormat
): number {
  if (!isRasterFormat(format) && format !== 'pdf') {
    return 1;
  }

  const allowed = getAllowedScaleOptions(tier);
  return Number(allowed.includes(requestedScale) ? requestedScale : allowed[0]);
}

export function ExportModal() {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState('2');
  const [quality, setQuality] = useState('90');
  const [loading, setLoading] = useState(false);

  const { fabricCanvas } = useAppStore();
  const { subscription, isLoading } = useSubscription();
  const { toast } = useToast();

  const allowedScales = useMemo(
    () => getAllowedScaleOptions(subscription.tier),
    [subscription.tier]
  );

  const effectiveScale = useMemo(
    () => coerceScale(scale, subscription.tier, format),
    [format, scale, subscription.tier]
  );

  const shouldWatermark = TIER_FEATURES[subscription.tier].watermark;
  const isPro = subscription.tier !== 'free';

  const handleExport = async () => {
    if (!fabricCanvas) {
      toast({
        title: 'Export unavailable',
        description: 'Editor canvas is not ready yet.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await exportCanvas(fabricCanvas, {
        format,
        multiplier: effectiveScale,
        quality: Number(quality) / 100,
        watermark: shouldWatermark,
        watermarkText: 'Photune',
      });

      if (String(effectiveScale) !== scale && (isRasterFormat(format) || format === 'pdf')) {
        toast({
          title: 'Export completed with plan limits',
          description: `Your ${subscription.tier} tier exported at ${effectiveScale}x.`,
        });
      } else {
        toast({
          title: 'Export completed',
          description: `${result.filename} was generated successfully.`,
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description:
          error instanceof Error
            ? error.message
            : 'The export could not be completed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSummary = useMemo(() => {
    if (format === 'svg') {
      return 'Vector export from normalized visible canvas state.';
    }

    if (format === 'pdf') {
      return `PDF generated from normalized PNG render at ${effectiveScale}x.`;
    }

    return `${format.toUpperCase()} export at ${effectiveScale}x from normalized visible canvas state.`;
  }, [effectiveScale, format]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full font-bold dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          <Download size={16} className="mr-2" /> Export
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-zinc-900 rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight dark:text-white">
            Export Studio
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-400">Output Format</label>
            <div className="grid grid-cols-5 gap-2">
              {(['png', 'jpeg', 'webp', 'svg', 'pdf'] as ExportFormat[]).map((candidate) => (
                <button
                  key={candidate}
                  onClick={() => setFormat(candidate)}
                  className={`py-2 px-3 rounded-lg text-sm font-bold uppercase transition-all ${
                    format === candidate
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {candidate}
                </button>
              ))}
            </div>
          </div>

          {isRasterFormat(format) && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Quality</label>
              <Select onValueChange={setQuality} defaultValue={quality}>
                <SelectTrigger className="h-12 rounded-xl dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="70">70% - Smaller file</SelectItem>
                  <SelectItem value="90">90% - Balanced</SelectItem>
                  <SelectItem value="100">100% - Best quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(isRasterFormat(format) || format === 'pdf') && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Resolution</label>
              <Select
                onValueChange={setScale}
                value={allowedScales.includes(scale) ? scale : allowedScales[0]}
              >
                <SelectTrigger className="h-12 rounded-xl dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allowedScales.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}x {value === '1' ? '(Standard)' : value === '2' ? '(Retina)' : '(Ultra HD)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!isPro && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
              <Zap className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                  Free Tier Export
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  Your export includes a watermark and is limited to 1x output.
                </p>
              </div>
            </div>
          )}

          {isPro && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-200 dark:border-green-800 flex items-start gap-3">
              <Crown className="text-green-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold text-green-700 dark:text-green-400">
                  Pro Export
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  Clean export with higher-resolution output options.
                </p>
              </div>
            </div>
          )}

          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700 flex items-center gap-3">
            <FileImage className="text-zinc-400 shrink-0" size={18} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {exportSummary}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleExport}
            className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
            disabled={loading || isLoading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Download size={18} className="mr-2" /> Export {format.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
