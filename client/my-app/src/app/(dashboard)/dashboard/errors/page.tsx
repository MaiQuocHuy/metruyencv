'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Check, // Import Check icon
  BookOpen
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  useGetErrorsQuery,
  useFixErrorMutation, // Import the mutation hook
  useDeleteErrorMutation
} from '@/services/apiError';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner'; // Assuming you use sonner for toasts
import { ErrorPagination } from '@/components/errror/ErrorPagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import ReporterName from '@/components/errror/ReportName';

const ErrorReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // Default to showing 'Not Fixed' reports initially
  const [isFixedFilter, setIsFixedFilter] = useState<string>('false');
  // Default to showing 'Not Managed' reports initially (adjust if needed)
  const [isManagedFilter, setIsManagedFilter] = useState<string>('false');
  const [currentPage, setCurrentPage] = useState(1); // For pagination if needed
  const [itemsPerPage, setItemsPerPage] = useState(10); // For pagination if needed
  const {
    data: errorReports,
    isLoading: loadingErrorReports,
    isError: errorLoadingErrorReports,
    refetch // Add refetch to update list after mutation
  } = useGetErrorsQuery({
    isFixed: isFixedFilter === 'all' ? undefined : isFixedFilter,
    isManaged: isFixedFilter,
    page: currentPage,
    limit: itemsPerPage
  });

  const [
    fixError,
    { isLoading: isFixingError } // Get mutation trigger and loading state
  ] = useFixErrorMutation();

  const [
    deleteError,
    { isLoading: isDeletingError } // Get mutation trigger and loading state
  ] = useDeleteErrorMutation(); // Assuming you have a delete mutation

  // Handle marking an error as fixed
  const handleFixError = async (reportId: number) => {
    try {
      await fixError(reportId).unwrap(); // Call mutation and handle promise
      toast.success('Report marked as fixed successfully!');
      // Optionally refetch the list to update the UI immediately
      // refetch(); // Or rely on cache invalidation if set up correctly
    } catch (err) {
      console.log('Failed to fix error:', err);
      toast.error('Failed to mark report as fixed.');
    }
  };

  const handleDeleteError = async (reportId: number) => {
    try {
      // Call your delete mutation here (assuming you have one)
      await deleteError(reportId).unwrap();
      toast.success('Report deleted successfully!');
    } catch (err) {
      console.log('Failed to delete error:', err);
      toast.error('Failed to delete report.');
    }
  };

  // Filter reports based on search and status
  const filteredReports =
    errorReports?.errors?.filter((report) => {
      const reportText = report.chapter.manga.manga_title.toLowerCase();
      const matchesSearch = reportText.includes(searchQuery.toLowerCase());
      // Filtering is now handled by the API query parameters
      return matchesSearch;
    }) ?? []; // Ensure it's always an array
  const totalItems = errorReports?.total ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handler for page changes from the pagination component
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Optional: Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
          Error Reports Management
        </h1>
        <p className="text-muted-foreground">
          Monitor, manage, and resolve reported issues.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search reports (manga)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={isFixedFilter} onValueChange={setIsFixedFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by Fix Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Fixed</SelectItem>
            <SelectItem value="false">Not Fixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Report List</CardTitle>
          <CardDescription>
            List of reported issues. Click 'Mark as Fixed' to resolve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Issue Details</TableHead>
                <TableHead>Manga / Chapter</TableHead>
                <TableHead>Reported At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingErrorReports ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading reports...
                  </TableCell>
                </TableRow>
              ) : errorLoadingErrorReports ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-destructive h-24 text-center"
                  >
                    Failed to load reports.
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No reports found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.report_id}>
                    <TableCell>
                      <div className="font-medium">
                        {report.report_description || 'No description'}
                      </div>
                      <div className="text-muted-foreground text-xs capitalize">
                        Type: {report.report_kind_of_error.replace('-', ' ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground text-xs">
                        {report.chapter.manga.manga_title} / Ch.{' '}
                        {report!!.chapter.chap_number}
                      </div>
                    </TableCell>

                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={report.is_fixed ? 'default' : 'destructive'}
                        className="flex w-fit items-center gap-1"
                      >
                        {report.is_fixed ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {report.is_fixed ? 'Fixed' : 'Not Fixed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Clock className="h-4 w-4" />
                            Manage
                          </Button>
                        </DropdownMenuTrigger>

                        {/* Add Button Delete */}
                        <DropdownMenuContent
                          align="end"
                          className="bg-card/90 border-manga-600/40 backdrop-blur-xl"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteError(report.report_id)}
                          >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Delete Report
                          </DropdownMenuItem>
                          {!report.is_fixed && (
                            <DropdownMenuItem
                              onClick={() => handleFixError(report.report_id)}
                              className="cursor-pointer"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Fixed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link
                              href={`/dashboard/errors/${report.report_id}?manga_title=${report.chapter.manga.manga_title}&chap_title=${report.chapter.chap_title}&chap_number=${report.chapter.chap_number}`}
                              className="flex w-full"
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              View details
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <ErrorPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorReports;
