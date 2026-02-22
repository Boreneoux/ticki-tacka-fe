import { useState, useEffect, useCallback } from 'react';

import type { Transaction } from '@/types/models';
import {
    getTransactionByIdApi,
    uploadPaymentProofApi,
    cancelTransactionApi
} from '../api/transactions.api';

type UseTransactionDetailReturn = {
    transaction: Transaction | null;
    isLoading: boolean;
    error: string | null;
    isUploading: boolean;
    isCanceling: boolean;
    uploadProof: (file: File) => Promise<boolean>;
    cancelTransaction: () => Promise<boolean>;
    refetch: () => void;
};

export default function useTransactionDetail(id: string | undefined): UseTransactionDetailReturn {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) {
            setIsLoading(false);
            setError('Transaction not found');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getTransactionByIdApi(id);
            setTransaction(data);
        } catch {
            setError('Failed to load transaction details');
            setTransaction(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const uploadProof = useCallback(async (file: File): Promise<boolean> => {
        if (!id) return false;

        setIsUploading(true);
        try {
            const updated = await uploadPaymentProofApi(id, file);
            setTransaction(updated);
            return true;
        } catch {
            return false;
        } finally {
            setIsUploading(false);
        }
    }, [id]);

    const cancelTx = useCallback(async (): Promise<boolean> => {
        if (!id) return false;

        setIsCanceling(true);
        try {
            const updated = await cancelTransactionApi(id);
            setTransaction(updated);
            return true;
        } catch {
            return false;
        } finally {
            setIsCanceling(false);
        }
    }, [id]);

    return {
        transaction,
        isLoading,
        error,
        isUploading,
        isCanceling,
        uploadProof,
        cancelTransaction: cancelTx,
        refetch: fetchData
    };
}
