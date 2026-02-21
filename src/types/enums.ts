export type Role = 'User' | 'EO';

export type EventStatus = 'draft' | 'published' | 'completed' | 'canceled';

export type TransactionStatus =
  | 'waiting_for_payment'
  | 'waiting_for_admin_confirmation'
  | 'done'
  | 'canceled'
  | 'expired'
  | 'rejected';

export type DiscountType = 'percentage' | 'fixed';
