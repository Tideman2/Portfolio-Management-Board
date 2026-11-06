import { getServerAxios } from "@/api/server-axios";
import { listProjectGroups } from "@/api/project-groups/server-side";
import { portfolioApi } from "@/config/portfolio-api";

import type {
  Project,
  ProjectGroupWithProjects,
  ProjectInput,
  ProjectUpdate,
} from "@/api/projects/types";

const toFormData = (input: ProjectInput | ProjectUpdate): FormData => {
  const form = new FormData();

  for (const [key, value] of Object.entries(input)) {
    if (key === "image" || value === undefined || value === null) {
      continue;
    }

    form.append(key, String(value));
  }

  if (input.image instanceof File) {
    form.append("image", input.image);
  }

  return form;
};

export const listProjects = async (params?: {
  groupId?: number;
}): Promise<Project[]> => {
  const server = await getServerAxios(null);
  const response = await server.get<Project[]>(portfolioApi.projects, {
    params:
      params?.groupId === undefined
        ? undefined
        : { group_id: params.groupId },
  });
  return response.data;
};

/**
 * Project responses deliberately omit `group_id`. Fetching each group's
 * projects is the contract's recommended way to recover that context.
 */
export const listGroupedProjects = async (): Promise<
  ProjectGroupWithProjects[]
> => {
  const groups = await listProjectGroups();

  return Promise.all(
    groups.map(async (group) => ({
      group,
      projects: await listProjects({ groupId: group.id }),
    })),
  );
};

/** The backend returns only a message; callers refetch the list. */
export const createProject = async (input: ProjectInput): Promise<void> => {
  const server = await getServerAxios();
  await server.post(portfolioApi.projects, toFormData(input));
};

export const updateProject = async (
  id: number,
  input: ProjectUpdate,
): Promise<void> => {
  const server = await getServerAxios();
  const body = input.image === undefined ? input : toFormData(input);
  await server.patch(portfolioApi.project(id), body);
};

export const deleteProject = async (id: number): Promise<void> => {
  const server = await getServerAxios();
  await server.delete(portfolioApi.project(id));
};
