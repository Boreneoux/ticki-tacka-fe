import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Receipt, Hash } from 'lucide-react';

import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useConfirmDialog } from '@/components/ui/useConfirmDialog';

import useOrganizerTransactionDetail from '@/features/transactions/hooks/useOrganizerTransactionDetail';
import TransactionDetailInfo from './components/TransactionDetailInfo';
import TransactionItemsTable from './components/TransactionItemsTable';
import PaymentProofViewer from './components/PaymentProofViewer';
import TransactionStatusBadge from './components/TransactionStatusBadge';

export default function DashboardTransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { transaction, isLoading, isActing, accept, reject } =
    useOrganizerTransactionDetail(id);

  const { confirm, dialog } = useConfirmDialog();

  const handleAccept = () => {
    confirm({
      title: 'Accept Transaction',
      description:
        'Are you sure you want to accept this payment? The transaction will be marked as done and a confirmation email will be sent to the customer.',
      variant: 'info',
      onConfirm: () => void accept()
    });
  };

  const handleReject = () => {
    confirm({
      title: 'Reject Transaction',
      description:
        'Are you sure you want to reject this payment? The transaction will be rolled back — tickets, points, coupons, and vouchers will be restored. A rejection email will be sent to the customer.',
      variant: 'destructive',
      onConfirm: () => void reject()
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <Receipt className="h-14 w-14 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">
          Transaction not found
        </h2>
        <p className="text-muted-foreground">
          This transaction may not exist or you don't have access to it.
        </p>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate('/dashboard/transactions')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Button>
      </div>
    );
  }

  const canAct = transaction.paymentStatus === 'waiting_for_admin_confirmation';

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() => navigate('/dashboard/transactions')}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary shrink-0" />
                <span className="font-mono truncate">
                  {transaction.invoiceNumber}
                </span>
              </h1>
              <TransactionStatusBadge status={transaction.paymentStatus} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Created{' '}
              {new Date(transaction.createdAt).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Accept / Reject actions */}
        {canAct && (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isActing}
              onClick={handleReject}>
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button
              className="flex-1 sm:flex-none gap-2 bg-green-600 hover:bg-green-700 text-white"
              disabled={isActing}
              onClick={handleAccept}>
              <CheckCircle className="h-4 w-4" />
              Accept
            </Button>
          </div>
        )}
      </div>

      {/* Customer + Event info */}
      <TransactionDetailInfo transaction={transaction} />

      {/* Items + pricing */}
      <TransactionItemsTable transaction={transaction} />

      {/* Payment proof */}
      <PaymentProofViewer
        paymentProofUrl={transaction.paymentProofUrl}
        proofUploadedAt={transaction.proofUploadedAt}
        confirmationDeadline={transaction.confirmationDeadline}
        paymentDeadline={transaction.paymentDeadline}
        paymentStatus={transaction.paymentStatus}
      />

      {/* Bottom sticky action bar — mobile */}
      {canAct && (
        <Card className="fixed bottom-0 left-0 right-0 sm:hidden z-40 rounded-none border-x-0 border-b-0 border-t border-border/50 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="py-3 px-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={isActing}
              onClick={handleReject}>
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
              disabled={isActing}
              onClick={handleAccept}>
              <CheckCircle className="h-4 w-4" />
              Accept
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bottom padding for sticky bar on mobile */}
      {canAct && <div className="h-20 sm:hidden" />}

      {dialog}
    </div>
  );
}
