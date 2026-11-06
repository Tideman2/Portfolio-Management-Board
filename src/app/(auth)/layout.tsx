import AuthShell from "@/layout/core/Auth";

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
