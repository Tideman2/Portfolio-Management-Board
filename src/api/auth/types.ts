export type AdminUser = {
  id: number;
  username: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: AdminUser;
};

export type VerifyResponse = {
  verified: boolean;
};
