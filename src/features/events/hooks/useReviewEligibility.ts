import { useState, useEffect } from 'react';
import api from '@/utils/axiosInstance';
import type { ApiResponse } from '@/types/api';
import type { Transaction } from '@/types/models';

type ReviewEligibility = {
    canReview: boolean;
    reason: string | null;
    isChecking: boolean;
};


export default function useReviewEligibility(
    eventId: string | undefined,
    isLoggedIn: boolean,
    isPastEvent: boolean,
    /** The usernames of users who already left a review (from the reviews list) */
    existingReviewerUsernames: string[],
    /** The current user's username from the auth store */
    currentUsername: string
): ReviewEligibility {
    const [canReview, setCanReview] = useState(false);
    const [reason, setReason] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {

        if (!eventId || !isLoggedIn || !isPastEvent) {
            setCanReview(false);
            setReason(null);
            return;
        }


        if (
            currentUsername &&
            existingReviewerUsernames.includes(currentUsername)
        ) {
            setCanReview(false);
            setReason('You have already reviewed this event');
            return;
        }


        const checkTransaction = async () => {
            setIsChecking(true);
            try {
                const response = await api.get<
                    ApiResponse<{
                        transactions: Transaction[];
                        pagination: { totalCount: number };
                    }>
                >('/transactions', {
                    params: { status: 'done', limit: 50 }
                });

                const transactions = response.data.data.transactions;
                const hasCompletedTransaction = transactions.some(
                    t => t.eventId === eventId
                );

                if (!hasCompletedTransaction) {
                    setCanReview(false);
                    setReason(
                        'You can only review events you have attended (transaction must be completed)'
                    );
                } else {
                    setCanReview(true);
                    setReason(null);
                }
            } catch {

                setCanReview(false);
                setReason(null);
            } finally {
                setIsChecking(false);
            }
        };

        checkTransaction();
    }, [eventId, isLoggedIn, isPastEvent, currentUsername, existingReviewerUsernames]);

    return { canReview, reason, isChecking };
}
