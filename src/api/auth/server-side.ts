import { getServerAxios } from "@/api/server-axios";
import { authConfig } from "@/config/auth";

import type {
  LoginRequest,
  LoginResponse,
  VerifyResponse,
} from "@/api/auth/types";

export const loginAdmin = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const server = await getServerAxios();
  const response = await server.post<LoginResponse>(
    authConfig.loginEndpoint,
    payload,
  );
  return response.data;
};

export const verifyAdminToken = async (
  authToken?: string,
): Promise<boolean> => {
  const server = await getServerAxios(authToken);
  const response = await server.post<VerifyResponse>(authConfig.verifyEndpoint);
  return response.data.verified === true;
};
