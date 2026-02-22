import { useState, useEffect, useCallback } from 'react';

import type { Review, Pagination } from '@/types/models';
import { getEventReviewsApi, createReviewApi } from '../api/events.api';
import type { ReviewListParams, CreateReviewPayload } from '../types';

type UseEventReviewsReturn = {
    reviews: Review[];
    pagination: Pagination | null;
    averageRating: number;
    totalReviews: number;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    submitReview: (payload: CreateReviewPayload) => Promise<boolean>;
    refetch: () => void;
    setPage: (page: number) => void;
};

const REVIEWS_PER_PAGE = 5;

export default function useEventReviews(
    eventId: string | undefined
): UseEventReviewsReturn {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const fetchReviews = useCallback(async () => {
        if (!eventId) return;

        setIsLoading(true);
        setError(null);

        try {
            const params: ReviewListParams = {
                page,
                limit: REVIEWS_PER_PAGE
            };
            const data = await getEventReviewsApi(eventId, params);

            setReviews(data.reviews);
            setPagination(data.pagination);
            setAverageRating(data.averageRating);
            setTotalReviews(data.totalReviews);
        } catch {
            setError('Failed to load reviews');
        } finally {
            setIsLoading(false);
        }
    }, [eventId, page]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const submitReview = useCallback(
        async (payload: CreateReviewPayload): Promise<boolean> => {
            if (!eventId) return false;

            setIsSubmitting(true);
            try {
                await createReviewApi(eventId, payload);

                await fetchReviews();
                return true;
            } catch {
                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [eventId, fetchReviews]
    );

    return {
        reviews,
        pagination,
        averageRating,
        totalReviews,
        isLoading,
        isSubmitting,
        error,
        submitReview,
        refetch: fetchReviews,
        setPage
    };
}
