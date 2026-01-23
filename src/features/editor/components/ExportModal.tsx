'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Download, FileImage, Loader2 } from 'lucide-react';
import { useAppStore } from '@/shared/store/useAppStore';

export function ExportModal() {
  const [scale, setScale] = useState('2');
  const [loading, setLoading] = useState(false);
  const { fabricCanvas } = useAppStore();

  const handleExport = () => {
    if (!fabricCanvas) return;
    setLoading(true);
    
    setTimeout(() => {
      const dataUrl = fabricCanvas.toDataURL({ 
        format: 'png', 
        multiplier: parseInt(scale),
        enableRetinaScaling: true 
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `photext-pro-export-${Date.now()}.png`;
      link.click();
      setLoading(false);
    }, 500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full font-bold">
          <Download size={16} className="mr-2" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Export Studio Design</DialogTitle>
        </DialogHeader>
        <div className="py-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-400">Output Quality</label>
            <Select onValueChange={setScale} defaultValue={scale}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Standard (72 DPI)</SelectItem>
                <SelectItem value="2">Retina (144 DPI)</SelectItem>
                <SelectItem value="4">Ultra High (300 DPI)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex items-center gap-3">
             <FileImage className="text-zinc-400" />
             <p className="text-xs text-zinc-500 font-medium">Exporting as PNG. Transparent areas will be preserved if no background is set.</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleExport} className="w-full h-12 rounded-xl bg-zinc-900" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Download Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
