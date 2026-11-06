"use server";

import { skillSchema } from "@/api/skills/schemas";
import {
  createSkill as fetchCreateSkill,
  deleteSkill as fetchDeleteSkill,
  listSkills as fetchListSkills,
  updateSkill as fetchUpdateSkill,
} from "@/api/skills/server-side";
import { toServerActionFailure } from "@/app/actions/action-failure";
import { toFieldErrors } from "@/utils/zod";

import type {
  Skill,
  SkillInput,
  SkillKind,
  SkillUpdate,
} from "@/api/skills/types";
import type { ActionResult } from "@/api/utils/action-result";

const isSkillKind = (value: string): value is SkillKind =>
  value === "professional" || value === "technical";

export async function getSkills(kind: SkillKind): Promise<Skill[]> {
  if (!isSkillKind(kind)) {
    throw new Error("Unknown skill kind.");
  }

  return fetchListSkills(kind);
}

export async function createSkill(
  kind: SkillKind,
  input: SkillInput,
): Promise<ActionResult<Skill>> {
  const parsed = skillSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    const skill = await fetchCreateSkill(kind, parsed.data);
    return { success: true, data: skill };
  } catch (error) {
    return toServerActionFailure(error, "Unable to add the skill.");
  }
}

export async function updateSkill(
  kind: SkillKind,
  id: number,
  input: SkillUpdate,
): Promise<ActionResult<Skill>> {
  const parsed = skillSchema.partial().safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    const skill = await fetchUpdateSkill(kind, id, parsed.data);
    return { success: true, data: skill };
  } catch (error) {
    return toServerActionFailure(error, "Unable to update the skill.");
  }
}

export async function deleteSkill(
  kind: SkillKind,
  id: number,
): Promise<ActionResult<null>> {
  try {
    await fetchDeleteSkill(kind, id);
    return { success: true, data: null };
  } catch (error) {
    return toServerActionFailure(error, "Unable to delete the skill.");
  }
}
