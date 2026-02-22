import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { getPointsApi } from '../api/profile.api';
import type { PointEntry } from '../types';

export default function usePoints() {
  const [points, setPoints] = useState<PointEntry[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPoints = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPointsApi();
      setBalance(data.balance);
      setPoints(data.points);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to load points'
        : 'Failed to load points';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return { points, balance, isLoading };
}
