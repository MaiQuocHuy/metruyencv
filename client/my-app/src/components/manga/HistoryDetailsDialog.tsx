import React from 'react';
import { History, Eye, ExternalLink, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { HistoryEntry } from '@/types/history';
import { formatDate, getBadgeVariant } from '@/lib/utils';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

// Custom badge component with truncation
const TruncatedBadge = ({
  text,
  variant = 'default',
  className = ''
}: {
  text: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  className?: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant={variant}
          className={`max-w-[120px] overflow-hidden ${className}`}
        >
          <span className="block truncate">{text}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-xs">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

interface HistoryDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEntry: HistoryEntry | null; // Đổi tên từ historyEntry sang selectedEntry để khớp với code
  onClose?: () => void;
}

const HistoryDetailsDialog = ({
  isOpen,
  onOpenChange,
  selectedEntry, // Đảm bảo tên prop khớp với interface
  onClose
}: HistoryDetailsDialogProps) => {
  if (!selectedEntry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-manga-600/40 bg-card/90 max-w-5xl p-0 backdrop-blur-xl"
        style={{ maxHeight: 'calc(90vh)', overflow: 'hidden' }}
      >
        <DialogHeader className="border-manga-600/20 bg-background/95 sticky top-0 z-10 border-b p-4 backdrop-blur-sm md:p-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <History className="text-manga-400 h-5 w-5" />
              <span className="truncate">
                {selectedEntry.changeLog.description} (v{selectedEntry.version})
              </span>
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="relative h-[calc(90vh-4rem)] w-full overflow-auto">
          <div className="space-y-6 p-4 md:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="border-manga-600/10 bg-background/40 rounded-lg border p-4 shadow-sm">
                <h3 className="text-manga-400 mb-3 flex items-center gap-2 font-medium">
                  <span className="bg-manga-400/10 rounded-full p-1">
                    <History className="text-manga-400 h-4 w-4" />
                  </span>
                  Change Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Type:</span>
                    <TruncatedBadge
                      text={selectedEntry.type}
                      variant={getBadgeVariant(selectedEntry.type)}
                      className="ml-2"
                    />
                  </div>

                  <div className="border-manga-600/10 flex items-center justify-between border-t py-2">
                    <span className="text-muted-foreground text-sm">
                      Version:
                    </span>
                    <span className="bg-background/70 rounded px-2 py-0.5 font-mono text-xs">
                      {selectedEntry.version}
                    </span>
                  </div>

                  <div className="border-manga-600/10 flex items-center justify-between border-t py-2">
                    <span className="text-muted-foreground text-sm">Date:</span>
                    <span className="text-sm">
                      {formatDate(selectedEntry.changeLog.timestamp)}
                    </span>
                  </div>

                  <div className="border-manga-600/10 flex items-center justify-between border-t py-2">
                    <span className="text-muted-foreground text-sm">
                      Previous Version:
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="bg-background/70 max-w-[150px] cursor-help truncate rounded px-2 py-0.5 font-mono text-xs">
                          {selectedEntry.previousVersion || 'None'}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <p className="font-mono text-xs break-all">
                          {selectedEntry.previousVersion}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="border-manga-600/10 bg-background/40 rounded-lg border p-4 shadow-sm">
                <h3 className="text-manga-400 mb-3 flex items-center gap-2 font-medium">
                  <span className="bg-manga-400/10 rounded-full p-1">
                    <ExternalLink className="text-manga-400 h-4 w-4" />
                  </span>
                  Recent Versions
                </h3>
                {selectedEntry.recentVersions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedEntry.recentVersions.map((version) => (
                      <div
                        key={version.cid}
                        className="border-manga-600/10 flex items-center justify-between border-t py-2"
                      >
                        <span className="bg-background/70 rounded px-2 py-0.5 font-mono text-xs">
                          v{version.version}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="max-w-[150px] cursor-help truncate font-mono text-xs">
                              {version.cid}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-mono text-xs break-all">
                              {version.cid}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-muted text-muted-foreground flex h-32 items-center justify-center rounded-md border border-dashed">
                    No previous versions available
                  </div>
                )}
              </div>
            </div>

            <ChangeDetailsTable
              type={selectedEntry.type}
              changes={selectedEntry.changeLog.changes}
              previousVersion={selectedEntry.previousVersion}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ChangeDetailsTableProps {
  changes: HistoryEntry['changeLog']['changes'];
  previousVersion: string;
  type: string;
}

const ChangeDetailsTable = ({
  changes,
  previousVersion,
  type
}: ChangeDetailsTableProps) => {
  console.log('changes', changes);
  if (changes.length === 0) {
    return (
      <div className="border-muted text-muted-foreground flex h-32 items-center justify-center rounded-md border border-dashed">
        No detailed changes recorded
      </div>
    );
  }

  return (
    <div className="border-manga-600/10 bg-background/40 overflow-hidden rounded-lg border shadow-sm">
      <h3 className="border-manga-600/20 text-manga-400 flex items-center gap-2 border-b p-4 font-medium">
        <span className="bg-manga-400/10 rounded-full p-1">
          <Eye className="text-manga-400 h-4 w-4" />
        </span>
        Change Details
      </h3>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-manga-600/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Field</TableHead>
              <TableHead className="font-medium">Old Value</TableHead>
              <TableHead className="font-medium">New Value</TableHead>
              <TableHead className="w-[100px] font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {changes.map((change, index) => {
              // Handle different change types
              if (change.field === 'category_id') {
                // Category changes
                return (
                  <TableRow
                    key={`category-change-${index}-${change.newCategoryId || change.removeCategoryId}`}
                    className="hover:bg-manga-600/5 transition-colors"
                  >
                    <TableCell className="font-medium">Category</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block max-w-[150px] truncate font-mono text-xs">
                            {change.removeCategoryId ? (
                              <TruncatedBadge
                                text={`${change.removeCategoryName} (ID: ${change.removeCategoryId})`}
                                variant="destructive"
                                className="bg-background/60"
                              />
                            ) : (
                              '-'
                            )}
                          </span>
                        </TooltipTrigger>
                        {change.removeCategoryId && (
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-mono text-xs break-all">
                              Removed: {change.removeCategoryName} (ID:{' '}
                              {change.removeCategoryId})
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block max-w-[150px] truncate font-mono text-xs">
                            {change.newCategoryId ? (
                              <TruncatedBadge
                                text={`${change.newCategoryName} (ID: ${change.newCategoryId})`}
                                variant="default"
                                className="bg-background/60"
                              />
                            ) : (
                              '-'
                            )}
                          </span>
                        </TooltipTrigger>
                        {change.newCategoryId && (
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-mono text-xs break-all">
                              Added: {change.newCategoryName} (ID:{' '}
                              {change.newCategoryId})
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                );
              } else if (change.field) {
                // Check if this is a chapter content change
                const isChapContent =
                  change.field === 'chap_content' &&
                  change.oldValue &&
                  change.newValue;

                // Regular field update
                return (
                  <TableRow
                    key={`field-${change.field}-${index}`}
                    className="hover:bg-manga-600/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {change.field}
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block max-w-[150px] truncate font-mono text-xs">
                            {change.oldValue ||
                              (change.newCategoryId
                                ? `Category ID: ${change.newCategoryId}`
                                : 'N/A') ||
                              (change.removeCategoryId
                                ? `Category ID: ${change.removeCategoryId}`
                                : 'N/A')}
                          </span>
                        </TooltipTrigger>
                        {(change.oldValue || change.newCategoryId) && (
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-mono text-xs break-all">
                              {change.oldValue ||
                                (change.newCategoryId
                                  ? `Category ID: ${change.newCategoryId}`
                                  : 'N/A') ||
                                (change.removeCategoryId
                                  ? `Category ID: ${change.removeCategoryId}`
                                  : 'N/A')}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block max-w-[150px] truncate font-mono text-xs">
                            {change.newValue ||
                              (change.newCategoryName
                                ? change.newCategoryName
                                : 'N/A') ||
                              (change.removeCategoryName
                                ? change.removeCategoryName
                                : 'N/A')}
                          </span>
                        </TooltipTrigger>
                        {change.newValue && (
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-mono text-xs break-all">
                              {change.newValue ||
                                (change.newCategoryName
                                  ? `Category name: ${change.newCategoryName}`
                                  : 'N/A') ||
                                (change.removeCategoryName
                                  ? `Category name: ${change.removeCategoryName}`
                                  : 'N/A')}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {isChapContent && (
                        <Link
                          href={`/dashboard/manga/compare?oldcid=${change.oldValue}&newcid=${change.newValue}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-manga-600/20 h-8 w-8 rounded-full p-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Compare</span>
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                );
              } else if (change.manga_title) {
                // CreateManga type
                return (
                  <React.Fragment
                    key={`manga-create-${change.manga_id || index}`}
                  >
                    <TableRow
                      key={`manga-title-${index}`}
                      className="hover:bg-manga-600/5 transition-colors"
                    >
                      <TableCell className="font-medium">Title</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{change.manga_title}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow
                      key={`manga-author-${index}`}
                      className="hover:bg-manga-600/5 transition-colors"
                    >
                      <TableCell className="font-medium">Author</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{change.manga_author}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow
                      key={`manga-slug-${index}`}
                      className="hover:bg-manga-600/5 transition-colors"
                    >
                      <TableCell className="font-medium">Slug</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-block max-w-[150px] truncate font-mono text-xs">
                              {change.manga_slug}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-mono text-xs break-all">
                              {change.manga_slug}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow
                      key={`manga-id-${index}`}
                      className="hover:bg-manga-600/5 transition-colors"
                    >
                      <TableCell className="font-medium">ID</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-mono text-xs">
                        {change.manga_id}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {change.categories && (
                      <TableRow
                        key={`manga-categories-${index}`}
                        className="hover:bg-manga-600/5 transition-colors"
                      >
                        <TableCell className="font-medium">
                          Categories
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {change.categories.map((cat, index) => (
                              <TruncatedBadge
                                key={index}
                                text={cat.newCategoryName}
                                variant="outline"
                                className="bg-background/60"
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                    <TableRow
                      key={`manga-thumbnail-${index}`}
                      className="hover:bg-manga-600/5 pb-3 transition-colors"
                    >
                      <TableCell className="font-medium">Thumb_nail</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="flex-col font-mono text-xs">
                        {change.manga_thumb && (
                          <img
                            src={
                              change.manga_thumb
                                ? '/placeholder.jpg'
                                : change.manga_thumb
                            }
                            alt="Thumbnail"
                            className="mb-3 h-16 w-16 rounded-md object-cover"
                          />
                        )}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              } else if (change.chap_id) {
                // CreateChapter type
                const hasContent = change.chap_content;

                return (
                  <React.Fragment
                    key={`chapter-create-${change.chap_id || index}`}
                  >
                    <TableRow
                      key={`chapter-id-${index}`}
                      className="hover:bg-manga-600/5 transition-colors"
                    >
                      <TableCell className="font-medium">Chapter ID</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-mono text-xs">
                        {change.chap_id}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow
                      key={`chapter-title-${index}`}
                      className="hover:bg-manga-600/5 transition-colors"
                    >
                      <TableCell className="font-medium">Title</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-block max-w-[150px] truncate">
                              {change.chap_title}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">{change.chap_title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow
                      key={`chapter-number-${index}`}
                      className="hover:bg-manga-600/5 transition-colors"
                    >
                      <TableCell className="font-medium">Number</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{change.chap_number}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow
                      key={`chapter-content-${index}`}
                      className="hover:bg-manga-600/5 transition-colors"
                    >
                      <TableCell className="font-medium">
                        chap_content
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-block max-w-[150px] truncate font-mono text-xs">
                              {change.chap_content}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-mono text-xs break-all">
                              {change.chap_content}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {hasContent && (
                          <Link
                            href={`/dashboard/manga/compare?remaincid=${change.chap_content}`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-manga-600/20 h-8 w-8 rounded-full p-0"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Content</span>
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              } else {
                // Empty change (e.g. for publish/unpublish)
                return (
                  <TableRow
                    key={`empty-change-${index}`}
                    className="hover:bg-manga-600/5 transition-colors"
                  >
                    <TableCell
                      colSpan={4}
                      className="text-muted-foreground py-4 text-center"
                    >
                      No specific fields were changed
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryDetailsDialog;
