import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Receipt,
  Calendar,
  MapPin,
  Clock,
  Upload,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

import useTransactionDetail from '@/features/transactions/hooks/useTransactionDetail';
import {
  formatDateTimeLong,
  formatDateTime,
  formatDateShort,
  statusConfigMap
} from '@/features/transactions/helpers';
import { formatCurrency } from '@/utils/format';
import type { TransactionStatus } from '@/types/enums';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import CountdownTimer from '@/components/ui/CountdownTimer';
import FileUpload from '@/components/ui/FileUpload';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

type TimelineStep = {
  label: string;
  date: string | null;
  status: 'done' | 'pending';
  icon: React.ReactNode;
};

function getTimelineSteps(txn: {
  paymentStatus: TransactionStatus;
  createdAt: string;
  proofUploadedAt: string | null;
  confirmedAt: string | null;
}): TimelineStep[] {
  const steps: TimelineStep[] = [
    {
      label: 'Order Created',
      date: txn.createdAt,
      status: 'done',
      icon: <Receipt className="h-4 w-4" />
    }
  ];

  if (txn.paymentStatus === 'canceled') {
    steps.push({
      label: 'Order Canceled',
      date: null,
      status: 'done',
      icon: <XCircle className="h-4 w-4" />
    });
    return steps;
  }

  if (txn.paymentStatus === 'expired') {
    steps.push({
      label: 'Payment Expired',
      date: null,
      status: 'done',
      icon: <AlertCircle className="h-4 w-4" />
    });
    return steps;
  }

  steps.push({
    label: 'Payment Proof Uploaded',
    date: txn.proofUploadedAt,
    status: txn.proofUploadedAt ? 'done' : 'pending',
    icon: <Upload className="h-4 w-4" />
  });

  if (txn.paymentStatus === 'rejected') {
    steps.push({
      label: 'Payment Rejected',
      date: null,
      status: 'done',
      icon: <XCircle className="h-4 w-4" />
    });
  } else {
    steps.push({
      label: 'Payment Confirmed',
      date: txn.confirmedAt,
      status: txn.confirmedAt ? 'done' : 'pending',
      icon: <CheckCircle2 className="h-4 w-4" />
    });
  }

  return steps;
}

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    transaction: txn,
    isLoading,
    error,
    isUploading,
    isCanceling,
    uploadProof,
    cancelTransaction,
    refetch
  } = useTransactionDetail(id);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-48 rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-80 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !txn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          icon="alert"
          title="Transaction Not Found"
          description="The transaction you're looking for doesn't exist or you don't have access."
          action={{
            label: 'My Transactions',
            onClick: () => navigate('/transactions')
          }}
          variant="card"
        />
      </div>
    );
  }

  const config = statusConfigMap[txn.paymentStatus];
  const canUpload = txn.paymentStatus === 'waiting_for_payment';
  const canCancel = txn.paymentStatus === 'waiting_for_payment';
  const totalTickets =
    txn.transactionItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const eventImage =
    txn.event?.eventImages?.[0]?.imageUrl || '/placeholder-event.jpg';
  const timelineSteps = getTimelineSteps(txn);

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    const file = uploadedFiles[0];
    const success = await uploadProof(file);
    if (success) {
      toast.success('Payment proof uploaded successfully!');
      setUploadedFiles([]);
    } else {
      toast.error('Failed to upload payment proof');
    }
  };

  const handleCancel = async () => {
    const success = await cancelTransaction();
    if (success) {
      toast.success('Transaction canceled successfully');
      setShowCancelDialog(false);
    } else {
      toast.error('Failed to cancel transaction');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/transactions')}
            className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            My Transactions
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Transaction Detail</h1>
              <p className="text-muted-foreground flex items-center">
                <Receipt className="h-4 w-4 mr-2" />
                {txn.invoiceNumber}
              </p>
            </div>
            <Badge
              variant={config?.variant ?? 'default'}
              className="text-sm px-4 py-1.5">
              {config?.label ?? txn.paymentStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {txn.paymentStatus === 'waiting_for_payment' &&
                txn.paymentDeadline && (
                  <Card className="border-0 shadow-lg border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <p className="font-semibold text-orange-700 dark:text-orange-400">
                          Payment Deadline
                        </p>
                      </div>
                      <CountdownTimer
                        deadline={txn.paymentDeadline}
                        variant="compact"
                        onExpire={() => {
                          toast.error(
                            'Payment deadline has passed. Transaction expired.'
                          );
                          refetch();
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img
                      src={eventImage}
                      alt={txn.event?.name ?? 'Event'}
                      className="w-28 h-28 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-lg">
                        <Link
                          to={
                            txn.event?.slug ? `/events/${txn.event.slug}` : '#'
                          }
                          className="hover:text-primary transition-colors">
                          {txn.event?.name ?? 'Unknown Event'}
                          <ExternalLink className="h-3 w-3 inline-block ml-1" />
                        </Link>
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {txn.event?.eventDate
                          ? formatDateTimeLong(txn.event.eventDate)
                          : '—'}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {txn.event?.venueName ?? '—'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Ticket Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {txn.transactionItems?.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-semibold">
                            {item.ticketType?.name ?? 'Ticket'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.unitPrice)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {canUpload && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Payment Proof
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileUpload
                      accept="image/jpeg,image/png,image/webp"
                      maxSize={5 * 1024 * 1024}
                      maxFiles={1}
                      value={uploadedFiles}
                      onChange={setUploadedFiles}
                    />
                    <Button
                      onClick={handleUpload}
                      disabled={uploadedFiles.length === 0 || isUploading}
                      className="w-full">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Proof
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {txn.paymentProofUrl && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Payment Proof
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={txn.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block">
                      <img
                        src={txn.paymentProofUrl}
                        alt="Payment proof"
                        className="max-w-sm rounded-lg border hover:opacity-90 transition-opacity"
                      />
                    </a>
                    {txn.proofUploadedAt && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Uploaded on {formatDateTime(txn.proofUploadedAt)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Status Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {timelineSteps.map((step, i) => (
                      <div key={i} className="flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                              step.status === 'done'
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted text-muted-foreground border-muted'
                            }`}>
                            {step.icon}
                          </div>
                          {i < timelineSteps.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-1" />
                          )}
                        </div>

                        <div className="flex-1 pt-1">
                          <p
                            className={`font-medium text-sm ${
                              step.status === 'done'
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }`}>
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDateTime(step.date)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({totalTickets} ticket
                      {totalTickets > 1 ? 's' : ''})
                    </span>
                    <span>{formatCurrency(txn.subtotal)}</span>
                  </div>

                  {txn.pointsUsed > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Points Discount</span>
                      <span>-{formatCurrency(txn.pointsUsed)}</span>
                    </div>
                  )}

                  {txn.couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span>-{formatCurrency(txn.couponDiscount)}</span>
                    </div>
                  )}

                  {txn.voucherDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Voucher Discount</span>
                      <span>-{formatCurrency(txn.voucherDiscount)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-xl text-primary">
                        {formatCurrency(txn.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground pt-2 border-t">
                    <p>Ordered on {formatDateShort(txn.createdAt)}</p>
                    {txn.confirmedAt && (
                      <p>Confirmed on {formatDateShort(txn.confirmedAt)}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {canCancel && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowCancelDialog(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Transaction
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Transaction"
        description="Are you sure you want to cancel this transaction? This action cannot be undone. Any points, coupons, or vouchers used will be refunded."
        variant="destructive"
        confirmText="Cancel Transaction"
        isLoading={isCanceling}
        onConfirm={handleCancel}
      />
    </div>
  );
}
