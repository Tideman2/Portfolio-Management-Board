import type { ProjectGroup } from "@/api/project-groups/types";

export type Project = {
  id: number;
  title: string;
  image: string | null;
  stack: string | null;
  goal: string | null;
  github_url: string | null;
  demo_url: string | null;
};

export type ProjectInput = {
  title: string;
  stack: string;
  goal: string;
  github_url: string;
  demo_url: string;
  group_id: number;
  image?: File;
};

export type ProjectUpdate = Partial<Omit<ProjectInput, "image">> & {
  image?: File;
};

export type ProjectGroupWithProjects = {
  group: ProjectGroup;
  projects: Project[];
};

/** Accepts only a real image file within the client-side limit. */
export const MAX_PROJECT_IMAGE_BYTES = 5 * 1024 * 1024;
