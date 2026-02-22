import { useState, useCallback, useEffect } from 'react';
import { getOrganizerEventDetailApi } from '../api/organizer-events.api';
import type { OrganizerEventDetailResponseData } from '../types';
import axios from 'axios';
import toast from 'react-hot-toast';

export function useOrganizerEventDetail(idOrSlug: string) {
  const [event, setEvent] = useState<OrganizerEventDetailResponseData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchEventDetail = useCallback(async () => {
    if (!idOrSlug) return;
    setIsLoading(true);
    try {
      const data = await getOrganizerEventDetailApi(idOrSlug);
      setEvent(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to fetch event detail'
        );
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchEventDetail();
  }, [fetchEventDetail]);

  return { event, isLoading, refetch: fetchEventDetail };
}
