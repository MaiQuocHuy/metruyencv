import { MangaAdmin } from '@/services/apiManga';
import { useState, useCallback } from 'react';

export function useMangaSelection(mangaList: MangaAdmin[]) {
  const [selectedManga, setSelectedManga] = useState<number[]>([]);

  const toggleSelectManga = useCallback((id: number, checked: boolean) => {
    setSelectedManga((prev) =>
      checked ? [...prev, id] : prev.filter((mangaId) => mangaId !== id)
    );
  }, []);

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedManga(checked ? mangaList.map((item) => item.manga_id) : []);
    },
    [mangaList]
  );

  const resetSelection = useCallback(() => {
    setSelectedManga([]);
  }, []);

  return {
    selectedManga,
    toggleSelectManga,
    toggleSelectAll,
    resetSelection
  };
}
