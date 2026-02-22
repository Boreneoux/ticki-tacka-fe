import { Link } from 'react-router-dom';
import {
  CalendarDays,
  CreditCard,
  BarChart3,
  PlusCircle,
  ArrowRight,
  Users
} from 'lucide-react';

import useAuthStore from '@/stores/useAuthStore';
import useAggregateStatistics from '@/features/dashboard/hooks/useAggregateStatistics';
import StatsSummaryCards from '@/pages/dashboard/statistics/components/StatsSummaryCards';
import Skeleton from '@/components/ui/Skeleton';

type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

const quickActions: QuickAction[] = [
  {
    label: 'Create Event',
    description: 'Start a new event from scratch',
    href: '/dashboard/events/create',
    icon: <PlusCircle className="size-5" />,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    label: 'My Events',
    description: 'Manage, publish or edit your events',
    href: '/dashboard/events',
    icon: <CalendarDays className="size-5" />,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary'
  },
  {
    label: 'Transactions',
    description: 'Review and confirm incoming payments',
    href: '/dashboard/transactions',
    icon: <CreditCard className="size-5" />,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent'
  },
  {
    label: 'Statistics',
    description: 'Track revenue, tickets and attendees',
    href: '/dashboard/statistics',
    icon: <BarChart3 className="size-5" />,
    iconBg: 'bg-[#f59e0b]/10',
    iconColor: 'text-[#f59e0b]'
  }
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardOverviewPage() {
  const { fullName } = useAuthStore();
  const { data, isLoading } = useAggregateStatistics();

  const firstName = fullName.split(' ')[0] || 'Organizer';

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your events today.
        </p>
      </div>

      {/* Summary stats */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Users className="size-4 text-primary" />
            All-time Performance
          </h2>
          <Link
            to="/dashboard/statistics"
            className="text-sm text-primary hover:underline flex items-center gap-1">
            Full statistics <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : data ? (
          <StatsSummaryCards summary={data.summary} />
        ) : null}
      </section>

      {/* Quick actions */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <Link
              key={action.href}
              to={action.href}
              className="group relative overflow-hidden rounded-xl border border-white/30 bg-white/70 backdrop-blur-sm shadow-lg p-5 flex items-center gap-4 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 bg-primary blur-2xl pointer-events-none" />

              <div className={`shrink-0 p-3 rounded-xl ${action.iconBg}`}>
                <span className={action.iconColor}>{action.icon}</span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground text-sm">
                  {action.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {action.description}
                </p>
              </div>

              <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
