import { Star, User, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

import useOrganizerReviews from '@/features/organizer/hooks/useOrganizerReviews';
import { formatRelativeTime, getInitials } from '@/features/events/helpers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/Pagination';

type OrganizerReviewsTabProps = {
  organizerId: string;
  averageRating: number;
  totalReviews: number;
};

function RatingSummary({
  averageRating,
  totalReviews
}: {
  averageRating: number;
  totalReviews: number;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl mb-5">
      <div className="text-center">
        <div className="text-3xl sm:text-4xl font-bold text-foreground">
          {totalReviews > 0 ? averageRating.toFixed(1) : '—'}
        </div>
        <StarRating
          rating={averageRating}
          size="sm"
          className="justify-center mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      <div className="h-12 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <p className="text-sm text-muted-foreground">
          Average rating across all events
        </p>
      </div>
    </div>
  );
}

export default function OrganizerReviewsTab({
  organizerId,
  averageRating,
  totalReviews
}: OrganizerReviewsTabProps) {
  const { reviews, pagination, isLoading, page, setPage } =
    useOrganizerReviews(organizerId);

  return (
    <div className="space-y-4">
      <RatingSummary
        averageRating={averageRating}
        totalReviews={totalReviews}
      />

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 pb-4 border-b border-border">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && reviews.length === 0 && (
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          description="This organizer hasn't received any reviews yet."
        />
      )}

      {/* Review list */}
      {!isLoading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map(review => (
            <div
              key={review.id}
              className="pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  {review.user?.profilePictureUrl && (
                    <AvatarImage
                      src={review.user.profilePictureUrl}
                      alt={review.user.fullName}
                    />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {review.user ? (
                      getInitials(review.user.fullName)
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {review.user?.fullName || 'Anonymous'}
                      </p>
                      {review.event && (
                        <Link
                          to={`/events/${review.event.slug}`}
                          className="text-xs text-primary hover:underline flex items-center gap-0.5 mt-0.5">
                          <ExternalLink className="h-3 w-3" />
                          {review.event.name}
                        </Link>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatRelativeTime(review.createdAt)}
                    </span>
                  </div>

                  <StarRating
                    rating={review.rating}
                    size="sm"
                    className="mb-2"
                  />

                  {review.reviewText && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.reviewText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {pagination && pagination.totalPages > 1 && (
            <div className="pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(page - 1)}
                      aria-disabled={page === 1}
                      className={
                        page === 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map(p => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(page + 1)}
                      aria-disabled={page === pagination.totalPages}
                      className={
                        page === pagination.totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
