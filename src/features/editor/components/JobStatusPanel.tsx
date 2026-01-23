'use client';

import { useAppStore } from '@/shared/store/useAppStore';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export function JobStatusPanel() {
  const { jobs, removeJob } = useAppStore();
  
  if (jobs.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 flex flex-col gap-3 z-[100]">
      {jobs.map(job => (
        <div 
          key={job.id} 
          className="bg-zinc-900 text-white border border-zinc-700 shadow-2xl rounded-xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="shrink-0">
            {job.status === 'processing' && <Loader2 className="w-5 h-5 animate-spin text-blue-400" />}
            {job.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {job.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-400" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate leading-tight">
              {job.text}
            </p>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">
              {job.status}
            </p>
          </div>

          <button 
            onClick={() => removeJob(job.id)} 
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
