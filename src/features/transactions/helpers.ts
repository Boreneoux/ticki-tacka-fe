import type { TransactionStatus } from '@/types/enums';

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

export function formatDateShort(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

export function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatDateTimeLong(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export type StatusConfig = {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
};

export const statusConfigMap: Record<TransactionStatus, StatusConfig> = {
    waiting_for_payment: {
        label: 'Waiting for Payment',
        variant: 'warning'
    },
    waiting_for_admin_confirmation: {
        label: 'Waiting Confirmation',
        variant: 'secondary'
    },
    done: {
        label: 'Completed',
        variant: 'success'
    },
    canceled: {
        label: 'Canceled',
        variant: 'destructive'
    },
    expired: {
        label: 'Expired',
        variant: 'destructive'
    },
    rejected: {
        label: 'Rejected',
        variant: 'destructive'
    }
};

export function getTransactionImage(transaction: {
    event?: { eventImages?: { imageUrl: string }[] };
}): string {
    return transaction.event?.eventImages?.[0]?.imageUrl || '/placeholder-event.jpg';
}
