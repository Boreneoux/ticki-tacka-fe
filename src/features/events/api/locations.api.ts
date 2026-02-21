import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Province, City } from '@/types/models';

export async function getProvincesApi() {
    const response = await api.get<ApiResponse<Province[]>>(
        '/locations/provinces'
    );

    return response.data.data;
}

export async function getCitiesApi(provinceId: string) {
    const response = await api.get<ApiResponse<City[]>>(
        `/locations/provinces/${provinceId}/cities`
    );

    return response.data.data;
}
