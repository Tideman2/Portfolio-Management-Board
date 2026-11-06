import { cookies } from "next/headers";

import { authCookieOptions } from "@/config/auth";

import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export type AuthCookieOptions = {
  maxAge?: number;
  path?: string;
};

export const getCookie = async (
  name: string,
): Promise<RequestCookie | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(name);
};

export const getCookieValue = async (
  name: string,
): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

export const setCookie = async (
  name: string,
  value: string,
  options: AuthCookieOptions = {},
): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    ...authCookieOptions,
    path: options.path ?? authCookieOptions.path,
    ...(options.maxAge === undefined ? {} : { maxAge: options.maxAge }),
  });
};

export const removeCookie = async (name: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
