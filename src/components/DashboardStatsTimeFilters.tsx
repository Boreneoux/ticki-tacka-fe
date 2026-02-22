import type { StatsFilterBy } from '@/features/dashboard/types';

type Props = {
  filterBy: StatsFilterBy;
  year: number;
  month: number;
  onFilterByChange: (value: StatsFilterBy) => void;
  onYearChange: (value: number) => void;
  onMonthChange: (value: number) => void;
};

const FILTER_OPTIONS: { label: string; value: StatsFilterBy }[] = [
  { label: 'By Year', value: 'year' },
  { label: 'By Month', value: 'month' },
  { label: 'By Day', value: 'day' }
];

const MONTHS = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 }
];

function buildYearOptions(currentYear: number): number[] {
  const years: number[] = [];
  for (let y = currentYear; y >= currentYear - 5; y--) {
    years.push(y);
  }
  return years;
}

export default function DashboardStatsTimeFilters({
  filterBy,
  year,
  month,
  onFilterByChange,
  onYearChange,
  onMonthChange
}: Props) {
  const yearOptions = buildYearOptions(new Date().getFullYear());

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* filterBy toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden bg-muted/50">
        {FILTER_OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => onFilterByChange(option.value)}
            className={[
              'px-3 py-1.5 text-sm font-medium transition-colors',
              filterBy === option.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            ].join(' ')}>
            {option.label}
          </button>
        ))}
      </div>

      {/* Year selector */}
      <select
        value={year}
        onChange={e => onYearChange(Number(e.target.value))}
        className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
        {yearOptions.map(y => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Month selector — only for 'day' filterBy */}
      {filterBy === 'day' && (
        <select
          value={month}
          onChange={e => onMonthChange(Number(e.target.value))}
          className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
          {MONTHS.map(m => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
