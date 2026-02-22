import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type {
  ProfileData,
  ChangePasswordFormValues,
  PointsResponseData,
  CouponsResponseData
} from '../types';

export async function getProfileApi() {
  const response = await api.get<ApiResponse<ProfileData>>('/users/profile');
  return response.data.data;
}

export async function updateProfileApi(formData: FormData) {
  const response = await api.patch<ApiResponse<ProfileData>>(
    '/users/profile',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return response.data.data;
}

export async function changePasswordApi(
  data: Omit<ChangePasswordFormValues, 'confirmPassword'>
) {
  const response = await api.patch<ApiResponse<null>>('/users/password', data);
  return response.data;
}

export async function getPointsApi() {
  const response =
    await api.get<ApiResponse<PointsResponseData>>('/users/points');
  return response.data.data;
}

export async function getCouponsApi() {
  const response =
    await api.get<ApiResponse<CouponsResponseData>>('/users/coupons');
  return response.data.data;
}
