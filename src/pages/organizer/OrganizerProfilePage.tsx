import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, LayoutGrid, MessageSquare } from 'lucide-react';

import useOrganizerProfile from '@/features/organizer/hooks/useOrganizerProfile';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

import OrganizerProfileHeader from './components/OrganizerProfileHeader';
import OrganizerEventsTab from './components/OrganizerEventsTab';
import OrganizerReviewsTab from './components/OrganizerReviewsTab';

function OrganizerProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      {/* Banner + header */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <Skeleton className="h-24 sm:h-32 w-full" />
        <div className="px-4 sm:px-8 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-card" />
            <Skeleton className="h-7 w-28" />
          </div>
          <Skeleton className="h-7 w-48 mb-1" />
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="space-y-2 mb-5">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-60 rounded-xl" />

      {/* Event cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-16/10 w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrganizerProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const { profile, isLoading, notFound } = useOrganizerProfile(username);

  if (isLoading) return <OrganizerProfileSkeleton />;

  if (notFound || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          icon="alert"
          title="Organizer Not Found"
          description="This organizer profile doesn't exist or is no longer available."
          action={{
            label: 'Browse Events',
            onClick: () => navigate('/events')
          }}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground -ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Profile header card */}
        <OrganizerProfileHeader profile={profile} />

        {/* Tabs */}
        <Tabs defaultValue="events">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger
              value="events"
              className="flex items-center gap-1.5 px-4">
              <LayoutGrid className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="flex items-center gap-1.5 px-4">
              <MessageSquare className="h-4 w-4" />
              <span>Reviews</span>
              {profile.stats.totalReviews > 0 && (
                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {profile.stats.totalReviews}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-5">
            <OrganizerEventsTab organizerId={profile.id} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-5">
            <OrganizerReviewsTab
              organizerId={profile.id}
              averageRating={profile.stats.averageRating}
              totalReviews={profile.stats.totalReviews}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
