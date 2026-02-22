import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import type { AttendeeItem, EventAttendeesResponseData } from '../types';
import { getEventAttendeesApi } from '../api/dashboard.api';

type Pagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
};

type UseEventAttendeesReturn = {
  eventName: string;
  attendees: AttendeeItem[];
  pagination: Pagination | null;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  refetch: () => void;
};

export default function useEventAttendees(
  eventId: string
): UseEventAttendeesReturn {
  const [eventName, setEventName] = useState('');
  const [attendees, setAttendees] = useState<AttendeeItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPageState] = useState(1);

  const fetchData = useCallback(async () => {
    if (!eventId) return;

    setIsLoading(true);

    try {
      const result: EventAttendeesResponseData = await getEventAttendeesApi(
        eventId,
        { page, limit: 10 }
      );
      setEventName(result.event.name);
      setAttendees(result.attendees);
      setPagination(result.pagination);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to load attendees'
        );
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventId, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPage = (value: number) => {
    setPageState(value);
  };

  return {
    eventName,
    attendees,
    pagination,
    isLoading,
    page,
    setPage,
    refetch: fetchData
  };
}
