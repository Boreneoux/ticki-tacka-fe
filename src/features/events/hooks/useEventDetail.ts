import { useState, useEffect, useCallback } from 'react';

import type { Event, TicketType } from '@/types/models';
import {
    getEventBySlugApi,
    getTicketTypesApi
} from '../api/events.api';

type UseEventDetailReturn = {
    event: Event | null;
    ticketTypes: TicketType[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
};

export default function useEventDetail(slug: string | undefined): UseEventDetailReturn {
    const [event, setEvent] = useState<Event | null>(null);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!slug) {
            setIsLoading(false);
            setError('Event not found');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const eventData = await getEventBySlugApi(slug);
            setEvent(eventData);


            if (eventData?.id) {
                try {
                    const tickets = await getTicketTypesApi(eventData.id);
                    setTicketTypes(tickets);
                } catch {

                    setTicketTypes(eventData.ticketTypes ?? []);
                }
            }
        } catch {
            setError('Failed to load event details');
            setEvent(null);
        } finally {
            setIsLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { event, ticketTypes, isLoading, error, refetch: fetchData };
}
