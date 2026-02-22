import type { Event, Category, Province, City, Pagination, TicketType, Review } from '@/types/models';

// --- API Response Types ---

export type EventListResponseData = {
    events: Event[];
    pagination: Pagination;
};

export type EventDetailResponseData = Event;

export type TicketTypeListResponseData = TicketType[];

export type ReviewListResponseData = {
    reviews: Review[];
    pagination: Pagination;
    averageRating: number;
    totalReviews: number;
};

export type CategoryListResponseData = Category[];

export type ProvinceListResponseData = Province[];

export type CityListResponseData = City[];

// --- Query Params ---

export type EventListParams = {
    search?: string;
    category?: string;
    city?: string;
    page?: number;
    limit?: number;
};

export type ReviewListParams = {
    page?: number;
    limit?: number;
};

// --- Payloads ---

export type CreateReviewPayload = {
    rating: number;
    reviewText?: string;
};
