import { useParams, Link } from 'react-router-dom';
import { BarChart3, ArrowLeft, CalendarDays } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

import useEventStatistics from '@/features/dashboard/hooks/useEventStatistics';
import EventStatsSummaryCards from './components/EventStatsSummaryCards';
import TicketBreakdownTable from './components/TicketBreakdownTable';
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
        </>
      ) : (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Event not found or statistics unavailable.
        </div>
      )}
    </div>
  );
}
