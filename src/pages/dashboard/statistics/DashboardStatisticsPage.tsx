import { BarChart3 } from 'lucide-react';

import useAggregateStatistics from '@/features/dashboard/hooks/useAggregateStatistics';
import StatsSummaryCards from './components/StatsSummaryCards';
import DashboardStatsTimeFilters from '@/components/DashboardStatsTimeFilters';
import DashboardStatsChart from '@/components/DashboardStatsChart';
import Skeleton from '@/components/ui/Skeleton';

function StatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-95 rounded-xl" />
    </div>
  );
}

export default function DashboardStatisticsPage() {
  const {
    data,
    isLoading,
    filterBy,
    year,
    month,
    setFilterBy,
    setYear,
    setMonth
  } = useAggregateStatistics();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Statistics Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Aggregate performance across all your events
        </p>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : data ? (
        <>
          {/* Summary cards */}
          <StatsSummaryCards summary={data.summary} />

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
          No statistics data available.
        </div>
      )}
    </div>
  );
}
