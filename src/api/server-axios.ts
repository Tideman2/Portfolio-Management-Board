import axios from "axios";

import { getCookieValue } from "@/api/utils/cookies";
import { authConfig } from "@/config/auth";
import { getBackendBaseUrl } from "@/config/env";

import type { AxiosInstance } from "axios";

/** Backend requests should fail fast rather than hang a page render. */
const REQUEST_TIMEOUT_MS = 20_000;

/**
 * Pass `null` for public reads: the contract requires no token for GETs, and
 * omitting it means a stale cookie cannot turn a public request into a 403.
 * Any other value (or omitting the argument) attaches the session token.
 */
export const getServerAxios = async (
  authToken?: string | null,
): Promise<AxiosInstance> => {
  const sessionToken =
    authToken === null
      ? undefined
      : (authToken ?? (await getCookieValue(authConfig.tokenCookie)));

  const instance = axios.create({
    baseURL: getBackendBaseUrl(),
    timeout: REQUEST_TIMEOUT_MS,
  });

  if (sessionToken) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${sessionToken}`;
  }

  // No default Content-Type: Axios sends JSON for objects and sets the
  // multipart boundary itself when given FormData (project image uploads).
  return instance;
};
