import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Category } from '@/types/models';
import type { EventListParams, EventListResponseData } from '../types';

export async function getEventsApi(params: EventListParams = {}) {
    const response = await api.get<ApiResponse<EventListResponseData>>(
        '/events',
        { params }
    );

    return response.data.data;
}

export async function getCategoriesApi() {
    const response = await api.get<ApiResponse<Category[]>>('/categories');

    return response.data.data;
}
