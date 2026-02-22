import api from '@/utils/axiosInstance';
import { ForgotPasswordFormValues } from '../types';

export async function forgotPasswordApi({ email }: ForgotPasswordFormValues) {
  const response = await api.post('/auth/forgot-password', { email });

  return response.data;
}
