export type SkillKind = "professional" | "technical";

export type Skill = {
  id: number;
  name: string;
  description: string;
  /** Integer 1–5. */
  proficiency: number;
};

export type SkillInput = {
  name: string;
  description: string;
  proficiency: number;
};

export type SkillUpdate = Partial<SkillInput>;
