"use server";

import { socialSchema } from "@/api/socials/schemas";
import {
  createSocial as fetchCreateSocial,
  deleteSocial as fetchDeleteSocial,
  listSocials as fetchListSocials,
  updateSocial as fetchUpdateSocial,
} from "@/api/socials/server-side";
import { toServerActionFailure } from "@/app/actions/action-failure";
import { toFieldErrors } from "@/utils/zod";

import type { Social, SocialInput, SocialUpdate } from "@/api/socials/types";
import type { ActionResult } from "@/api/utils/action-result";

export async function getSocials(): Promise<Social[]> {
  return fetchListSocials();
}

export async function createSocial(
  input: SocialInput,
): Promise<ActionResult<Social>> {
  const parsed = socialSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    const social = await fetchCreateSocial(parsed.data);
    return { success: true, data: social };
  } catch (error) {
    return toServerActionFailure(error, "Unable to add the social link.");
  }
}

export async function updateSocial(
  id: number,
  input: SocialUpdate,
): Promise<ActionResult<Social>> {
  const parsed = socialSchema.partial().safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    const social = await fetchUpdateSocial(id, parsed.data);
    return { success: true, data: social };
  } catch (error) {
    return toServerActionFailure(error, "Unable to update the social link.");
  }
}

export async function deleteSocial(id: number): Promise<ActionResult<null>> {
  try {
    await fetchDeleteSocial(id);
    return { success: true, data: null };
  } catch (error) {
    return toServerActionFailure(error, "Unable to delete the social link.");
  }
}
