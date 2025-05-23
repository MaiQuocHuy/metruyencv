'use client';
import { Separator } from '@/components/ui/separator';
import { History, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HistoryEntry } from '@/types/history';
import { filterHistoryData, getChangeTypes } from '@/lib/utils';
import { toast } from 'sonner';
import HistoryFilters from '@/components/manga/HistoryFilters';
import HistoryTable from '@/components/manga/HistoryTable';
import HistoryDetailsDialog from '@/components/manga/HistoryDetailsDialog';
import HistoryPagination from '@/components/manga/HistoryPagination';
import { useBlockchain } from '@/hooks/useBlockchain';
import {
  fetchIPFSData,
  useMangaEventsPagination
} from '@/hooks/useMangaEventsPagination';

/**
 * Dashboard page for displaying manga history from blockchain
 */
const DashboardMangaHistory = () => {
  // Router and URL parameters
  const searchParams = useSearchParams();
  const router = useRouter();
  const mangaId = searchParams.get('manga_id');

  // Local state
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // State để lưu history entries
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

  const {
    data: eventData,
    totalPages,
    isLoading: eventLoading,
    currentPage,
    onPageChange
  } = useMangaEventsPagination(mangaId || '');

  useEffect(() => {
    const fetchHistoryEntries = async () => {
      if (!eventData?.data) return;

      try {
        // Sử dụng Promise.all để fetch parallel
        const entries = await Promise.all(
          eventData.data.map(async (event) => {
            const cid = event.args[1];
            const historyEntry = await fetchIPFSData(cid);
            return historyEntry;
          })
        );

        // Lọc ra các entry không null và sắp xếp theo version
        const validEntries = entries
          .filter((entry): entry is HistoryEntry => entry !== null)
          .sort((a, b) => b.version - a.version);

        setHistoryEntries(validEntries);
        console.log('Fetched history entries:', validEntries);
      } catch (error) {
        console.error('Error fetching history entries:', error);
        toast.error('Failed to fetch history entries');
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchHistoryEntries();
  }, [eventData]);

  /**
   * Handle view details
   */
  const handleViewDetails = useCallback((entry: HistoryEntry) => {
    setSelectedEntry(entry);
    setIsDetailsOpen(true);
  }, []);

  // Get filtered data and unique types
  const filteredHistory = filterHistoryData(
    historyEntries,
    filterType,
    searchTerm
  );
  // const changeTypes = getChangeTypes(historyData);
  const changeTypes = getChangeTypes(historyEntries);

  // Loading state
  if (isInitialLoad) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="text-manga-400 h-8 w-8 animate-spin" />
          <span className="text-manga-400 text-sm">
            Loading manga history...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <h1 className="from-manga-300 to-manga-500 flex items-center gap-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            <History className="text-manga-400 h-8 w-8" />
            Manga History
          </h1>
        </div>
      </div>

      <p className="text-muted-foreground mt-1 mb-6">
        Track all changes made to your manga collection from the blockchain
      </p>

      <Separator className="bg-manga-600/20 my-6" />

      {/* Main Content */}
      <Card className="bg-card/50 border-manga-600/20 animate-fade-in mb-8 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Change History</CardTitle>
        </CardHeader>

        <CardContent>
          {eventLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="text-manga-400 h-8 w-8 animate-spin" />
              <span className="text-manga-400 text-sm">
                Loading version history...
              </span>
            </div>
          ) : (
            <>
              <HistoryFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
                changeTypes={changeTypes}
              />

              {historyEntries.length > 0 ? (
                <>
                  <HistoryTable
                    historyEntries={filteredHistory}
                    // historyEntries={historyEntries}
                    onViewDetails={handleViewDetails}
                  />

                  {totalPages > 1 && (
                    <div className="mt-6">
                      <HistoryPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        isLoading={eventLoading}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  No history entries found
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <HistoryDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen} // Thêm prop này
        selectedEntry={selectedEntry} // Đổi tên từ historyEntry sang selectedEntry
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default DashboardMangaHistory;
