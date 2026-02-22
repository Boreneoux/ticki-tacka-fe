import { useParams, Link } from 'react-router-dom';
import { BarChart3, ArrowLeft, CalendarDays, Users } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/Pagination';

import useEventStatistics from '@/features/dashboard/hooks/useEventStatistics';
import useEventAttendees from '@/features/dashboard/hooks/useEventAttendees';
import EventStatsSummaryCards from './components/EventStatsSummaryCards';
import TicketBreakdownTable from './components/TicketBreakdownTable';
import AttendeeTable from './components/AttendeeTable';
import AttendeeCard from './components/AttendeeCard';
import DashboardStatsTimeFilters from '@/components/DashboardStatsTimeFilters';
import DashboardStatsChart from '@/components/DashboardStatsChart';

const STATUS_VARIANT: Record<
  string,
  'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline'
> = {
  draft: 'outline',
  published: 'success',
  completed: 'secondary',
  canceled: 'destructive'
};

function EventStatisticsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-95 rounded-xl" />
    </div>
  );
}

export default function EventStatisticsPage() {
  const { id: eventId = '' } = useParams<{ id: string }>();

  const {
    data,
    isLoading,
    filterBy,
    year,
    month,
    setFilterBy,
    setYear,
    setMonth
  } = useEventStatistics(eventId);

  const {
    attendees,
    pagination: attendeePagination,
    isLoading: isLoadingAttendees,
    page: attendeePage,
    setPage: setAttendeePage
  } = useEventAttendees(eventId);

  const handleAttendeePageChange = (newPage: number) => {
    setAttendeePage(newPage);
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

      {isLoading ? (
        <EventStatisticsSkeleton />
      ) : data ? (
        <>
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                  {data.event.name}
                </h1>
                <Badge variant={STATUS_VARIANT[data.event.status] ?? 'outline'}>
                  {data.event.status.charAt(0).toUpperCase() +
                    data.event.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {new Date(data.event.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Summary cards */}
          <EventStatsSummaryCards summary={data.summary} />

          {/* Ticket breakdown */}
          <TicketBreakdownTable breakdown={data.ticketBreakdown} />

          {/* Chart section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">
                  {filterBy === 'year'
                    ? 'yearly'
                    : filterBy === 'month'
                      ? `monthly data for ${year}`
                      : `daily data — ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`}
                </span>{' '}
                breakdown
              </p>
              <DashboardStatsTimeFilters
                filterBy={filterBy}
                year={year}
                month={month}
                onFilterByChange={setFilterBy}
                onYearChange={setYear}
                onMonthChange={setMonth}
              />
            </div>

            <DashboardStatsChart data={data.chartData} />
          </div>

          {/* Attendees section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Attendees
                </h2>
                {attendeePagination && (
                  <span className="text-sm text-muted-foreground">
                    ({attendeePagination.totalCount} total)
                  </span>
                )}
              </div>
              <Link
                to={`/dashboard/events/${eventId}/attendees`}
                className="text-sm text-primary hover:underline transition-colors shrink-0">
                View full page →
              </Link>
            </div>

            {isLoadingAttendees ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : attendees.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border border-dashed rounded-xl">
                No confirmed attendees yet.
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <AttendeeTable attendees={attendees} />
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {attendees.map(attendee => (
                    <AttendeeCard
                      key={attendee.transactionId}
                      attendee={attendee}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {attendeePagination && attendeePagination.totalPages > 1 && (
                  <div className="flex justify-center mt-2 cursor-pointer">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handleAttendeePageChange(
                                Math.max(1, attendeePage - 1)
                              )
                            }
                            className={
                              attendeePage === 1
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: attendeePagination.totalPages },
                          (_, i) => i + 1
                        ).map(p => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              isActive={p === attendeePage}
                              onClick={() => handleAttendeePageChange(p)}>
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handleAttendeePageChange(
                                Math.min(
                                  attendeePagination.totalPages,
                                  attendeePage + 1
                                )
                              )
                            }
                            className={
                              attendeePage === attendeePagination.totalPages
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
        </>
      ) : (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Event not found or statistics unavailable.
        </div>
      )}
    </div>
  );
}
