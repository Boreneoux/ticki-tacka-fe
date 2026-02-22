import { useParams, Link } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';

import useEventAttendees from '@/features/dashboard/hooks/useEventAttendees';
import AttendeeTable from './components/AttendeeTable';
import AttendeeCard from './components/AttendeeCard';

function AttendeesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}

export default function EventAttendeesPage() {
  const { id: eventId = '' } = useParams<{ id: string }>();

  const { eventName, attendees, pagination, isLoading, page, setPage } =
    useEventAttendees(eventId);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/dashboard/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" />
        Back to My Events
      </Link>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Attendees
          </h1>
          {eventName && (
            <p className="text-muted-foreground mt-1 text-sm">{eventName}</p>
          )}
        </div>

        {pagination && (
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {pagination.totalCount}
            </span>{' '}
            confirmed attendee{pagination.totalCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <AttendeesSkeleton />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <AttendeeTable attendees={attendees} />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {attendees.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No attendees yet.
              </div>
            ) : (
              attendees.map(attendee => (
                <AttendeeCard
                  key={attendee.transactionId}
                  attendee={attendee}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6 cursor-pointer">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                        onClick={() => handlePageChange(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(pagination.totalPages, page + 1)
                        )
                      }
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
