import { useState, useCallback, useEffect } from 'react';
import { getOrganizerEventsApi } from '../api/organizer-events.api';
import type { OrganizerEventListParams } from '../types';
import type { Event, Pagination } from '@/types/models';
import axios from 'axios';
import toast from 'react-hot-toast';

export function useOrganizerEvents(
  initialParams: OrganizerEventListParams = {}
) {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState<OrganizerEventListParams>(initialParams);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getOrganizerEventsApi(params);
      setEvents(data.events);
      setPagination(data.pagination);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch events');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    pagination,
    isLoading,
    refetch: fetchEvents,
    params,
    setParams
  };
}
