import { useState } from 'react';
import {
  Coins,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Clock,
  Receipt,
  Sparkles
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import usePoints from '@/features/profile/hooks/usePoints';
import type { PointEntry } from '@/features/profile/types';

function getStatusBadge(status: PointEntry['status']) {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'used':
      return <Badge variant="warning">Used</Badge>;
    case 'expired':
      return <Badge variant="destructive">Expired</Badge>;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function PointsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

type PointCardProps = {
  point: PointEntry;
};

function PointCard({ point }: PointCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasUsageHistory = point.usageHistory.length > 0;

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground">
                {point.amount.toLocaleString()} pts
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                Source: {point.source}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {getStatusBadge(point.status)}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Expires {formatDate(point.expiredAt)}
                </span>
              </div>
            </div>
          </div>

          {hasUsageHistory && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer shrink-0"
              title="View usage history">
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Usage History */}
        {expanded && hasUsageHistory && (
          <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Usage History
            </p>
            {point.usageHistory.map((usage, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                <Receipt className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium">
                    {usage.amountUsed.toLocaleString()} pts
                  </span>
                  <span className="text-muted-foreground"> — </span>
                  <span className="text-muted-foreground text-xs truncate">
                    {usage.invoiceNumber}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDate(usage.usedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PointsTab() {
  const { points, balance, isLoading } = usePoints();

  if (isLoading) return <PointsSkeleton />;

  return (
    <div className="space-y-5">
      {/* Balance Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-accent to-secondary shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/20" />
          <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/20" />
        </div>
        <div className="relative px-6 py-6 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium">
              Available Points
            </p>
            <p className="text-3xl md:text-4xl font-bold text-white">
              {balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Points List */}
      {points.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No points yet"
          description="You'll earn points when someone uses your referral code to register."
          variant="card"
        />
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Point History ({points.length})
          </h3>
          {points.map(point => (
            <PointCard key={point.id} point={point} />
          ))}
        </div>
      )}
    </div>
  );
}
