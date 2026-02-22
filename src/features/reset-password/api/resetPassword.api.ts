import api from '@/utils/axiosInstance';

export async function resetPasswordApi(token: string, newPassword: string) {
  const response = await api.post('/auth/reset-password', {
    token,
    newPassword
  });

  return response.data;
}
