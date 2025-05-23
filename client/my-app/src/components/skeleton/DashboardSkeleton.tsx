import { Skeleton } from '../ui/skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="border-border bg-background hidden w-64 border-r md:block">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex-1 space-y-1 p-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 rounded-md p-2"
                >
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
          </div>
        </div>
      </div>
      <main className="flex flex-1 overflow-hidden p-4">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="block md:hidden">
              <Skeleton className="h-10 w-10" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="mt-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;
