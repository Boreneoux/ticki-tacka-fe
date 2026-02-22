import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Transaction } from '@/types/models';
import type {
    TransactionListResponseData,
    TransactionDetailResponseData,
    TransactionListParams,
    CreateTransactionPayload
} from '../types';

export async function getTransactionsApi(params: TransactionListParams = {}) {
    const queryParams: Record<string, string> = {};

    if (params.status && params.status !== 'all') {
        queryParams.status = params.status;
    }
    if (params.page) queryParams.page = String(params.page);
    if (params.limit) queryParams.limit = String(params.limit);

    const response = await api.get<ApiResponse<TransactionListResponseData>>(
        '/transactions',
        { params: queryParams }
    );

    return response.data.data;
}

export async function getTransactionByIdApi(id: string) {
    const response = await api.get<ApiResponse<TransactionDetailResponseData>>(
        `/transactions/${id}`
    );

    return response.data.data;
}

export async function createTransactionApi(payload: CreateTransactionPayload) {
    const response = await api.post<ApiResponse<Transaction>>(
        '/transactions',
        payload
    );

    return response.data.data;
}

export async function uploadPaymentProofApi(id: string, file: File) {
    const formData = new FormData();
    formData.append('paymentProof', file);

    const response = await api.patch<ApiResponse<Transaction>>(
        `/transactions/${id}/payment-proof`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.data;
}

export async function cancelTransactionApi(id: string) {
    const response = await api.patch<ApiResponse<Transaction>>(
        `/transactions/${id}/cancel`
    );

    return response.data.data;
}
