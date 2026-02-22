import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import type { Transaction } from '@/types/models';
import type { TransactionStatus } from '@/types/enums';
import type { OrganizerTransactionListParams } from '../types';
import { getOrganizerTransactionsApi } from '../api/transactions.api';

type Pagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
};

type UseOrganizerTransactionsReturn = {
  transactions: Transaction[];
  pagination: Pagination | null;
  isLoading: boolean;
  selectedStatus: TransactionStatus | 'all';
  selectedEventId: string;
  setSelectedStatus: (status: TransactionStatus | 'all') => void;
  setSelectedEventId: (eventId: string) => void;
  setPage: (page: number) => void;
  page: number;
  refetch: () => void;
};

export default function useOrganizerTransactions(): UseOrganizerTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatusState] = useState<
    TransactionStatus | 'all'
  >('all');
  const [selectedEventId, setSelectedEventIdState] = useState<string>('');
  const [page, setPageState] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const params: OrganizerTransactionListParams = {
      page,
      limit: 10
    };

    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (selectedEventId) params.eventId = selectedEventId;

    try {
      const result = await getOrganizerTransactionsApi(params);
      setTransactions(result.transactions);
      setPagination(result.pagination);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to load transactions'
        );
      } else {
        toast.error('An unexpected error occurred');
      }
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, selectedEventId, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setSelectedStatus = useCallback((status: TransactionStatus | 'all') => {
    setSelectedStatusState(status);
    setPageState(1);
  }, []);

  const setSelectedEventId = useCallback((eventId: string) => {
    setSelectedEventIdState(eventId);
    setPageState(1);
  }, []);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  return {
    transactions,
    pagination,
    isLoading,
    selectedStatus,
    selectedEventId,
    setSelectedStatus,
    setSelectedEventId,
    setPage,
    page,
    refetch: fetchData
  };
}
