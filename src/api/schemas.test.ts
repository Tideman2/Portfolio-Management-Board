import { describe, expect, it } from "vitest";

import { profileUpdateSchema } from "@/api/profile/schemas";
import { projectGroupSchema } from "@/api/project-groups/schemas";
import { projectSchema } from "@/api/projects/schemas";
import { skillSchema } from "@/api/skills/schemas";
import { socialSchema } from "@/api/socials/schemas";

const validProject = {
  title: "Portfolio site",
  stack: "Next.js, MUI",
  goal: "Show selected work to clients.",
  github_url: "https://github.com/roland/portfolio",
  demo_url: "https://roland.dev",
  group_id: 1,
};

describe("socialSchema", () => {
  it("trims values and accepts https URLs", () => {
    const parsed = socialSchema.parse({
      platform_name: "  GitHub  ",
      url: "  https://github.com/roland  ",
    });

    expect(parsed).toEqual({
      platform_name: "GitHub",
      url: "https://github.com/roland",
    });
  });

  it("requires the platform name", () => {
    expect(
      socialSchema.safeParse({ platform_name: "   ", url: "https://x.dev" })
        .success,
    ).toBe(false);
  });

  it("rejects non-http protocols", () => {
    const result = socialSchema.safeParse({
      platform_name: "GitHub",
      url: "javascript:alert(1)",
    });

    expect(result.success).toBe(false);
  });
});

describe("skillSchema", () => {
  it("accepts proficiency from 1 to 5", () => {
    expect(
      skillSchema.safeParse({
        name: "TypeScript",
        description: "Typed JavaScript.",
        proficiency: 5,
      }).success,
    ).toBe(true);
  });

  it.each([0, 6, 2.5])("rejects proficiency %s", (proficiency) => {
    expect(
      skillSchema.safeParse({
        name: "TypeScript",
        description: "Typed JavaScript.",
        proficiency,
      }).success,
    ).toBe(false);
  });
});

describe("profileUpdateSchema", () => {
  it("drops empty strings instead of sending them", () => {
    const parsed = profileUpdateSchema.parse({
      name: "  ",
      country: "",
      bio: "  ",
    });

    expect(parsed).toEqual({
      name: undefined,
      country: undefined,
      bio: undefined,
    });
  });

  it("rejects impossible calendar dates", () => {
    expect(
      profileUpdateSchema.safeParse({ date_of_birth: "2026-02-31" }).success,
    ).toBe(false);
  });

  it("accepts a real date", () => {
    expect(
      profileUpdateSchema.safeParse({ date_of_birth: "1998-02-28" }).success,
    ).toBe(true);
  });

  it("rejects a bio over 2000 characters", () => {
    expect(
      profileUpdateSchema.safeParse({ bio: "x".repeat(2001) }).success,
    ).toBe(false);
  });
});

describe("projectGroupSchema", () => {
  it("trims and accepts a name", () => {
    expect(projectGroupSchema.parse({ name: "  Full stack  " })).toEqual({
      name: "Full stack",
    });
  });

  it("rejects an empty name", () => {
    expect(projectGroupSchema.safeParse({ name: " " }).success).toBe(false);
  });
});

describe("projectSchema", () => {
  it("accepts a valid project without an image", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it("requires a group", () => {
    const { title, stack, goal, github_url, demo_url } = validProject;

    expect(
      projectSchema.safeParse({
        title,
        stack,
        goal,
        github_url,
        demo_url,
      }).success,
    ).toBe(false);
  });

  it.each(["github_url", "demo_url"] as const)(
    "rejects a non-http %s",
    (field) => {
      expect(
        projectSchema.safeParse({
          ...validProject,
          [field]: "javascript:alert(1)",
        }).success,
      ).toBe(false);
    },
  );

  it("rejects a title over 150 characters", () => {
    expect(
      projectSchema.safeParse({
        ...validProject,
        title: "x".repeat(151),
      }).success,
    ).toBe(false);
  });
});
