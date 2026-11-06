import type { Metadata } from "next";

import ProjectGroupsView from "@/views/dashboard/ProjectGroups";

export const metadata: Metadata = {
  title: "Project groups | Portfolio Admin",
};

export default function ProjectGroupsPage() {
  return <ProjectGroupsView />;
}
