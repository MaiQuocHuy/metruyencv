import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface MangaRatingProps {
  initialRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const MangaRating: React.FC<MangaRatingProps> = ({
  initialRating = 0,
  size = 'md',
  readonly = false,
  onRatingChange,
  className
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (selectedRating: number) => {
    if (readonly) return;

    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }

    toast('Rating Submitted', {
      description: `You've rated this manga ${selectedRating} stars!`
    });
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TooltipProvider key={star} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  'transform transition-all duration-200 hover:scale-110 focus:outline-none',
                  readonly ? 'cursor-default' : 'cursor-pointer'
                )}
                onMouseEnter={() => !readonly && setHoverRating(star)}
                onMouseLeave={() => !readonly && setHoverRating(0)}
                onClick={() => handleClick(star)}
                disabled={readonly}
              >
                <Star
                  className={cn(
                    starSizes[size],
                    'transition-colors duration-200',
                    (hoverRating || rating) >= star
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground fill-transparent'
                  )}
                  strokeWidth={2}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-background border-border border px-2 py-1 text-xs"
            >
              {star} {star === 1 ? 'Star' : 'Stars'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default MangaRating;
