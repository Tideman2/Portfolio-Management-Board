"use server";

import { projectSchema } from "@/api/projects/schemas";
import {
  createProject as fetchCreateProject,
  deleteProject as fetchDeleteProject,
  listGroupedProjects as fetchGroupedProjects,
  updateProject as fetchUpdateProject,
} from "@/api/projects/server-side";
import { toServerActionFailure } from "@/app/actions/action-failure";
import { toFieldErrors } from "@/utils/zod";

import type {
  ProjectGroupWithProjects,
  ProjectInput,
} from "@/api/projects/types";
import type { ActionResult } from "@/api/utils/action-result";

export async function getGroupedProjects(): Promise<
  ProjectGroupWithProjects[]
> {
  return fetchGroupedProjects();
}

export async function createProject(
  input: ProjectInput,
): Promise<ActionResult<null>> {
  const parsed = projectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    await fetchCreateProject(parsed.data);
    return { success: true, data: null };
  } catch (error) {
    return toServerActionFailure(error, "Unable to create the project.");
  }
}

export async function updateProject(
  id: number,
  input: ProjectInput,
): Promise<ActionResult<null>> {
  const parsed = projectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    await fetchUpdateProject(id, parsed.data);
    return { success: true, data: null };
  } catch (error) {
    return toServerActionFailure(error, "Unable to update the project.");
  }
}

export async function deleteProject(id: number): Promise<ActionResult<null>> {
  try {
    await fetchDeleteProject(id);
    return { success: true, data: null };
  } catch (error) {
    return toServerActionFailure(error, "Unable to delete the project.");
  }
}
