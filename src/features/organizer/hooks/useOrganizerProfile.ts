import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { getOrganizerPublicProfileApi } from '../api/organizer.api';
import type { OrganizerPublicProfile } from '../types';

export default function useOrganizerProfile(username: string | undefined) {
  const [data, setData] = useState<OrganizerPublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!username) return;

    setIsLoading(true);
    setNotFound(false);
    try {
      const result = await getOrganizerPublicProfileApi(username);
      setData(result);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setNotFound(true);
      } else {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to load organizer profile'
          : 'Failed to load organizer profile';
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile: data, isLoading, notFound };
}
