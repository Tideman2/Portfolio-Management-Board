import { getServerAxios } from "@/api/server-axios";
import { portfolioApi } from "@/config/portfolio-api";

import type { Social, SocialInput, SocialUpdate } from "@/api/socials/types";

export const listSocials = async (): Promise<Social[]> => {
  const server = await getServerAxios(null);
  const response = await server.get<Social[]>(portfolioApi.socials);
  return response.data;
};

export const createSocial = async (payload: SocialInput): Promise<Social> => {
  const server = await getServerAxios();
  const response = await server.post<Social>(portfolioApi.socials, payload);
  return response.data;
};

export const updateSocial = async (
  id: number,
  payload: SocialUpdate,
): Promise<Social> => {
  const server = await getServerAxios();
  const response = await server.patch<Social>(
    portfolioApi.social(id),
    payload,
  );
  return response.data;
};

export const deleteSocial = async (id: number): Promise<void> => {
  const server = await getServerAxios();
  await server.delete(portfolioApi.social(id));
};
