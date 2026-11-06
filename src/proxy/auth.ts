import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

import { authConfig } from "@/config/auth";
import { PATHS } from "@/routes/paths";

import type { NextRequest } from "next/server";

type TokenPayload = { exp?: number };

const PROTECTED_ROUTES = [
  PATHS.dashboard.root,
  PATHS.dashboard.profile,
  PATHS.dashboard.socials,
  PATHS.dashboard.skills,
  PATHS.dashboard.projectGroups,
  PATHS.dashboard.projects,
] as const;

const AUTH_ROUTES = [PATHS.auth.login] as const;

const isRoute = (pathname: string, root: string): boolean =>
  pathname === root || pathname.startsWith(`${root}/`);

const matchesAny = (pathname: string, routes: readonly string[]): boolean =>
  routes.some((route) => isRoute(pathname, route));

/**
 * The contract has no refresh endpoint, so a token is either usable or the
 * admin signs in again. Signature validation is the backend's job; the proxy
 * only reads `exp` to avoid sending an obviously dead token.
 */
const isTokenFresh = (token: string | undefined): boolean => {
  if (!token) {
    return false;
  }

  try {
    const { exp } = jwtDecode<TokenPayload>(token);
    return typeof exp === "number" && exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const clearAuthCookies = (response: NextResponse): NextResponse => {
  response.cookies.delete(authConfig.tokenCookie);
  response.cookies.delete(authConfig.userCookie);
  return response;
};

const redirectToLogin = (request: NextRequest): NextResponse =>
  clearAuthCookies(
    NextResponse.redirect(new URL(PATHS.auth.login, request.url)),
  );

export const checkAuthentication = async (
  request: NextRequest,
): Promise<NextResponse> => {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = matchesAny(pathname, PROTECTED_ROUTES);
  const isAuthRoute = matchesAny(pathname, AUTH_ROUTES);

  // Public routes never gate on a cookie.
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(authConfig.tokenCookie)?.value;

  if (isTokenFresh(token)) {
    return isAuthRoute
      ? NextResponse.redirect(new URL(PATHS.dashboard.root, request.url))
      : NextResponse.next();
  }

  return isProtectedRoute
    ? redirectToLogin(request)
    : clearAuthCookies(NextResponse.next());
};
