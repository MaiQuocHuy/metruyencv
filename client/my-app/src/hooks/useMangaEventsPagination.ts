import { useState, useEffect, useCallback } from 'react';
import {
  blockchainService as service,
  PaginatedResult
} from '@/services/blockchainService';

export function useMangaEventsPagination(mangaId: string) {
  const [data, setData] = useState<PaginatedResult<any> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fetchPage = async (page: number) => {
    setIsLoading(true);
    setIsTransitioning(true);
    try {
      const result = await service.getPaginatedEvents(mangaId, page, 5);

      // Add artificial delay for smooth transition
      await new Promise((resolve) => setTimeout(resolve, 300));

      setData(result);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
      // Add delay before removing transition state
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, [mangaId]);

  const onPageChange = (page: number) => {
    if (!data || page < 1 || page > data.totalPages) return;
    fetchPage(page);
  };

  return {
    data,
    totalPages: data?.totalPages || 0,
    isLoading,
    isTransitioning,
    currentPage,
    onPageChange
  };
}

export function fetchIPFSData(cid: string) {
  return service.fetchIPFSData(cid);
}
