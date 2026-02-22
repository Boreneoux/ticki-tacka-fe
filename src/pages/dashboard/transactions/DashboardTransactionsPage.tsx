import { CreditCard } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/Pagination';
import { useConfirmDialog } from '@/components/ui/useConfirmDialog';

import useOrganizerTransactions from '@/features/transactions/hooks/useOrganizerTransactions';
import OrganizerTransactionFilters from './components/OrganizerTransactionFilters';
import OrganizerTransactionTable from './components/OrganizerTransactionTable';
import OrganizerTransactionCard from './components/OrganizerTransactionCard';
import {
  acceptTransactionApi,
  rejectTransactionApi
} from '@/features/transactions/api/transactions.api';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DashboardTransactionsPage() {
  const {
    transactions,
    pagination,
    isLoading,
    selectedStatus,
    selectedEventId,
    setSelectedStatus,
    setSelectedEventId,
    setPage,
    page,
    refetch
  } = useOrganizerTransactions();

  const { confirm, dialog } = useConfirmDialog();

  const handleAccept = (id: string) => {
    confirm({
      title: 'Accept Transaction',
      description:
        'Are you sure you want to accept this payment? The transaction will be marked as done and a confirmation email will be sent to the customer.',
      variant: 'info',
      onConfirm: async () => {
        try {
          await acceptTransactionApi(id);
          toast.success('Transaction accepted successfully');
          refetch();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || 'Failed to accept transaction'
            );
          } else {
            toast.error('An unexpected error occurred');
          }
        }
      }
    });
  };

  const handleReject = (id: string) => {
    confirm({
      title: 'Reject Transaction',
      description:
        'Are you sure you want to reject this payment? The transaction will be rolled back — tickets, points, coupons, and vouchers will be restored.',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await rejectTransactionApi(id);
          toast.success('Transaction rejected');
          refetch();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || 'Failed to reject transaction'
            );
          } else {
            toast.error('An unexpected error occurred');
          }
        }
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage customer payments for your events.
          </p>
        </div>

        {pagination && (
          <div className="text-sm text-muted-foreground shrink-0">
            {pagination.totalCount} transaction
            {pagination.totalCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters */}
      <OrganizerTransactionFilters
        selectedStatus={selectedStatus}
        selectedEventId={selectedEventId}
        onStatusChange={setSelectedStatus}
        onEventChange={setSelectedEventId}
      />

      {/* Table — desktop only (md+) */}
      <div className="hidden md:block">
        <OrganizerTransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>

      {/* Cards — mobile only */}
      <div className="md:hidden">
        <OrganizerTransactionCard
          transactions={transactions}
          isLoading={isLoading}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>

      {/* Pagination */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6 cursor-pointer">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map(p => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => handlePageChange(p)}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(pagination.totalPages, page + 1))
                  }
                  className={
                    page === pagination.totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {dialog}
    </div>
  );
}
