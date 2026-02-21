import type { Role } from '@/types/enums';
import type { User } from '@/types/models';

export type RegisterFormValues = {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  referralCode: string;
  role: Role;
  organizerName: string;
  companyAddress: string;
};

export type RegisterResponseData = {
  user: Pick<
    User,
    'username' | 'email' | 'fullName' | 'role' | 'profilePictureUrl'
  >;
  token: string;
};
