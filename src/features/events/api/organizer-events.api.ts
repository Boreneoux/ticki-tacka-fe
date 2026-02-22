import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type {
  OrganizerEventListParams,
  OrganizerEventListResponseData,
  OrganizerEventDetailResponseData,
  CreateTicketTypePayload,
  UpdateTicketTypePayload,
  CreateVoucherPayload
} from '../types';
import type { TicketType, EventVoucher } from '@/types/models';

export async function getOrganizerEventsApi(
  params: OrganizerEventListParams = {}
) {
  const response = await api.get<ApiResponse<OrganizerEventListResponseData>>(
    '/organizer/events',
    { params }
  );
  return response.data.data;
}

export async function getOrganizerEventDetailApi(idOrSlug: string) {
  // Reuse the public endpoint or organizer endpoint based on backend support
  const response = await api.get<ApiResponse<OrganizerEventDetailResponseData>>(
    `/events/${idOrSlug}`
  );
  return response.data.data;
}

export async function updateEventApi(eventId: string, payload: FormData) {
  const response = await api.put<ApiResponse<OrganizerEventDetailResponseData>>(
    `/events/${eventId}`,
    payload,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return response.data.data;
}

export async function publishEventApi(eventId: string) {
  const response = await api.patch<ApiResponse<null>>(
    `/events/${eventId}/publish`
  );
  return response.data;
}

export async function cancelEventApi(eventId: string) {
  const response = await api.patch<ApiResponse<null>>(
    `/events/${eventId}/cancel`
  );
  return response.data;
}

export async function deleteEventApi(eventId: string) {
  const response = await api.delete<ApiResponse<null>>(`/events/${eventId}`);
  return response.data;
}

export async function createTicketTypeApi(
  eventId: string,
  payload: CreateTicketTypePayload
) {
  const response = await api.post<ApiResponse<TicketType>>(
    `/events/${eventId}/ticket-types`,
    payload
  );
  return response.data.data;
}

export async function updateTicketTypeApi(
  eventId: string,
  ticketTypeId: string,
  payload: UpdateTicketTypePayload
) {
  const response = await api.put<ApiResponse<TicketType>>(
    `/events/${eventId}/ticket-types/${ticketTypeId}`,
    payload
  );
  return response.data.data;
}

export async function deleteTicketTypeApi(
  eventId: string,
  ticketTypeId: string
) {
  const response = await api.delete<ApiResponse<null>>(
    `/events/${eventId}/ticket-types/${ticketTypeId}`
  );
  return response.data;
}

export async function createVoucherApi(
  eventId: string,
  payload: CreateVoucherPayload
) {
  const response = await api.post<ApiResponse<EventVoucher>>(
    `/events/${eventId}/vouchers`,
    payload
  );
  return response.data.data;
}
