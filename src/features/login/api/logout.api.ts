import api from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';

export async function logoutApi() {
  const response = await api.post<ApiResponse<null>>('/auth/logout');

  return response.data;
}
