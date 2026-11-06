import { AuthProvider } from "@/contexts/authSession/context";
import DashboardShell from "@/layout/core/Dashboard";

import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
