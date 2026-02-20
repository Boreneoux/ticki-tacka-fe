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
    role: string;
  };
  token: string;
};
