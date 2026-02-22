import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import type {
  EventStatisticsResponseData,
  StatsFilterBy,
  StatsFilterParams
} from '../types';
import { getEventStatisticsApi } from '../api/dashboard.api';

type UseEventStatisticsReturn = {
  data: EventStatisticsResponseData | null;
  isLoading: boolean;
  filterBy: StatsFilterBy;
  year: number;
  month: number;
  setFilterBy: (filterBy: StatsFilterBy) => void;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  refetch: () => void;
};

export default function useEventStatistics(
  eventId: string
): UseEventStatisticsReturn {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [data, setData] = useState<EventStatisticsResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterBy, setFilterByState] = useState<StatsFilterBy>('month');
  const [year, setYearState] = useState<number>(currentYear);
  const [month, setMonthState] = useState<number>(currentMonth);

  const fetchData = useCallback(async () => {
    if (!eventId) return;

    setIsLoading(true);

    const params: StatsFilterParams = { filterBy, year };
    if (filterBy === 'day') params.month = month;

    try {
      const result = await getEventStatisticsApi(eventId, params);
      setData(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to load event statistics'
        );
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventId, filterBy, year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setFilterBy = (value: StatsFilterBy) => {
    setFilterByState(value);
  };

  const setYear = (value: number) => {
    setYearState(value);
  };

  const setMonth = (value: number) => {
    setMonthState(value);
  };

  return {
    data,
    isLoading,
    filterBy,
    year,
    month,
    setFilterBy,
    setYear,
    setMonth,
    refetch: fetchData
  };
}
