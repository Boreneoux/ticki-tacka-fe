import type { EventStatus } from '@/types/enums';

// ─── Shared ──────────────────────────────────────────────────────────────────

export type StatsFilterBy = 'year' | 'month' | 'day';

export type StatsFilterParams = {
  filterBy?: StatsFilterBy;
  year?: number;
  month?: number;
};

export type ChartDataPoint = {
  label: string; // "2026" | "2026-01" | "2026-01-15"
  revenue: number;
  ticketsSold: number;
  transactions: number;
};

// ─── Aggregate Statistics ─────────────────────────────────────────────────────

export type AggregateSummary = {
  totalRevenue: number;
  totalEvents: number;
  totalTicketsSold: number;
  totalAttendees: number;
};

export type AggregateStatisticsResponseData = {
  summary: AggregateSummary;
  chartData: ChartDataPoint[];
};

// ─── Per-Event Statistics ─────────────────────────────────────────────────────

export type EventSummary = {
  totalRevenue: number;
  totalTicketsSold: number;
  totalAttendees: number;
};

export type TicketBreakdownItem = {
  name: string;
  price: number;
  quota: number;
  soldCount: number;
  revenue: number;
};

export type EventStatisticsResponseData = {
  event: {
    id: string;
    name: string;
    status: EventStatus;
    eventDate: string;
  };
  summary: EventSummary;
  ticketBreakdown: TicketBreakdownItem[];
  chartData: ChartDataPoint[];
};

// ─── Event Attendees ──────────────────────────────────────────────────────────

export type AttendeeTicketDetail = {
  ticketType: string;
  quantity: number;
};

export type AttendeeItem = {
  transactionId: string;
  invoiceNumber: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profilePictureUrl: string | null;
  };
  totalTicketQty: number;
  totalPaid: number;
  ticketDetails: AttendeeTicketDetail[];
  purchasedAt: string;
};

export type EventAttendeesResponseData = {
  event: {
    id: string;
    name: string;
  };
  attendees: AttendeeItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export type AttendeesParams = {
  page?: number;
  limit?: number;
};
