import type { Metadata } from "next";

import SocialsView from "@/views/dashboard/Socials";

export const metadata: Metadata = {
  title: "Social links | Portfolio Admin",
};

export default function SocialsPage() {
  return <SocialsView />;
}
