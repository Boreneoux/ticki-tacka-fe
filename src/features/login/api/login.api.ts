import api from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api';
import { LoginFormValues, LoginResponseData } from '../types';

export async function loginApi({ email, password }: LoginFormValues) {
  const response = await api.post<ApiResponse<LoginResponseData>>(
    '/auth/login',
    { email, password }
  );

  return response.data.data;
}
