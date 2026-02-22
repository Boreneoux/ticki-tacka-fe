import type { Transaction } from '@/types/models';
import type { TransactionStatus } from '@/types/enums';

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
