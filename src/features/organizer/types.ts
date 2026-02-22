import type { Event, Pagination, Review } from '@/types/models';

// ─── API Response Types ───────────────────────────────────────────────────────

export type OrganizerStats = {
  eventCount: number;
  averageRating: number;
  totalReviews: number;
};

export type OrganizerPublicProfile = {
  id: string;
  username: string;
  fullName: string;
  profilePictureUrl: string | null;
  organizerName: string;
  companyAddress: string;
  memberSince: string;
  stats: OrganizerStats;
};

// Reviews from GET /api/organizers/:organizerId/reviews include the event
export type OrganizerReview = Review & {
  event?: {
    id: string;
    name: string;
    slug: string;
  };
};

// The reviews endpoints use different pagination keys than Pagination model
export type ReviewsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OrganizerReviewsResponseData = {
  reviews: OrganizerReview[];
  pagination: ReviewsPagination;
  summary: {
    averageRating: number;
    totalReviews: number;
  };
};

export type OrganizerEventsResponseData = {
  events: Event[];
  pagination: Pagination;
};

// ─── Query Params ─────────────────────────────────────────────────────────────

export type OrganizerReviewsParams = {
  page?: number;
  limit?: number;
};

export type OrganizerPublicEventsParams = {
  status?: 'published' | 'completed';
  page?: number;
  limit?: number;
};
