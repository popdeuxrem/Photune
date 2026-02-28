'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Download, FileImage, Loader2, Crown, Zap } from 'lucide-react';
import { useAppStore } from '@/shared/store/useAppStore';
import { exportCanvas, ExportFormat } from '../lib/export-utils';
import { useSubscription } from '@/shared/components/subscription-provider';

export function ExportModal() {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState('2');
  const [quality, setQuality] = useState('90');
  const [loading, setLoading] = useState(false);
  const { fabricCanvas } = useAppStore();
  const { subscription, canUseFeature } = useSubscription();

  const handleExport = async () => {
    if (!fabricCanvas) return;
    setLoading(true);
    
    try {
      const multiplier = parseInt(scale);
      const qualityValue = parseInt(quality) / 100;
      
      // Check if watermark should be applied (free tier)
      const shouldWatermark = subscription.tier === 'free';
      
      await exportCanvas(fabricCanvas, {
        format,
        multiplier,
        quality: qualityValue,
        watermark: shouldWatermark,
        watermarkText: 'Photune',
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPro = subscription.tier !== 'free';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full font-bold dark:border-zinc-600 dark:hover:bg-zinc-800">
          <Download size={16} className="mr-2" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-900 rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight dark:text-white">Export Studio</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-400">Output Format</label>
            <div className="grid grid-cols-5 gap-2">
              {(['png', 'jpeg', 'webp', 'svg', 'pdf'] as ExportFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-2 px-3 rounded-lg text-sm font-bold uppercase transition-all ${
                    format === f 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' 
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Quality (for raster formats) */}
          {['png', 'jpeg', 'webp'].includes(format) && (
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

          {/* Scale */}
          {['png', 'jpeg', 'webp'].includes(format) && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-400">Resolution</label>
              <Select onValueChange={setScale} defaultValue={scale}>
                <SelectTrigger className="h-12 rounded-xl dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x (Standard)</SelectItem>
                  <SelectItem value="2">2x (Retina)</SelectItem>
                  <SelectItem value="4">4x (Ultra HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Watermark Notice for Free Users */}
          {!isPro && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
              <Zap className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Free Tier Export</p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  Your export will include a watermark. Upgrade to Pro for clean exports.
                </p>
              </div>
            </div>
          )}

          {/* Pro Features */}
          {isPro && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-200 dark:border-green-800 flex items-start gap-3">
              <Crown className="text-green-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold text-green-700 dark:text-green-400">Pro Export</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  Clean export, no watermark. Thanks for supporting Photune!
                </p>
              </div>
            </div>
          )}

          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700 flex items-center gap-3">
            <FileImage className="text-zinc-400" size={18} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {format.toUpperCase()} format. {format === 'svg' ? 'Vector output.' : `Scale: ${scale}x`}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleExport} 
            className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <><Download size={18} className="mr-2" /> Export {format.toUpperCase()}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
