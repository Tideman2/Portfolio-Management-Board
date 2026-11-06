import { getServerAxios } from "@/api/server-axios";
import { portfolioApi } from "@/config/portfolio-api";

import type {
  ProjectGroup,
  ProjectGroupInput,
} from "@/api/project-groups/types";

export const listProjectGroups = async (): Promise<ProjectGroup[]> => {
  const server = await getServerAxios(null);
  const response = await server.get<ProjectGroup[]>(portfolioApi.projectGroups);
  return response.data;
};

export const createProjectGroup = async (
  payload: ProjectGroupInput,
): Promise<ProjectGroup> => {
  const server = await getServerAxios();
  const response = await server.post<ProjectGroup>(
    portfolioApi.projectGroups,
    payload,
  );
  return response.data;
};

export const updateProjectGroup = async (
  id: number,
  payload: ProjectGroupInput,
): Promise<ProjectGroup> => {
  const server = await getServerAxios();
  const response = await server.patch<ProjectGroup>(
    portfolioApi.projectGroup(id),
    payload,
  );
  return response.data;
};

export const deleteProjectGroup = async (id: number): Promise<void> => {
  const server = await getServerAxios();
  await server.delete(portfolioApi.projectGroup(id));
};
