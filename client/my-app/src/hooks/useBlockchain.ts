import { useState, useEffect, useCallback } from 'react';
import {
  blockchainService,
  BlockchainConfig
} from '@/services/blockchainService';
import { HistoryEntry } from '@/types/history';
import { toast } from 'sonner';

interface UseBlockchainOptions {
  autoConnect?: boolean;
  config?: BlockchainConfig;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

interface UseBlockchainReturn {
  isConnected: boolean;
  historyData: HistoryEntry[];
  pagination: PaginationState;
  error: string | null;
  isLoading: boolean;
  connect: () => Promise<boolean>;
  getHistoryByCID: (cid: string) => Promise<HistoryEntry | null>;
  getLatestMangaVersion: (mangaId: number) => Promise<HistoryEntry | null>;
  getCompleteVersionHistory: (
    historyEntry: HistoryEntry,
    page?: number,
    pageSize?: number
  ) => Promise<{
    history: HistoryEntry[];
    pagination: PaginationState;
  }>;
  // changePage: (newPage: number) => Promise<void>;
  currentMangaId: number | null;
  previouslatestCid: string | null;
  originalLatestCid: HistoryEntry | null; // Added original CID reference
}

export function useBlockchain(
  options: UseBlockchainOptions = {}
): UseBlockchainReturn {
  const { autoConnect = true, config } = options;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentMangaId, setCurrentMangaId] = useState<number | null>(null);
  const [previouslatestCid, setPreviousLatestCid] = useState<string | null>(
    null
  );
  const [originalLatestCid, setOriginalLatestCid] =
    useState<HistoryEntry | null>(null); // Store the original latest CID
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    hasMore: false
  });

  const connect = useCallback(async () => {
    try {
      setError(null);

      // Initialize blockchain service with custom config if provided
      if (config) {
        const customService = new (blockchainService.constructor as any)(
          config
        );
        const connected = await customService.connect();
        setIsConnected(connected);
        return connected;
      }

      const connected = await blockchainService.connect();
      setIsConnected(connected);
      return connected;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to connect to blockchain';
      setError(errorMessage);
      toast('Connection Error', {
        description: errorMessage
      });
      return false;
    }
  }, [config]);

  const getHistoryByCID = useCallback(
    async (cid: string) => {
      if (!isConnected) await connect();
      return blockchainService.getHistoryByCID(cid);
    },
    [isConnected, connect]
  );

  const getLatestMangaVersion = useCallback(
    async (mangaId: number) => {
      if (!isConnected) await connect();
      const latestVersion =
        await blockchainService.getLatestMangaVersion(mangaId);
      console.log('Latest version111:', latestVersion);
      if (latestVersion) {
        setCurrentMangaId(mangaId);
        setPreviousLatestCid(latestVersion.previousVersion);
        setOriginalLatestCid(latestVersion); // Set the original latest CID
      }

      console.log('Latest version:', latestVersion);
      return latestVersion;
    },
    [isConnected, connect]
  );

  /**
   * Fetches paginated version history for a manga starting from the latest CID
   * @param historyEntry - The history entry containing the previous version CID
   * @param page - The page number to fetch (default: 1)
   * @param pageSize - Number of items per page (default: 10)
   * @returns Object containing history entries and pagination metadata
   */
  const getCompleteVersionHistory = useCallback(
    async (
      historyEntry: HistoryEntry,
      page: number = 1,
      pageSize: number = 5
    ): Promise<{
      history: HistoryEntry[];
      pagination: PaginationState;
    }> => {
      try {
        setError(null);
        setIsLoading(true);

        if (!historyEntry.previousVersion) {
          throw new Error('No CID provided to fetch version history');
        }

        // Store both the current and original latest CID
        setPreviousLatestCid(historyEntry.previousVersion);
        setOriginalLatestCid(historyEntry);
        console.log('Original latest CID:', historyEntry);

        // Fetch complete history from blockchain
        const result = await blockchainService.getCompleteVersionHistory(
          historyEntry.previousVersion
        );

        // Add current version to the complete history
        const completeHistory = [historyEntry, ...result.history];
        console.log('Complete history:', completeHistory);

        // Calculate pagination
        const totalItems = completeHistory.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);

        // Get items for current page
        const paginatedHistory = completeHistory.slice(startIndex, endIndex);

        // Update state
        setHistoryData(paginatedHistory);
        const newPagination = {
          currentPage: page,
          totalPages,
          totalItems,
          hasMore: page < totalPages
        };
        console.log('Pagination:', newPagination);
        setPagination(newPagination);

        return {
          history: paginatedHistory,
          pagination: newPagination
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch version history';
        setError(errorMessage);
        return {
          history: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasMore: false
          }
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isConnected,
    historyData,
    pagination,
    error,
    isLoading,
    connect,
    getHistoryByCID,
    getLatestMangaVersion,
    getCompleteVersionHistory,
    // changePage,
    currentMangaId,
    previouslatestCid,
    originalLatestCid
  };
}
