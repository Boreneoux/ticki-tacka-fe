import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Category, Event } from '@/types/models';
import type {
    EventListParams,
    EventListResponseData,
    EventDetailResponseData,
    TicketTypeListResponseData,
    ReviewListResponseData,
    ReviewListParams,
    CreateReviewPayload
} from '../types';

export async function getEventsApi(params: EventListParams = {}) {
    const response = await api.get<ApiResponse<EventListResponseData>>(
        '/events',
        { params }
    );

    return response.data.data;
}

export async function getEventBySlugApi(slug: string) {
    const response = await api.get<ApiResponse<EventDetailResponseData>>(
        `/events/${slug}`
    );

    return response.data.data;
}

export async function getTicketTypesApi(eventId: string) {
    const response = await api.get<ApiResponse<TicketTypeListResponseData>>(
        `/events/${eventId}/ticket-types`
    );

    return response.data.data;
}

export async function getEventReviewsApi(
    eventId: string,
    params: ReviewListParams = {}
) {
    const response = await api.get<ApiResponse<ReviewListResponseData>>(
        `/events/${eventId}/reviews`,
        { params }
    );

    return response.data.data;
}

export async function createReviewApi(
    eventId: string,
    payload: CreateReviewPayload
) {
    const response = await api.post<ApiResponse<null>>(
        `/events/${eventId}/reviews`,
        payload
    );

    return response.data;
}

export async function createEventApi(payload: {
    name: string;
    categoryId: string;
    eventDate: string;
    eventTime: string;
    endDate?: string;
    endTime?: string;
    cityId: string;
    venueName: string;
    venueAddress: string;
    description: string;
    ticketTypes: { name: string; description?: string; price: number; quota: number }[];
    images: File[];
}) {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('categoryId', payload.categoryId);
    formData.append('eventDate', payload.eventDate);
    formData.append('eventTime', payload.eventTime);
    if (payload.endDate) formData.append('endDate', payload.endDate);
    if (payload.endTime) formData.append('endTime', payload.endTime);
    formData.append('cityId', payload.cityId);
    formData.append('venueName', payload.venueName);
    formData.append('venueAddress', payload.venueAddress);
    formData.append('description', payload.description);
    formData.append('ticketTypes', JSON.stringify(payload.ticketTypes));

    for (const file of payload.images) {
        formData.append('images', file);
    }

    const response = await api.post<ApiResponse<Event>>('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data;
}

export async function getCategoriesApi() {
    const response = await api.get<ApiResponse<Category[]>>('/categories');

    return response.data.data;
}
