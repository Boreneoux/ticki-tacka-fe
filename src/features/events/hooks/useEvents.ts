import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { getEventsApi } from '../api/events.api';
import type { EventListParams, EventListResponseData } from '../types';

export default function useEvents(params: EventListParams = {}) {
    const [data, setData] = useState<EventListResponseData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getEventsApi(params);
            setData(result);
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || 'Failed to load events'
                : 'Failed to load events';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [JSON.stringify(params)]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        events: data?.events ?? [],
        pagination: data?.pagination ?? null,
        isLoading,
        refetch: fetchEvents
    };
}
