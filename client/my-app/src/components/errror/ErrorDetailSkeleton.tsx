import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const ErrorDetailSkeleton: React.FC = () => (
  <div className="container mx-auto max-w-4xl space-y-6 py-6">
    <Skeleton className="h-8 w-36" /> {/* Back button */}
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <Skeleton className="mb-2 h-7 w-48" /> {/* Title */}
            <Skeleton className="h-4 w-64" /> {/* Description */}
          </div>
          <Skeleton className="h-8 w-24" /> {/* Badge */}
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  </div>
);
