import type { Role } from '@/types/enums';
import type { User } from '@/types/models';

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  user: Pick<
    User,
    'username' | 'email' | 'fullName' | 'role' | 'profilePictureUrl'
  >;
  token: string;
};

export type SessionResponseData = Pick<
  User,
  | 'id'
  | 'username'
  | 'email'
  | 'fullName'
  | 'role'
  | 'profilePictureUrl'
  | 'referralCode'
> & {
  role: Role;
};
