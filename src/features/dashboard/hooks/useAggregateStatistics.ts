import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import type {
  AggregateStatisticsResponseData,
  StatsFilterBy,
  StatsFilterParams
} from '../types';
import { getAggregateStatisticsApi } from '../api/dashboard.api';

type UseAggregateStatisticsReturn = {
  data: AggregateStatisticsResponseData | null;
  isLoading: boolean;
  filterBy: StatsFilterBy;
  year: number;
  month: number;
  setFilterBy: (filterBy: StatsFilterBy) => void;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  refetch: () => void;
};

export default function useAggregateStatistics(): UseAggregateStatisticsReturn {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [data, setData] = useState<AggregateStatisticsResponseData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filterBy, setFilterByState] = useState<StatsFilterBy>('month');
  const [year, setYearState] = useState<number>(currentYear);
  const [month, setMonthState] = useState<number>(currentMonth);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const params: StatsFilterParams = { filterBy, year };
    if (filterBy === 'day') params.month = month;

    try {
      const result = await getAggregateStatisticsApi(params);
      setData(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || 'Failed to load statistics'
        );
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [filterBy, year, month]);

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
