'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-600 dark:text-zinc-300" />
            <span className="text-zinc-700 dark:text-zinc-200 font-medium">Loading...</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}
