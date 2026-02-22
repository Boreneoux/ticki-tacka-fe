import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type {
  AggregateStatisticsResponseData,
  EventStatisticsResponseData,
  EventAttendeesResponseData,
  StatsFilterParams,
  AttendeesParams
} from '../types';

export async function getAggregateStatisticsApi(
  params: StatsFilterParams = {}
) {
  const queryParams: Record<string, string> = {};

  if (params.filterBy) queryParams.filterBy = params.filterBy;
  if (params.year !== undefined) queryParams.year = String(params.year);
  if (params.month !== undefined) queryParams.month = String(params.month);

  const response = await api.get<ApiResponse<AggregateStatisticsResponseData>>(
    '/organizer/statistics',
    { params: queryParams }
  );

  return response.data.data;
}

export async function getEventStatisticsApi(
  eventId: string,
  params: StatsFilterParams = {}
) {
  const queryParams: Record<string, string> = {};

  if (params.filterBy) queryParams.filterBy = params.filterBy;
  if (params.year !== undefined) queryParams.year = String(params.year);
  if (params.month !== undefined) queryParams.month = String(params.month);

  const response = await api.get<ApiResponse<EventStatisticsResponseData>>(
    `/organizer/events/${eventId}/statistics`,
    { params: queryParams }
  );

  return response.data.data;
}

export async function getEventAttendeesApi(
  eventId: string,
  params: AttendeesParams = {}
) {
  const queryParams: Record<string, string> = {};

  if (params.page !== undefined) queryParams.page = String(params.page);
  if (params.limit !== undefined) queryParams.limit = String(params.limit);

  const response = await api.get<ApiResponse<EventAttendeesResponseData>>(
    `/organizer/events/${eventId}/attendees`,
    { params: queryParams }
  );

  return response.data.data;
}
