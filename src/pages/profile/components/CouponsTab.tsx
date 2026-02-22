import { useState } from 'react';
import {
  Tag,
  Percent,
  Clock,
  Receipt,
  Copy,
  Check,
  BadgeDollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import useCoupons from '@/features/profile/hooks/useCoupons';
import type { CouponEntry } from '@/features/profile/types';
import { formatCurrency } from '@/utils/format';

function getStatusBadge(status: CouponEntry['status']) {
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

function formatDiscount(coupon: CouponEntry) {
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}%`;
  }
  return formatCurrency(coupon.discountValue);
}

function CouponsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

type CouponCardProps = {
  coupon: CouponEntry;
};

function CouponCard({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.couponCode);
    setCopied(true);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className={`border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden ${
        coupon.status === 'active' ? 'ring-1 ring-primary/20' : ''
      }`}>
      <CardContent className="p-0">
        <div className="flex">
          {/* Left accent strip */}
          <div
            className={`w-1.5 shrink-0 ${
              coupon.status === 'active'
                ? 'bg-linear-to-b from-primary to-accent'
                : coupon.status === 'used'
                  ? 'bg-yellow-400'
                  : 'bg-gray-300'
            }`}
          />

          <div className="flex-1 p-4">
            {/* Top row: code + copy + badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Tag className="h-4.5 w-4.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-mono font-bold text-sm text-foreground tracking-wider truncate">
                      {coupon.couponCode}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer shrink-0"
                      title="Copy code">
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {getStatusBadge(coupon.status)}
            </div>

            {/* Discount value */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5">
                {coupon.discountType === 'percentage' ? (
                  <Percent className="h-4 w-4 text-primary" />
                ) : (
                  <BadgeDollarSign className="h-4 w-4 text-primary" />
                )}
                <span className="text-lg font-bold text-primary">
                  {formatDiscount(coupon)}
                </span>
                <span className="text-xs text-muted-foreground">discount</span>
              </div>
            </div>

            {/* Bottom: expiry + transaction */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Expires {formatDate(coupon.expiredAt)}
              </span>
              {coupon.usedInTransaction && (
                <span className="flex items-center gap-1">
                  <Receipt className="h-3 w-3" />
                  Used in {coupon.usedInTransaction.invoiceNumber} (
                  {formatDate(coupon.usedInTransaction.transactionDate)})
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CouponsTab() {
  const { coupons, isLoading } = useCoupons();

  if (isLoading) return <CouponsSkeleton />;

  if (coupons.length === 0) {
    return (
      <EmptyState
        icon="inbox"
        title="No coupons yet"
        description="You'll receive a discount coupon when you register with a referral code."
        variant="card"
      />
    );
  }

  const activeCoupons = coupons.filter(c => c.status === 'active');
  const otherCoupons = coupons.filter(c => c.status !== 'active');

  return (
    <div className="space-y-5">
      {/* Active Coupons */}
      {activeCoupons.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Active Coupons ({activeCoupons.length})
          </h3>
          {activeCoupons.map(coupon => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}

      {/* Used / Expired Coupons */}
      {otherCoupons.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Past Coupons ({otherCoupons.length})
          </h3>
          {otherCoupons.map(coupon => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  );
}
