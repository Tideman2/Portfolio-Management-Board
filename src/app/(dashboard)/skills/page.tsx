import type { Metadata } from "next";

import SkillsView from "@/views/dashboard/Skills";

export const metadata: Metadata = {
  title: "Skills | Portfolio Admin",
};

export default function SkillsPage() {
  return <SkillsView />;
}
