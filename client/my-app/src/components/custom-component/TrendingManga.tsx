import { TrendingUp } from 'lucide-react';
import { useGetTrendingMangaQuery } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface TrendingMangaProps {
  limit?: number;
}

export const TrendingManga = ({ limit = 3 }: TrendingMangaProps) => {
  const { data: manga, isLoading, error } = useGetTrendingMangaQuery(limit);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="w-12 h-16 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="text-sm text-muted-foreground">
        Unable to load trending manga.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {manga.map((item) => (
        <Link 
          key={item.id} 
          href={`/manga/${item.id}`}
          className="flex items-start gap-3 group"
        >
          <img 
            src={item.coverImage} 
            alt={item.title} 
            className="w-12 h-16 object-cover rounded-md group-hover:opacity-90 transition-opacity"
          />
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-sm line-clamp-2 group-hover:text-manga-400 transition-colors">
              {item.title}
            </h5>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-manga-500" />
              <span className="text-xs text-muted-foreground">
                {item.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
