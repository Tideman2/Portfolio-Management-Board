import { getServerAxios } from "@/api/server-axios";
import { portfolioApi } from "@/config/portfolio-api";

import type { Profile, ProfileUpdate } from "@/api/profile/types";

/** A missing singleton profile row reads as an empty editor, not an error. */
export const getProfile = async (): Promise<Profile | null> => {
  try {
    const server = await getServerAxios(null);
    const response = await server.get<Profile>(portfolioApi.profile);
    return response.data;
  } catch (error) {
    const status = (error as { response?: { status?: number } }).response?.status;

    if (status === 404) {
      return null;
    }

    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (
  payload: ProfileUpdate,
): Promise<Profile> => {
  const server = await getServerAxios();
  const response = await server.patch<Profile>(portfolioApi.profile, payload);
  return response.data;
};
