import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type {
  OrganizerPublicProfile,
  OrganizerReviewsResponseData,
  OrganizerEventsResponseData,
  OrganizerReviewsParams,
  OrganizerPublicEventsParams
} from '../types';

export async function getOrganizerPublicProfileApi(username: string) {
  const response = await api.get<ApiResponse<OrganizerPublicProfile>>(
    `/organizers/public/${username}`
  );
  return response.data.data;
}

export async function getOrganizerReviewsApi(
  organizerId: string,
  params: OrganizerReviewsParams = {}
) {
  const response = await api.get<ApiResponse<OrganizerReviewsResponseData>>(
    `/organizers/${organizerId}/reviews`,
    { params }
  );
  return response.data.data;
}

export async function getOrganizerPublicEventsApi(
  organizerId: string,
  params: OrganizerPublicEventsParams = {}
) {
  const response = await api.get<ApiResponse<OrganizerEventsResponseData>>(
    `/organizers/${organizerId}/events`,
    { params }
  );
  return response.data.data;
}
