import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import type { Category } from '@/types/models';
import { getCategoriesApi } from '../api/events.api';

export default function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const result = await getCategoriesApi();
                setCategories(result);
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Failed to load categories'
                    : 'Failed to load categories';
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return { categories, isLoading };
}
