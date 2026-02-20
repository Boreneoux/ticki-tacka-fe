export type RegisterFormValues = {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  referralCode: string;
  role: 'User' | 'EO';
  organizerName: string;
  companyAddress: string;
};

export type RegisterResponseData = {
  user: {
    username: string;
    email: string;
    fullName: string;
    role: string;
    profilePictureUrl: string | null;
  };
  token: string;
};
