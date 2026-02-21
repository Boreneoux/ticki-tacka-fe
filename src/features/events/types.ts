import type { Event, Category, Province, City, Pagination } from '@/types/models';

// --- API Response Types ---

export type EventListResponseData = {
    events: Event[];
    pagination: Pagination;
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
