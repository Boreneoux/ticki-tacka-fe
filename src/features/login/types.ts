export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  user: {
    username: string;
    role: string;
  };
  token: string;
};

export type SessionResponseData = {
  username: string;
  role: string;
};
