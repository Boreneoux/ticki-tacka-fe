import type { Transaction } from '@/types/models';
import type { TransactionStatus, DiscountType } from '@/types/enums';

export type TransactionListResponseData = {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export type TransactionDetailResponseData = Transaction;

export type TransactionListParams = {
  status?: TransactionStatus | 'all';
  page?: number;
  limit?: number;
};

export type CreateTransactionPayload = {
  eventId: string;
  items: { ticketTypeId: string; quantity: number }[];
  usePoints?: boolean;
  userCouponId?: string;
  eventVoucherId?: string;
};

// ─── Organizer types ──────────────────────────────────────────────────────────

export type OrganizerTransactionListParams = {
  status?: TransactionStatus | 'all';
  eventId?: string;
  page?: number;
  limit?: number;
};

export type OrganizerTransactionListResponseData = {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export type OrganizerTransactionDetailResponseData = Transaction & {
  userCoupon: {
    couponCode: string;
    discountType: DiscountType;
    discountValue: number;
  } | null;
  eventVoucher: {
    voucherCode: string;
    voucherName: string;
    discountType: DiscountType;
    discountValue: number;
  } | null;
};
