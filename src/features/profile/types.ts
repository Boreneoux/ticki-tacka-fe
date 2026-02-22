import type { Role } from '@/types/enums';

export type ProfileData = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  profilePictureUrl: string | null;
  phoneNumber: string | null;
  referralCode: string | null;
  pointBalance: number;
  createdAt: string;
  organizer: {
    id: string;
    organizerName: string;
    companyAddress: string;
  } | null;
};

export type EditProfileFormValues = {
  username: string;
  fullName: string;
  phoneNumber: string;
  organizerName: string;
  companyAddress: string;
};

export type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Points
export type PointUsageHistory = {
  amountUsed: number;
  invoiceNumber: string;
  usedAt: string;
};

export type PointEntry = {
  id: string;
  amount: number;
  source: string;
  status: 'active' | 'used' | 'expired';
  expiredAt: string;
  createdAt: string;
  usageHistory: PointUsageHistory[];
};

export type PointsResponseData = {
  balance: number;
  points: PointEntry[];
};

// Coupons
export type CouponUsedInTransaction = {
  invoiceNumber: string;
  transactionDate: string;
};

export type CouponEntry = {
  id: string;
  couponCode: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  status: 'active' | 'used' | 'expired';
  expiredAt: string;
  usedAt: string | null;
  createdAt: string;
  usedInTransaction: CouponUsedInTransaction | null;
};

export type CouponsResponseData = {
  coupons: CouponEntry[];
};
