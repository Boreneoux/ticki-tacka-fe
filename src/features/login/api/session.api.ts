import api from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { SessionResponseData } from '../types';

export async function sessionApi() {
  const response =
    await api.get<ApiResponse<SessionResponseData>>('/auth/session');

  return response.data.data;
}
