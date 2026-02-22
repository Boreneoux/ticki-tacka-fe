import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { getOrganizerPublicEventsApi } from '../api/organizer.api';
import type { Event, Pagination } from '@/types/models';
import type { OrganizerPublicEventsParams } from '../types';

const EVENTS_PER_PAGE = 9;

export default function useOrganizerEvents(
  organizerId: string | undefined,
  params: Omit<OrganizerPublicEventsParams, 'page' | 'limit'> = {}
) {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchEvents = useCallback(async () => {
    if (!organizerId) return;

    setIsLoading(true);
    try {
      const data = await getOrganizerPublicEventsApi(organizerId, {
        ...params,
        page,
        limit: EVENTS_PER_PAGE
      });
      setEvents(data.events);
      setPagination(data.pagination);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to load events'
        : 'Failed to load events';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizerId, page, JSON.stringify(params)]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset to page 1 when filter params change
  const handleSetStatus = useCallback(() => {
    setPage(1);
  }, []);

  return {
    events,
    pagination,
    isLoading,
    page,
    setPage,
    onStatusChange: handleSetStatus
  };
}
