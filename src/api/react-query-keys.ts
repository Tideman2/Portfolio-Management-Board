import type { SkillKind } from "@/api/skills/types";

/**
 * All React Query cache keys live here. Feature keys are added next to their
 * domain as the admin screens are built.
 */
export const authQueryKeys = {
  session: ["auth", "session"] as const,
};

export const profileQueryKeys = {
  all: ["profile"] as const,
  detail: ["profile", "detail"] as const,
};

export const socialQueryKeys = {
  all: ["socials"] as const,
  list: ["socials", "list"] as const,
};

export const skillQueryKeys = {
  all: ["skills"] as const,
  list: (kind: SkillKind) => ["skills", kind] as const,
};

export const projectGroupQueryKeys = {
  all: ["project-groups"] as const,
  list: ["project-groups", "list"] as const,
};

export const projectQueryKeys = {
  all: ["projects"] as const,
  grouped: ["projects", "grouped"] as const,
};
