'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type DashboardViewMode = 'grid' | 'list';
export type DashboardSortMode = 'updated_desc' | 'updated_asc' | 'name_asc';

const DASHBOARD_VIEW_MODE_KEY = 'photune.dashboard.viewMode';
const DEFAULT_VIEW_MODE: DashboardViewMode = 'grid';
const DEFAULT_SORT_MODE: DashboardSortMode = 'updated_desc';

export function useDashboardControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<DashboardViewMode>(DEFAULT_VIEW_MODE);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<DashboardSortMode>(DEFAULT_SORT_MODE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DASHBOARD_VIEW_MODE_KEY);
      if (stored === 'grid' || stored === 'list') {
        setViewMode(stored);
      }
    } catch (error) {
      console.warn('Failed to restore dashboard view mode:', error);
    }
  }, []);

  useEffect(() => {
    const urlQuery = searchParams.get('q') ?? '';
    const urlSort = searchParams.get('sort') ?? DEFAULT_SORT_MODE;

    setSearchQuery((current) => (current === urlQuery ? current : urlQuery));
    setDebouncedSearchQuery((current) => (current === urlQuery ? current : urlQuery));

    if (urlSort === 'updated_desc' || urlSort === 'updated_asc' || urlSort === 'name_asc') {
      setSortMode((current) => (current === urlSort ? current : urlSort));
    } else {
      setSortMode(DEFAULT_SORT_MODE);
    }
  }, [searchParams]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DASHBOARD_VIEW_MODE_KEY, viewMode);
    } catch (error) {
      console.warn('Failed to persist dashboard view mode:', error);
    }
  }, [viewMode]);

  useEffect(() => {
    const currentUrlQuery = searchParams.get('q') ?? '';
    const currentUrlSort = searchParams.get('sort') ?? DEFAULT_SORT_MODE;
    const normalized = debouncedSearchQuery.trim();

    if (normalized === currentUrlQuery && sortMode === currentUrlSort) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (normalized) {
      params.set('q', normalized);
    } else {
      params.delete('q');
    }

    if (sortMode === DEFAULT_SORT_MODE) {
      params.delete('sort');
    } else {
      params.set('sort', sortMode);
    }

    const next = params.toString();
    const href = next ? `${pathname}?${next}` : pathname;
    router.replace(href, { scroll: false });
  }, [debouncedSearchQuery, pathname, router, searchParams, sortMode]);

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortMode,
    setSortMode,
  };
}