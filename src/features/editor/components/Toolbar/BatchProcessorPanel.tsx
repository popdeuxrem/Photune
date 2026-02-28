'use client';

import { useState, useRef } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { 
  Layers, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Check, 
  X,
  Zap,
  ArrowRight
} from 'lucide-react';

interface BatchItem {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: string;
}

interface BatchProcessConfig {
  operation: 'ocr' | 'resize' | 'watermark' | 'export';
  params: Record<string, any>;
}

export function BatchProcessorPanel() {
  const { fabricCanvas } = useAppStore();
  const [items, setItems] = useState<BatchItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [config, setConfig] = useState<BatchProcessConfig>({
    operation: 'export',
    params: { format: 'png', scale: 2 },
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: BatchItem[] = files.map((file) => ({
      id: Date.now().toString() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }));
    setItems([...items, ...newItems]);
  };

  const processBatch = async () => {
    if (items.length === 0) return;
    setProcessing(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: 'processing' } : it))
      );

      try {
        // Simulate processing - in real implementation, you'd:
        // 1. Load image into canvas
        // 2. Apply operations (OCR, resize, watermark, etc.)
        // 3. Export result
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'done', result: it.preview } : it
          )
        );
      } catch (error) {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'error' } : it))
        );
      }
    }

    setProcessing(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    items.forEach((item) => URL.revokeObjectURL(item.preview));
    setItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Layers size={16} className="text-zinc        <Label class-400" />
Name="text-xs font-bold uppercase text-zinc-400">Batch Processing</Label>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-8 text-center cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
      >
        <Upload className="mx-auto text-zinc-400 mb-2" size={24} />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Click or drag images here
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Supports JPG, PNG, WebP
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">{items.length} images</span>
            <button onClick={clearAll} className="text-xs text-zinc-400 hover:text-zinc-600">
              Clear all
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
              >
                <img
                  src={item.preview}
                  alt=""
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="flex-1 text-xs truncate">{item.file.name}</span>
                {item.status === 'pending' && (
                  <button onClick={() => removeItem(item.id)}>
                    <X size={14} className="text-zinc-400 hover:text-zinc-600" />
                  </button>
                )}
                {item.status === 'processing' && <Loader2 size={14} className="animate-spin" />}
                {item.status === 'done' && <Check size={14} className="text-green-500" />}
                {item.status === 'error' && <X size={14} className="text-red-500" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Button */}
      {items.length > 0 && (
        <Button
          onClick={processBatch}
          disabled={processing || items.every((i) => i.status === 'done')}
          className="w-full"
        >
          {processing ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap size={16} className="mr-2" />
              Process {items.length} Images
            </>
          )}
        </Button>
      )}

      {/* Download All */}
      {items.some((i) => i.status === 'done') && (
        <Button variant="outline" className="w-full">
          <ArrowRight size={16} className="mr-2" />
          Download All Results
        </Button>
      )}
    </div>
  );
}
