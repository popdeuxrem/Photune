'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Download } from 'lucide-react';
import { useAppStore } from '@/shared/store/useAppStore';

export function ExportModal() {
  const [format, setFormat] = useState('png');
  const { fabricCanvas } = useAppStore();

  const handleExport = () => {
    if (!fabricCanvas) return;
    const dataUrl = fabricCanvas.toDataURL({ format: format as any, multiplier: 2 });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `photext-export-${Date.now()}.${format}`;
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Download size={16} className="mr-2" /> Export</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Export Design</DialogTitle></DialogHeader>
        <div className="py-6">
          <Select onValueChange={setFormat} defaultValue={format}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG Image</SelectItem>
              <SelectItem value="jpeg">JPEG Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleExport} className="w-full">Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
