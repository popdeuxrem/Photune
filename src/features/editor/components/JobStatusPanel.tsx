'use client';

import { useAppStore } from '@/shared/store/useAppStore';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export function JobStatusPanel() {
  const { jobs, removeJob } = useAppStore();
  if (jobs.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-72 flex flex-col gap-2 z-50">
      {jobs.map(job => (
        <div key={job.id} className="bg-white border shadow-lg rounded-lg p-3 flex items-center gap-3 animate-in slide-in-from-right">
          {job.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          {job.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {job.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
          <span className="text-xs font-medium flex-1 truncate">{job.text}</span>
          <button onClick={() => removeJob(job.id)} className="text-zinc-400 hover:text-zinc-600"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}
