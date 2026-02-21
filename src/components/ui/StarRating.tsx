import * as React from 'react';
import { Star } from 'lucide-react';

import { cn } from './Utils';

type StarRatingSize = 'sm' | 'md' | 'lg';

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: StarRatingSize;
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
};

const sizeClasses: Record<StarRatingSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
  className
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);

  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(null);
    }
  };

  return (
    <div
      data-slot="star-rating"
      className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          const isPartiallyFilled =
            starValue > Math.floor(displayRating) &&
            starValue <= Math.ceil(displayRating);
          const fillPercentage = isPartiallyFilled
            ? (displayRating % 1) * 100
            : 0;

          return (
            <div
              key={index}
              className={cn(
                'relative',
                interactive &&
                  'cursor-pointer transition-transform hover:scale-110'
              )}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}>
              {isPartiallyFilled ? (
                <div className="relative">
                  <Star
                    className={cn(sizeClasses[size], 'text-muted-foreground')}
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${fillPercentage}%` }}>
                    <Star
                      className={cn(
                        sizeClasses[size],
                        'fill-yellow-400 text-yellow-400'
                      )}
                    />
                  </div>
                </div>
              ) : (
                <Star
                  className={cn(
                    sizeClasses[size],
                    isFilled
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground',
                    interactive && 'transition-colors'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export type { StarRatingProps, StarRatingSize };
