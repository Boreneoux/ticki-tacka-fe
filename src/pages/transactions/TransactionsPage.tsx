import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Calendar,
  MapPin,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Hourglass
} from 'lucide-react';

import useTransactions from '@/features/transactions/hooks/useTransactions';
import {
  formatDateShort,
  statusConfigMap,
  getTransactionImage
} from '@/features/transactions/helpers';
import { formatCurrency } from '@/utils/format';
import type { TransactionStatus } from '@/types/enums';
import type { Transaction } from '@/types/models';

import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

const STATUS_TABS: { value: TransactionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'waiting_for_payment', label: 'Pending' },
  { value: 'waiting_for_admin_confirmation', label: 'Confirming' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'expired', label: 'Expired' }
];

const statusIcons: Record<TransactionStatus, React.ReactNode> = {
  waiting_for_payment: <Clock className="h-3 w-3" />,
  waiting_for_admin_confirmation: <Hourglass className="h-3 w-3" />,
  done: <CheckCircle2 className="h-3 w-3" />,
  canceled: <XCircle className="h-3 w-3" />,
  expired: <AlertCircle className="h-3 w-3" />,
  rejected: <XCircle className="h-3 w-3" />
};

export default function TransactionsPage() {
  const navigate = useNavigate();
  const {
    transactions,
    pagination,
    isLoading,
    error,
    selectedStatus,
    setSelectedStatus,
    setPage
  } = useTransactions();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all your ticket purchases
            </p>
          </div>

          <Tabs
            value={selectedStatus}
            onValueChange={val =>
              setSelectedStatus(val as TransactionStatus | 'all')
            }>
            <TabsList className="w-full flex mb-8 overflow-x-auto">
              {STATUS_TABS.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 text-xs sm:text-sm whitespace-nowrap">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <Skeleton className="w-40 h-28 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-40 mt-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && !isLoading && (
            <EmptyState
              icon="alert"
              title="Something went wrong"
              description={error}
              variant="card"
            />
          )}

          {!isLoading && !error && transactions.length === 0 && (
            <EmptyState
              icon={Receipt}
              title="No Transactions Found"
              description={
                selectedStatus === 'all'
                  ? "You haven't made any purchases yet. Browse events and get your tickets!"
                  : `No transactions with "${STATUS_TABS.find(t => t.value === selectedStatus)?.label ?? selectedStatus}" status.`
              }
              action={{
                label: 'Browse Events',
                onClick: () => navigate('/events')
              }}
              variant="card"
            />
          )}

          {!isLoading && !error && transactions.length > 0 && (
            <div className="space-y-4">
              {transactions.map((txn, index) => (
                <TransactionCard key={txn.id} transaction={txn} index={index} />
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page <= 1}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TransactionCard({
  transaction: txn,
  index
}: {
  transaction: Transaction;
  index: number;
}) {
  const navigate = useNavigate();
  const config = statusConfigMap[txn.paymentStatus];
  const Icon = statusIcons[txn.paymentStatus];
  const totalTickets =
    txn.transactionItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <Card
      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => navigate(`/transactions/${txn.id}`)}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="shrink-0">
            <img
              src={getTransactionImage(txn)}
              alt={txn.event?.name ?? 'Event'}
              className="w-full lg:w-40 h-32 object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">
                  {txn.event?.name ?? 'Unknown Event'}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Receipt className="h-4 w-4 mr-1" />
                  {txn.invoiceNumber}
                </p>
              </div>
              <Badge variant={config?.variant ?? 'default'}>
                <span className="flex items-center gap-1">
                  {Icon}
                  {config?.label ?? txn.paymentStatus}
                </span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">
                  {txn.event?.eventDate
                    ? formatDateShort(txn.event.eventDate)
                    : '—'}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">{txn.event?.venueName ?? '—'}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Ticket className="h-4 w-4 mr-2 shrink-0" />
                <span>
                  {totalTickets} ticket{totalTickets > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {txn.transactionItems && txn.transactionItems.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {txn.transactionItems.map((item, idx) => (
                  <span key={item.id}>
                    {item.ticketType?.name ?? 'Ticket'} ×{item.quantity}
                    {idx < txn.transactionItems!.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Total Payment</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(txn.totalAmount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Ordered on</p>
                <p className="text-sm font-medium">
                  {formatDateShort(txn.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
