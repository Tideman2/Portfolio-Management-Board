import { getServerAxios } from "@/api/server-axios";
import { portfolioApi } from "@/config/portfolio-api";

import type {
  Skill,
  SkillInput,
  SkillKind,
  SkillUpdate,
} from "@/api/skills/types";

const collectionPath = (kind: SkillKind): string =>
  kind === "professional"
    ? portfolioApi.professionalSkills
    : portfolioApi.technicalSkills;

const itemPath = (kind: SkillKind, id: number): string =>
  kind === "professional"
    ? portfolioApi.professionalSkill(id)
    : portfolioApi.technicalSkill(id);

export const listSkills = async (kind: SkillKind): Promise<Skill[]> => {
  const server = await getServerAxios(null);
  const response = await server.get<Skill[]>(collectionPath(kind));
  return response.data;
};

export const createSkill = async (
  kind: SkillKind,
  payload: SkillInput,
): Promise<Skill> => {
  const server = await getServerAxios();
  const response = await server.post<Skill>(collectionPath(kind), payload);
  return response.data;
};

export const updateSkill = async (
  kind: SkillKind,
  id: number,
  payload: SkillUpdate,
): Promise<Skill> => {
  const server = await getServerAxios();
  const response = await server.patch<Skill>(itemPath(kind, id), payload);
  return response.data;
};

export const deleteSkill = async (
  kind: SkillKind,
  id: number,
): Promise<void> => {
  const server = await getServerAxios();
  await server.delete(itemPath(kind, id));
};
