import type {
  DiscountType,
  EventStatus,
  Role,
  TransactionStatus
} from '@/types/enums';

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
};

export type Province = {
  id: string;
  name: string;
};

export type City = {
  id: string;
  name: string;
  provinceId: string;
  province?: Province;
};

export type Category = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  profilePictureUrl: string | null;
  phoneNumber: string | null;
  referralCode: string | null;
  pointBalance: number;
};

export type Organizer = {
  id: string;
  userId: string;
  organizerName: string;
  companyAddress: string;
  user?: Pick<User, 'username' | 'email' | 'fullName' | 'profilePictureUrl'>;
};

export type TicketType = {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  price: number;
  quota: number;
  soldCount: number;
  availableQuota: number;
};

export type EventVoucher = {
  id: string;
  eventId: string;
  voucherCode: string;
  voucherName: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number | null;
  maxUsage: number;
  usedCount: number;
  startDate: string;
  expiredAt: string;
  isActive: boolean;
};

export type EventImage = {
  id: string;
  eventId: string;
  imageUrl: string;
  imagePublicId: string;
};

export type Event = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: EventStatus;
  eventDate: string;
  eventTime: string;
  endDate: string | null;
  endTime: string | null;
  venueName: string;
  venueAddress: string;
  images: string[];
  categoryId: string;
  cityId: string;
  organizerId: string;
  category?: Category;
  city?: City;
  organizer?: Organizer;
  ticketTypes?: TicketType[];
  eventImages?: EventImage[];
  vouchers?: EventVoucher[];
  lowestPrice?: number;
};

export type Review = {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  user?: Pick<User, 'username' | 'fullName' | 'profilePictureUrl'>;
};

export type UserCoupon = {
  id: string;
  userId: string;
  discountValue: number; // percentage e.g. 10 = 10%
  isUsed: boolean;
  expiredAt: string;
};

export type TransactionItem = {
  id: string;
  transactionId: string;
  ticketTypeId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  ticketType?: Pick<TicketType, 'name' | 'description' | 'price'>;
};

export type Transaction = {
  id: string;
  invoiceNumber: string;
  userId: string;
  eventId: string;
  status: TransactionStatus;
  totalAmount: number;
  pointsUsed: number;
  couponDiscount: number;
  voucherDiscount: number;
  paymentDeadline: string | null;
  paymentProofUrl: string | null;
  proofUploadedAt: string | null;
  confirmationDeadline: string | null;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'username' | 'email' | 'fullName' | 'profilePictureUrl'>;
  event?: Pick<
    Event,
    'id' | 'name' | 'slug' | 'eventDate' | 'venueName' | 'images'
  >;
  items?: TransactionItem[];
  userCoupon?: UserCoupon | null;
  eventVoucher?: EventVoucher | null;
};
