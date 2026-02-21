import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import type { Province, City } from '@/types/models';
import { getProvincesApi, getCitiesApi } from '../api/locations.api';

export function useProvinces() {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProvinces() {
            try {
                const result = await getProvincesApi();
                setProvinces(result);
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Failed to load provinces'
                    : 'Failed to load provinces';
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProvinces();
    }, []);

    return { provinces, isLoading };
}

export function useCities(provinceId: string | undefined) {
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!provinceId) {
            setCities([]);
            return;
        }

        async function fetchCities() {
            setIsLoading(true);
            try {
                const result = await getCitiesApi(provinceId!);
                setCities(result);
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Failed to load cities'
                    : 'Failed to load cities';
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCities();
    }, [provinceId]);

    return { cities, isLoading };
}
