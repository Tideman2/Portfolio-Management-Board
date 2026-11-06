import { NextResponse } from "next/server";

import { checkAuthentication } from "@/proxy/auth";

import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const isPrefetch =
    request.headers.get("next-router-prefetch") ||
    request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    return NextResponse.next();
  }

  return checkAuthentication(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
