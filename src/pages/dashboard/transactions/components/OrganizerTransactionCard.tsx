import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, Calendar, Receipt } from 'lucide-react';

import type { Transaction } from '@/types/models';
import Button from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import TransactionStatusBadge from './TransactionStatusBadge';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

const SkeletonCard = () => (
  <div className="rounded-xl border border-border/50 bg-white/80 p-4 animate-pulse space-y-3">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-muted rounded w-2/5" />
        <div className="h-3 bg-muted rounded w-3/5" />
      </div>
    </div>
    <div className="h-3 bg-muted rounded w-1/2" />
    <div className="h-3 bg-muted rounded w-1/3" />
  </div>
);

type OrganizerTransactionCardProps = {
  transactions: Transaction[];
  isLoading: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};

export default function OrganizerTransactionCard({
  transactions,
  isLoading,
  onAccept,
  onReject
}: OrganizerTransactionCardProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-16 text-center rounded-xl border border-border/50 bg-white/80 backdrop-blur-sm">
        <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">
          No transactions found
        </p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map(tx => (
        <div
          key={tx.id}
          className="rounded-xl border border-border/50 bg-white/80 backdrop-blur-sm shadow-sm p-4 space-y-3">
          {/* Header: customer + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={tx.user?.profilePictureUrl ?? undefined}
                  alt={tx.user?.fullName}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {tx.user?.fullName?.charAt(0).toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {tx.user?.fullName ?? '—'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {tx.user?.email ?? '—'}
                </p>
              </div>
            </div>
            <TransactionStatusBadge
              status={tx.paymentStatus}
              className="shrink-0"
            />
          </div>

          {/* Event + date */}
          <div className="border-t border-border/40 pt-3 space-y-1">
            <p className="text-sm font-medium truncate">
              {tx.event?.name ?? '—'}
            </p>
            {tx.event?.eventDate && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(tx.event.eventDate)}
              </p>
            )}
          </div>

          {/* Invoice + amount */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              {tx.invoiceNumber}
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(tx.totalAmount)}
            </span>
          </div>

          {/* Footer: date + actions */}
          <div className="flex items-center justify-between border-t border-border/40 pt-3">
            <span className="text-xs text-muted-foreground">
              {formatDate(tx.createdAt)}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs"
                onClick={() => navigate(`/dashboard/transactions/${tx.id}`)}>
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>

              {tx.paymentStatus === 'waiting_for_admin_confirmation' && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Accept"
                    onClick={() => onAccept(tx.id)}>
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    title="Reject"
                    onClick={() => onReject(tx.id)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
