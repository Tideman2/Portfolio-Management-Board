"use server";

import { profileUpdateSchema } from "@/api/profile/schemas";
import {
  getProfile as fetchProfile,
  updateProfile as fetchUpdateProfile,
} from "@/api/profile/server-side";
import { toServerActionFailure } from "@/app/actions/action-failure";
import { toFieldErrors } from "@/utils/zod";

import type { Profile, ProfileUpdate } from "@/api/profile/types";
import type { ActionResult } from "@/api/utils/action-result";

export async function getProfile(): Promise<Profile | null> {
  return fetchProfile();
}

export async function saveProfile(
  input: ProfileUpdate,
): Promise<ActionResult<Profile>> {
  const parsed = profileUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  if (Object.values(parsed.data).every((value) => value === undefined)) {
    return { success: false, error: "Change at least one field to save." };
  }

  try {
    const profile = await fetchUpdateProfile(parsed.data);
    return { success: true, data: profile };
  } catch (error) {
    return toServerActionFailure(error, "Unable to save the profile.");
  }
}
