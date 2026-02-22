import type { TransactionStatus } from '@/types/enums';
import Badge from '@/components/ui/Badge';
import { cn } from '@/components/ui/Utils';

const STATUS_LABEL: Record<TransactionStatus, string> = {
  waiting_for_payment: 'Awaiting Payment',
  waiting_for_admin_confirmation: 'Awaiting Confirmation',
  done: 'Done',
  canceled: 'Canceled',
  expired: 'Expired',
  rejected: 'Rejected'
};

const STATUS_CLASS: Record<TransactionStatus, string> = {
  waiting_for_payment: 'bg-amber-100 text-amber-800 border-amber-200',
  waiting_for_admin_confirmation: 'bg-blue-100 text-blue-800 border-blue-200',
  done: 'bg-green-100 text-green-800 border-green-200',
  canceled: 'bg-slate-100 text-slate-600 border-slate-200',
  expired: 'bg-orange-100 text-orange-800 border-orange-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

type TransactionStatusBadgeProps = {
  status: TransactionStatus;
  className?: string;
};

export default function TransactionStatusBadge({
  status,
  className
}: TransactionStatusBadgeProps) {
  return (
    <Badge
      className={cn('border font-medium', STATUS_CLASS[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
