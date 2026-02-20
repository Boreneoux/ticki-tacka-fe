export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  user: {
    username: string;
    email: string;
    fullName: string;
    role: string;
    profilePictureUrl: string | null;
  };
  token: string;
};

export type SessionResponseData = {
  username: string;
  email: string;
  fullName: string;
  role: string;
  profilePictureUrl: string | null;
};
