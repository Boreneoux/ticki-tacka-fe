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

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-muted rounded w-3/4" />
      </td>
    ))}
  </tr>
);

type OrganizerTransactionTableProps = {
  transactions: Transaction[];
  isLoading: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};

export default function OrganizerTransactionTable({
  transactions,
  isLoading,
  onAccept,
  onReject
}: OrganizerTransactionTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Customer
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Event
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Invoice
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : transactions.map(tx => (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/30 transition-colors group">
                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage
                            src={tx.user?.profilePictureUrl ?? undefined}
                            alt={tx.user?.fullName}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {tx.user?.fullName?.charAt(0).toUpperCase() ?? '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-35">
                            {tx.user?.fullName ?? '—'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-35">
                            {tx.user?.email ?? '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Event */}
                    <td className="px-4 py-3">
                      <p className="font-medium truncate max-w-40">
                        {tx.event?.name ?? '—'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {tx.event?.eventDate
                          ? formatDate(tx.event.eventDate)
                          : '—'}
                      </p>
                    </td>

                    {/* Invoice */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        {tx.invoiceNumber}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(tx.totalAmount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <TransactionStatusBadge status={tx.paymentStatus} />
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          title="View Detail"
                          onClick={() =>
                            navigate(`/dashboard/transactions/${tx.id}`)
                          }>
                          <Eye className="h-4 w-4" />
                        </Button>

                        {tx.paymentStatus ===
                          'waiting_for_admin_confirmation' && (
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
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!isLoading && transactions.length === 0 && (
          <div className="py-16 text-center">
            <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No transactions found
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
