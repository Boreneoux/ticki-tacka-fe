import { useState, useEffect, useCallback } from 'react';

import { getOrganizerReviewsApi } from '../api/organizer.api';
import type { OrganizerReview, ReviewsPagination } from '../types';

const REVIEWS_PER_PAGE = 6;

export default function useOrganizerReviews(organizerId: string | undefined) {
  const [reviews, setReviews] = useState<OrganizerReview[]>([]);
  const [pagination, setPagination] = useState<ReviewsPagination | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchReviews = useCallback(async () => {
    if (!organizerId) return;

    setIsLoading(true);
    try {
      const data = await getOrganizerReviewsApi(organizerId, {
        page,
        limit: REVIEWS_PER_PAGE
      });
      setReviews(data.reviews);
      setPagination(data.pagination);
      setAverageRating(data.summary.averageRating);
      setTotalReviews(data.summary.totalReviews);
    } finally {
      setIsLoading(false);
    }
  }, [organizerId, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    pagination,
    averageRating,
    totalReviews,
    isLoading,
    page,
    setPage
  };
}
