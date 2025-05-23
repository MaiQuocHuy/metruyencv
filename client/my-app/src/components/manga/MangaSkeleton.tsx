import { Skeleton } from '@/components/ui/skeleton';

export function MangaDetailSkeleton() {
  return (
    <div className="flex flex-col items-center">
      {/* Banner Skeleton */}
      <Skeleton className="relative h-[40vh] w-full" />

      <div className="container py-6 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Left Column Skeleton */}
          <div className="col-span-1">
            <div className="sticky top-20">
              {/* Cover Image Skeleton */}
              <Skeleton className="border-border mb-6 aspect-[3/4] w-full rounded-lg border" />

              {/* Info Box Skeleton */}
              <div className="bg-card border-border mb-6 rounded-lg border p-4">
                <Skeleton className="mb-4 h-6 w-3/4" /> {/* Info Title */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" /> {/* Start Reading */}
                <div className="grid grid-cols-3 gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="mb-6">
              {/* Title Skeleton */}
              <Skeleton className="mb-2 h-8 w-3/4 md:h-10" />
              {/* Statistics Skeleton */}
              <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              {/* Categories Skeleton */}
              <div className="mb-4 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              {/* Synopsis Skeleton */}
              <div className="bg-card border-border mb-6 rounded-lg border p-4">
                <Skeleton className="mb-3 h-5 w-1/4" />{' '}
                {/* Description Title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              {/* Tabs Skeleton */}
              <Skeleton className="mb-1 h-10 w-full rounded-none border-b" />{' '}
              {/* Tab List */}
              <div className="space-y-3 pt-4">
                {/* Chapter List Skeleton */}
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
