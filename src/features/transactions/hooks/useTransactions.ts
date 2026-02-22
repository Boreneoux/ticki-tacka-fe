import { useState, useEffect, useCallback } from 'react';

import type { Transaction } from '@/types/models';
import type { TransactionStatus } from '@/types/enums';
import { getTransactionsApi } from '../api/transactions.api';

type UseTransactionsReturn = {
    transactions: Transaction[];
    pagination: { page: number; limit: number; totalCount: number; totalPages: number } | null;
    isLoading: boolean;
    error: string | null;
    selectedStatus: TransactionStatus | 'all';
    setSelectedStatus: (status: TransactionStatus | 'all') => void;
    setPage: (page: number) => void;
    refetch: () => void;
};

export default function useTransactions(): UseTransactionsReturn {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<UseTransactionsReturn['pagination']>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | 'all'>('all');
    const [page, setPage] = useState(1);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getTransactionsApi({
                status: selectedStatus,
                page,
                limit: 10
            });

            setTransactions(result.transactions);
            setPagination(result.pagination);
        } catch {
            setError('Failed to load transactions');
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedStatus, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusChange = useCallback((status: TransactionStatus | 'all') => {
        setSelectedStatus(status);
        setPage(1);
    }, []);

    return {
        transactions,
        pagination,
        isLoading,
        error,
        selectedStatus,
        setSelectedStatus: handleStatusChange,
        setPage,
        refetch: fetchData
    };
}
