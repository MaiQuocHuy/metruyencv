'use client';

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  useGetErrorByIdQuery,
  useFixErrorMutation,
  useManageErrorMutation
} from '@/services/apiError';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  User,
  Calendar,
  Tag,
  MessageSquare,
  BookOpen,
  FileText,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ErrorDetailSkeleton } from '@/components/errror/ErrorDetailSkeleton'; // Assuming this exists and is correctly implemented
import { toast } from 'sonner';

// Helper to render user info
const UserInfo: React.FC<{
  user: { usr_id: number; usr_name: string } | null;
  label: string;
  icon: React.ElementType;
}> = ({ user, label, icon: Icon }) => (
  <div className="flex items-center gap-3">
    <Icon className="text-muted-foreground h-5 w-5 flex-shrink-0" />
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <span className="text-muted-foreground text-sm">{label}:</span>
      {user ? (
        <span className="font-medium">{user.usr_name}</span>
      ) : (
        <span className="text-muted-foreground text-sm italic">N/A</span>
      )}
    </div>
  </div>
);

// Helper to render detail item
const DetailItem: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
}> = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    <Icon className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  </div>
);

export default function ErrorDetailPage() {
  const params = useParams();
  const searchparams = useSearchParams();
  const router = useRouter();
  const errorId = params.errorid as string;

  // Consider fetching these details via API if search params are unreliable
  const mangaTitle = searchparams.get('manga_title') || 'Loading...';
  const chapTitle = searchparams.get('chap_title') || 'Loading...';
  const chapNumber = searchparams.get('chap_number') || 'N/A';

  const {
    data: errorDetail,
    isLoading,
    isError,
    error
  } = useGetErrorByIdQuery(parseInt(errorId), {
    skip: !errorId
  });

  if (isLoading) {
    // Ensure ErrorDetailSkeleton returns a single valid React element
    return <ErrorDetailSkeleton />;
  }

  if (isError || !errorDetail) {
    const errorMessage =
      error && 'data' in error && (error.data as any)?.message
        ? (error.data as any).message
        : 'Failed to load error details or report not found.';
    return (
      <div className="container mx-auto flex h-[calc(100vh-150px)] flex-col items-center justify-center space-y-4 py-6 text-center">
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h2 className="text-destructive text-xl font-semibold">
          Loading Error
        </h2>
        <p className="text-muted-foreground">{errorMessage}</p>
        <Button variant="outline" asChild className="mt-6">
          <Link href="/dashboard/errors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Link>
        </Button>
      </div>
    );
  }

  const {
    report_description,
    report_kind_of_error,
    is_fixed,
    createdAt,
    updatedAt,
    UserReportError,
    AdminManageError,
    report_chapter_id
  } = errorDetail;

  // Prefer data from API if available
  // const displayMangaTitle = errorDetail.manga_title || mangaTitle;
  // const displayChapterNumber = errorDetail.chap_number || chapNumber;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      {/* Back Button */}
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href="/dashboard/errors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Error List
        </Link>
      </Button>

      {/* Main Detail Card */}
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-2xl font-semibold">
                Error Report Details
              </CardTitle>
              <CardDescription className="mt-1">
                Issue ID: <span className="font-mono">#{errorId}</span>
              </CardDescription>
            </div>
            <Badge
              variant={is_fixed ? 'default' : 'destructive'} // Changed 'default' to 'success'
              className="flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm"
            >
              {is_fixed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              {is_fixed ? 'Fixed' : 'Not Fixed'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8 p-6 md:grid-cols-2">
          {/* Left Column - Issue Info */}
          <div className="space-y-5">
            <h3 className="text-foreground mb-3 text-lg font-medium">
              Issue Information
            </h3>
            <DetailItem
              label="Manga Title"
              value={mangaTitle} // Use displayMangaTitle if API provides it
              icon={BookOpen}
            />
            <DetailItem
              label="Chapter Number"
              value={chapNumber} // Use displayChapterNumber if API provides it
              icon={FileText}
            />
            <Separator className="my-4" />
            <DetailItem
              label="Report Type"
              value={
                <Badge
                  variant="outline"
                  className="border-primary/50 bg-primary/10 text-primary capitalize"
                >
                  {report_kind_of_error.replace(/-/g, ' ')}
                </Badge>
              }
              icon={Tag}
            />
            <DetailItem
              label="Description"
              value={
                <p className="whitespace-pre-wrap">
                  {report_description || (
                    <span className="text-muted-foreground italic">
                      No description provided.
                    </span>
                  )}
                </p>
              }
              icon={MessageSquare}
            />
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-5">
            <h3 className="text-foreground mb-3 text-lg font-medium">
              Metadata
            </h3>
            <DetailItem
              label="Reported At"
              value={formatDate(createdAt)}
              icon={Calendar}
            />
            <UserInfo user={UserReportError} label="Reported By" icon={User} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
