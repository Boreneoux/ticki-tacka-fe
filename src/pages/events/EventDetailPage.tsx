import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronLeft, Star } from 'lucide-react';
import toast from 'react-hot-toast';

import useAuthStore from '@/stores/useAuthStore';
import useEventDetail from '@/features/events/hooks/useEventDetail';
import useEventReviews from '@/features/events/hooks/useEventReviews';
import useReviewEligibility from '@/features/events/hooks/useReviewEligibility';
import {
  formatDate,
  formatShortDate,
  formatTime
} from '@/features/events/helpers';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

import ImageGallery from '@/features/events/components/ImageGallery';
import TicketTypesList from '@/features/events/components/TicketTypesList';
import ReviewSection from '@/features/events/components/ReviewSection';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function EventDetailSkeleton() {
  return (
    <div className="min-h-[80vh]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-9 w-20 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <Skeleton className="w-full aspect-video rounded-xl" />

              {/* Event info */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                  <Skeleton className="h-px w-full" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-28 w-full" />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isLogin, role, username: currentUsername } = useAuthStore();

  const { event, ticketTypes, isLoading, error } = useEventDetail(slug);

  const {
    reviews,
    pagination: reviewPagination,
    averageRating,
    totalReviews,
    isLoading: isReviewsLoading,
    isSubmitting,
    submitReview,
    setPage: setReviewPage
  } = useEventReviews(event?.id);

  const isPastEvent = event ? new Date(event.eventDate) < new Date() : false;

  const { canReview, reason: eligibilityReason } = useReviewEligibility(
    event?.id,
    isLogin,
    isPastEvent,
    reviews.map(r => r.user?.username).filter(Boolean) as string[],
    currentUsername
  );

  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

  if (isLoading) return <EventDetailSkeleton />;

  if (error || !event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          icon="alert"
          title="Event Not Found"
          description="The event you're looking for doesn't exist or has been removed."
          action={{
            label: 'Browse Events',
            onClick: () => navigate('/events')
          }}
          variant="card"
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const eventImages: string[] = event.eventImages?.length
    ? event.eventImages.map(img => img.imageUrl)
    : event.images?.length
      ? event.images
      : [];

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleTicketQtyChange = (ticketId: string, delta: number) => {
    setSelectedTickets(prev => {
      const currentQty = prev[ticketId] ?? 0;
      const ticket = ticketTypes.find(t => t.id === ticketId);
      const maxQty = ticket ? ticket.availableQuota : 0;
      const newQty = Math.max(0, Math.min(currentQty + delta, maxQty, 10));

      if (newQty === 0) {
        const { [ticketId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [ticketId]: newQty };
    });
  };

  const handleCheckout = () => {
    if (!isLogin) {
      toast.error('Please sign in to purchase tickets');
      navigate('/login');
      return;
    }

    if (role === 'EO') {
      toast.error('Event organizers cannot purchase tickets');
      return;
    }

    const totalTickets = Object.values(selectedTickets).reduce(
      (sum, qty) => sum + qty,
      0
    );
    if (totalTickets === 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    navigate(`/events/${event.slug}/checkout`, {
      state: { selectedTickets, event }
    });
  };

  const handleSubmitReview = async (payload: {
    rating: number;
    reviewText?: string;
  }): Promise<boolean> => {
    if (!isLogin) {
      toast.error('Please sign in to write a review');
      navigate('/login');
      return false;
    }

    const success = await submitReview(payload);
    if (success) {
      toast.success('Review submitted successfully!');
    } else {
      toast.error(
        'Failed to submit review. You may have already reviewed this event or are not eligible.'
      );
    }
    return success;
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-[80vh]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ----------------------------------------------------------------
                Main content — 2 / 3 columns
            ---------------------------------------------------------------- */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image gallery */}
              {eventImages.length > 0 && (
                <Card className="border-0 shadow-lg overflow-hidden">
                  <ImageGallery
                    images={eventImages}
                    eventName={event.name}
                    categoryName={event.category?.name}
                  />
                </Card>
              )}

              {/* Event info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {event.category && (
                        <Badge className="mb-3">{event.category.name}</Badge>
                      )}
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                        {event.name}
                      </h1>
                      {event.organizer && (
                        <p className="text-sm text-muted-foreground">
                          By{' '}
                          <Link
                            to={`/organizers/${event.organizer.user?.username}`}
                            className="font-medium text-primary hover:underline">
                            {event.organizer.organizerName}
                          </Link>
                        </p>
                      )}
                    </div>

                    {totalReviews > 0 && (
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg shrink-0">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-foreground">
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({totalReviews})
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Date/time & venue */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Date & Time
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(event.eventDate)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(event.eventTime)} WIB
                          {event.endDate && (
                            <span>
                              {' — '}
                              {formatShortDate(event.endDate)}
                              {event.endTime &&
                                ` ${formatTime(event.endTime)} WIB`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Venue
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.venueName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.venueAddress}
                        </p>
                        {event.city && (
                          <p className="text-sm text-muted-foreground">
                            {event.city.name}
                            {event.city.province &&
                              `, ${event.city.province.name}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Description */}
                  <div>
                    <h2 className="font-bold text-lg text-foreground mb-3">
                      About This Event
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <ReviewSection
                apiReviews={reviews}
                apiAverageRating={averageRating}
                apiTotalReviews={totalReviews}
                pagination={reviewPagination}
                isLoading={isReviewsLoading}
                isSubmitting={isSubmitting}
                isPastEvent={isPastEvent}
                canReview={canReview}
                eligibilityReason={eligibilityReason}
                onSubmitReview={handleSubmitReview}
                onPageChange={setReviewPage}
              />
            </div>

            {/* ----------------------------------------------------------------
                Sidebar — 1 / 3 columns
            ---------------------------------------------------------------- */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <TicketTypesList
                  ticketTypes={ticketTypes}
                  vouchers={event.vouchers}
                  isPastEvent={isPastEvent}
                  isLoggedIn={isLogin}
                  selectedTickets={selectedTickets}
                  onTicketQtyChange={handleTicketQtyChange}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
