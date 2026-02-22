import { useState } from 'react';

import useOrganizerEvents from '@/features/organizer/hooks/useOrganizerEvents';
import type { OrganizerPublicEventsParams } from '@/features/organizer/types';
import EventCard from '@/components/EventCard';
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
import { Calendar } from 'lucide-react';

type StatusFilter = 'all' | 'published' | 'completed';

type OrganizerEventsTabProps = {
  organizerId: string;
};

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All Events', value: 'all' },
  { label: 'Upcoming', value: 'published' },
  { label: 'Completed', value: 'completed' }
];

export default function OrganizerEventsTab({
  organizerId
}: OrganizerEventsTabProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const params: Omit<OrganizerPublicEventsParams, 'page' | 'limit'> =
    statusFilter !== 'all' ? { status: statusFilter } : {};

  const { events, pagination, isLoading, page, setPage, onStatusChange } =
    useOrganizerEvents(organizerId, params);

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    onStatusChange();
  };

  return (
    <div className="space-y-5">
      {/* Status filter tabs */}
      <div className="flex gap-1 bg-muted/60 rounded-xl p-1 w-fit">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === tab.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading grid */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-16/10 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && events.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description={
            statusFilter === 'all'
              ? 'This organizer has no events yet.'
              : `No ${statusFilter === 'published' ? 'upcoming' : 'completed'} events.`
          }
        />
      )}

      {/* Event grid */}
      {!isLoading && events.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pt-2">
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
        </>
      )}
    </div>
  );
}
