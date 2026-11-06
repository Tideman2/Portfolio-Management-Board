import type { Metadata } from "next";

import ProfileView from "@/views/dashboard/Profile";

export const metadata: Metadata = {
  title: "Profile | Portfolio Admin",
};

export default function ProfilePage() {
  return <ProfileView />;
}
