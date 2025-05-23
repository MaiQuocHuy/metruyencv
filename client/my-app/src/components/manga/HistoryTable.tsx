import React, { useState, useEffect } from 'react';
import { Eye, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatDate, getBadgeVariant } from '@/lib/utils';
import { HistoryEntry } from '@/types/history';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryTableProps {
  historyEntries: HistoryEntry[];
  onViewDetails: (entry: HistoryEntry) => void;
  onViewCompleteHistory?: (entry: HistoryEntry) => void;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isTransitioning?: boolean;
}

/**
 * Generate a unique key for a history entry
 * @param entry - The history entry
 * @param index - The index in the array
 * @returns A unique key string
 */
const generateUniqueKey = (entry: HistoryEntry, index: number): string => {
  // Use a combination of type, version, timestamp, and index to ensure uniqueness
  const timestamp = entry.changeLog?.timestamp || '';
  const timestampPart = timestamp.replace(/[^0-9]/g, '').slice(-6);
  return `${entry.type}-${entry.version}-${timestampPart}-${index}`;
};

const HistoryTable = ({
  historyEntries,
  onViewDetails,
  onViewCompleteHistory,
  itemsPerPage = 5,
  currentPage: externalCurrentPage,
  onPageChange,
  isTransitioning = false
}: HistoryTableProps) => {
  // Use internal state for pagination if not controlled externally
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  console.log('HistoryTable', historyEntries);
  // Determine if we're using controlled or uncontrolled pagination
  const isControlled =
    externalCurrentPage !== undefined && onPageChange !== undefined;
  const currentPage = isControlled ? externalCurrentPage : internalCurrentPage;

  // Calculate total pages
  const totalPages = Math.ceil(historyEntries.length / itemsPerPage);

  // Get current page entries
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    if (isControlled) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  // Reset to page 1 when entries change
  useEffect(() => {
    if (!isControlled) {
      setInternalCurrentPage(1);
    }
  }, [historyEntries.length, isControlled]);

  return (
    <div className="relative min-h-[400px]">
      {' '}
      {/* Add relative positioning */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            delay: isTransitioning ? 0.3 : 0
          }}
          className="absolute w-full"
        >
          <div className="space-y-4">
            <div className="border-manga-600/20 overflow-hidden rounded-md border">
              <Table>
                <TableHeader className="bg-manga-600/20">
                  <TableRow>
                    <TableHead className="w-[60px]">Version</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyEntries.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-muted-foreground h-[300px] text-center"
                      >
                        No history records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {historyEntries
                        .slice(startIndex, endIndex)
                        .map((entry, index) => (
                          <TableRow
                            key={generateUniqueKey(entry, index)}
                            className="border-manga-600/10 hover:bg-manga-600/5 h-[60px] border-t"
                          >
                            <TableCell className="font-mono">
                              <div className="opacity-100">{entry.version}</div>
                            </TableCell>
                            <TableCell>
                              <div className="opacity-100">
                                <Badge variant={getBadgeVariant(entry.type)}>
                                  {entry.type}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="opacity-100">
                                {entry.changeLog.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="opacity-100">
                                {formatDate(entry.changeLog.timestamp)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2 opacity-100">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onViewDetails(entry)}
                                  className="hover:bg-manga-600/10"
                                >
                                  <Eye className="mr-1 h-4 w-4" />
                                  Details
                                </Button>
                                {onViewCompleteHistory &&
                                  entry.previousVersion && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        onViewCompleteHistory(entry)
                                      }
                                      className="hover:bg-manga-600/10"
                                    >
                                      <History className="mr-1 h-4 w-4" />
                                      History
                                    </Button>
                                  )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      {Array.from({
                        length: Math.max(
                          0,
                          itemsPerPage -
                            historyEntries.slice(startIndex, endIndex).length
                        )
                      }).map((_, index) => (
                        <TableRow
                          key={`empty-${index}`}
                          className="h-[60px] border-none" // Add border-none to remove borders
                        >
                          <TableCell
                            colSpan={5}
                            className="border-0" // Remove cell borders
                          >
                            &nbsp;
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HistoryTable;
