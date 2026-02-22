import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { getCouponsApi } from '../api/profile.api';
import type { CouponEntry } from '../types';

export default function useCoupons() {
  const [coupons, setCoupons] = useState<CouponEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCouponsApi();
      setCoupons(data.coupons);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to load coupons'
        : 'Failed to load coupons';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return { coupons, isLoading };
}
