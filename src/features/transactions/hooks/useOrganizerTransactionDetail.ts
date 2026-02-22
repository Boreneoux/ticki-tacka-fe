import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import type { OrganizerTransactionDetailResponseData } from '../types';
import {
  getOrganizerTransactionByIdApi,
  acceptTransactionApi,
  rejectTransactionApi
} from '../api/transactions.api';

type UseOrganizerTransactionDetailReturn = {
  transaction: OrganizerTransactionDetailResponseData | null;
  isLoading: boolean;
  isActing: boolean;
  accept: () => Promise<boolean>;
  reject: () => Promise<boolean>;
  refetch: () => void;
};

export default function useOrganizerTransactionDetail(
  id: string | undefined
): UseOrganizerTransactionDetailReturn {
  const [transaction, setTransaction] =
    useState<OrganizerTransactionDetailResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await getOrganizerTransactionByIdApi(id);
      setTransaction(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to load transaction'
        );
      } else {
        toast.error('An unexpected error occurred');
      }
      setTransaction(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const accept = useCallback(async (): Promise<boolean> => {
    if (!id) return false;

    setIsActing(true);
    try {
      await acceptTransactionApi(id);
      toast.success('Transaction accepted successfully');
      await fetchData();
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to accept transaction'
        );
      } else {
        toast.error('An unexpected error occurred');
      }
      return false;
    } finally {
      setIsActing(false);
    }
  }, [id, fetchData]);

  const reject = useCallback(async (): Promise<boolean> => {
    if (!id) return false;

    setIsActing(true);
    try {
      await rejectTransactionApi(id);
      toast.success('Transaction rejected');
      await fetchData();
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to reject transaction'
        );
      } else {
        toast.error('An unexpected error occurred');
      }
      return false;
    } finally {
      setIsActing(false);
    }
  }, [id, fetchData]);

  return {
    transaction,
    isLoading,
    isActing,
    accept,
    reject,
    refetch: fetchData
  };
}
