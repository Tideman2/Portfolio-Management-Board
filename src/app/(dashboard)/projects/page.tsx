import type { Metadata } from "next";

import ProjectsView from "@/views/dashboard/Projects";

export const metadata: Metadata = {
  title: "Projects | Portfolio Admin",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
