import { useState } from 'react';
import { Star, User, MessageSquare, Loader2 } from 'lucide-react';

import type { Review, Pagination as PaginationType } from '@/types/models';
import type { CreateReviewPayload } from '../types';
import { formatRelativeTime, getInitials } from '../helpers';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import StarRating from '@/components/ui/StarRating';
import Textarea from '@/components/ui/Textarea';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/Pagination';

type ReviewSectionProps = {
  apiReviews: Review[];
  apiAverageRating: number;
  apiTotalReviews: number;
  pagination: PaginationType | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isPastEvent: boolean;
  canReview: boolean;
  eligibilityReason?: string | null;
  onSubmitReview: (payload: CreateReviewPayload) => Promise<boolean>;
  onPageChange: (page: number) => void;
};

export default function ReviewSection({
  apiReviews,
  apiAverageRating,
  apiTotalReviews,
  pagination,
  isLoading,
  isSubmitting,
  isPastEvent,
  canReview,
  eligibilityReason,
  onSubmitReview,
  onPageChange
}: ReviewSectionProps) {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const reviews = apiReviews;
  const averageRating = apiAverageRating;
  const totalReviews = apiTotalReviews;

  const handleSubmit = async () => {
    const success = await onSubmitReview({
      rating: reviewRating,
      reviewText: reviewComment || undefined
    });

    if (success) {
      setReviewComment('');
      setReviewRating(5);
    }
  };

  return (
    <Card className="border-0 shadow-lg" id="reviews">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Reviews ({totalReviews})</span>
          </div>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} size="md" />
              <span className="text-lg font-bold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {canReview && (
          <div className="bg-muted/50 rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Write a Review
            </h4>

            <div className="space-y-2">
              <Label>Your Rating</Label>
              <StarRating
                rating={reviewRating}
                size="lg"
                interactive
                onChange={setReviewRating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-text">Comment (Optional)</Label>
              <Textarea
                id="review-text"
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your experience at this event..."
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        )}

        {!canReview && isPastEvent && eligibilityReason && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span>{eligibilityReason}</span>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description={
              isPastEvent
                ? 'Be the first to share your experience!'
                : 'Reviews will be available after the event ends.'
            }
          />
        )}

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
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-sm text-foreground truncate">
                        {review.user?.fullName || 'Anonymous'}
                      </p>
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
                        onClick={() => onPageChange(pagination.currentPage - 1)}
                        aria-disabled={pagination.currentPage === 1}
                        className={
                          pagination.currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === pagination.currentPage}
                          onClick={() => onPageChange(page)}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => onPageChange(pagination.currentPage + 1)}
                        aria-disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                        className={
                          pagination.currentPage === pagination.totalPages
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
      </CardContent>
    </Card>
  );
}
