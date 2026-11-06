"use server";

import { projectGroupSchema } from "@/api/project-groups/schemas";
import {
  createProjectGroup as fetchCreateGroup,
  deleteProjectGroup as fetchDeleteGroup,
  listProjectGroups as fetchListGroups,
  updateProjectGroup as fetchUpdateGroup,
} from "@/api/project-groups/server-side";
import { toServerActionFailure } from "@/app/actions/action-failure";
import { toFieldErrors } from "@/utils/zod";

import type {
  ProjectGroup,
  ProjectGroupInput,
} from "@/api/project-groups/types";
import type { ActionResult } from "@/api/utils/action-result";

export async function getProjectGroups(): Promise<ProjectGroup[]> {
  return fetchListGroups();
}

export async function createProjectGroup(
  input: ProjectGroupInput,
): Promise<ActionResult<ProjectGroup>> {
  const parsed = projectGroupSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    const group = await fetchCreateGroup(parsed.data);
    return { success: true, data: group };
  } catch (error) {
    return toServerActionFailure(error, "Unable to create the group.");
  }
}

export async function updateProjectGroup(
  id: number,
  input: ProjectGroupInput,
): Promise<ActionResult<ProjectGroup>> {
  const parsed = projectGroupSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    const group = await fetchUpdateGroup(id, parsed.data);
    return { success: true, data: group };
  } catch (error) {
    return toServerActionFailure(error, "Unable to rename the group.");
  }
}

export async function deleteProjectGroup(
  id: number,
): Promise<ActionResult<null>> {
  try {
    await fetchDeleteGroup(id);
    return { success: true, data: null };
  } catch (error) {
    return toServerActionFailure(
      error,
      "Unable to delete the group. Move its projects first.",
    );
  }
}
