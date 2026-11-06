import type { Metadata } from "next";

import DashboardHomeView from "@/views/dashboard/Home";

export const metadata: Metadata = {
  title: "Dashboard | Portfolio Admin",
};

export default function DashboardPage() {
  return <DashboardHomeView />;
}
