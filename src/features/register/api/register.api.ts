import api from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { RegisterFormValues, RegisterResponseData } from '../types';

export async function registerApi(values: RegisterFormValues) {
  const response = await api.post<ApiResponse<RegisterResponseData>>(
    '/auth/register',
    values
  );

  return response.data.data;
}
