import { useState } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';
import { BarChart2, LineChart as LineChartIcon } from 'lucide-react';
import type { ChartDataPoint } from '@/features/dashboard/types';

type Props = {
  data: ChartDataPoint[];
};

type ChartMode = 'line' | 'bar';

const CHART_COLORS = {
  revenue: '#05668d',
  ticketsSold: '#00a8e8',
  transactions: '#028090'
};

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

function formatTooltipValue(
  value: number | undefined,
  name: string | undefined
): [string, string] {
  const label = name ?? '';
  if (value === undefined) return ['—', label];
  if (label === 'Revenue') {
    return [
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value),
      label
    ];
  }
  return [value.toLocaleString('id-ID'), label];
}

export default function DashboardStatsChart({ data }: Props) {
  const [chartMode, setChartMode] = useState<ChartMode>('bar');

  const chartData = data.map(d => ({
    label: d.label,
    Revenue: d.revenue,
    'Tickets Sold': d.ticketsSold,
    Transactions: d.transactions
  }));

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 10, left: 0, bottom: 5 }
  };

  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis
        dataKey="label"
        tick={{ fontSize: 12, fill: '#64748b' }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tickFormatter={formatYAxis}
        tick={{ fontSize: 12, fill: '#64748b' }}
        axisLine={false}
        tickLine={false}
        width={50}
      />
      <Tooltip
        formatter={formatTooltipValue}
        contentStyle={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '13px'
        }}
      />
      <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
    </>
  );

  return (
    <div className="rounded-xl border border-white/30 bg-white/70 backdrop-blur-sm shadow-lg p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-semibold text-foreground">Performance Over Time</h3>

        {/* Chart mode toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden bg-muted/50">
          <button
            type="button"
            onClick={() => setChartMode('bar')}
            title="Bar chart"
            className={[
              'p-1.5 transition-colors',
              chartMode === 'bar'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            ].join(' ')}>
            <BarChart2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setChartMode('line')}
            title="Line chart"
            className={[
              'p-1.5 transition-colors',
              chartMode === 'line'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            ].join(' ')}>
            <LineChartIcon className="size-4" />
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          No data available for the selected period.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartMode === 'bar' ? (
            <BarChart {...commonProps}>
              {axes}
              <Bar
                dataKey="Revenue"
                fill={CHART_COLORS.revenue}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Tickets Sold"
                fill={CHART_COLORS.ticketsSold}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Transactions"
                fill={CHART_COLORS.transactions}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart {...commonProps}>
              {axes}
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke={CHART_COLORS.revenue}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Tickets Sold"
                stroke={CHART_COLORS.ticketsSold}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Transactions"
                stroke={CHART_COLORS.transactions}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
