import { TrendingUp, Ticket, Users } from 'lucide-react';
import type { EventSummary } from '@/features/dashboard/types';

type Props = {
  summary: EventSummary;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
};

function StatCard({ icon, label, value, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/30 bg-white/70 backdrop-blur-sm shadow-lg p-5 flex items-center gap-4">
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 bg-primary blur-2xl pointer-events-none" />
      <div className={`shrink-0 p-3 rounded-xl ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground font-medium truncate">
          {label}
        </p>
        <p className="text-xl font-bold text-foreground mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function EventStatsSummaryCards({ summary }: Props) {
  const cards: StatCardProps[] = [
    {
      icon: <TrendingUp className="size-5" />,
      label: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      icon: <Ticket className="size-5" />,
      label: 'Tickets Sold',
      value: summary.totalTicketsSold.toLocaleString('id-ID'),
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary'
    },
    {
      icon: <Users className="size-5" />,
      label: 'Total Attendees',
      value: summary.totalAttendees.toLocaleString('id-ID'),
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(card => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
