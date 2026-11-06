export const authConfig = {
  loginEndpoint: "/api/auth/login",
  verifyEndpoint: "/api/auth/verify",
  tokenCookie: "portfolioAdminToken",
  userCookie: "portfolioAdminUser",
} as const;

/**
 * The contract does not publish a token TTL. Cookies fall back to this
 * lifetime; a readable JWT `exp` always wins.
 */
export const DEFAULT_TOKEN_MAX_AGE = 60 * 60 * 2;

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export const tokenCookieOptions = {
  ...authCookieOptions,
  maxAge: DEFAULT_TOKEN_MAX_AGE,
};

export const userCookieOptions = {
  ...authCookieOptions,
  maxAge: DEFAULT_TOKEN_MAX_AGE,
};
