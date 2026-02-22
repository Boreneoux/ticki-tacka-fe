import type {
  Event,
  Category,
  Province,
  City,
  Pagination,
  TicketType,
  Review,
  EventVoucher
} from '@/types/models';
import type { EventStatus, DiscountType } from '@/types/enums';

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

// --- Organizer Types ---

export type OrganizerEventListResponseData = {
  events: Event[]; // or extending Event with specific ticket stats if backend provides
  pagination: Pagination;
};

export type OrganizerEventDetailResponseData = Event & {
  ticketTypes?: TicketType[];
  vouchers?: EventVoucher[];
  // any extra fields returned by backend
};

export type OrganizerEventListParams = {
  status?: EventStatus;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export type CreateTicketTypePayload = {
  name: string;
  description?: string;
  price: number;
  quota: number;
};

export type UpdateTicketTypePayload = Partial<CreateTicketTypePayload>;

export type CreateVoucherPayload = {
  voucherCode: string;
  voucherName: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number | null;
  maxUsage: number;
  startDate: string;
  expiredAt: string;
  isActive: boolean;
};

export type CreateEventPayload = FormData;
export type UpdateEventPayload = FormData;

export type EventFormValues = {
  name: string;
  categoryId: string;
  eventDate: string;
  eventTime: string;
  endDate: string;
  endTime: string;
  cityId: string;
  venueName: string;
  venueAddress: string;
  description: string;
  images: File[];
  existingImages?: string[];
  ticketTypes: CreateTicketTypePayload[];
};

export type VoucherFormValues = {
  voucherCode: string;
  voucherName: string;
  discountType: DiscountType | '';
  discountValue: number | '';
  maxDiscount: number | '';
  maxUsage: number | '';
  startDate: string;
  expiredAt: string;
  isActive: boolean;
};
