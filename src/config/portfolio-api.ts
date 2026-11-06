export const portfolioApi = {
  profile: "/me",
  socials: "/me/socials",
  social: (id: number) => `/me/socials/${id}`,
  professionalSkills: "/me/professional-skills",
  professionalSkill: (id: number) => `/me/professional-skills/${id}`,
  technicalSkills: "/me/technical-skills",
  technicalSkill: (id: number) => `/me/technical-skills/${id}`,
  projectGroups: "/api/project-groups",
  projectGroup: (id: number) => `/api/project-groups/${id}`,
  /** The collection endpoint requires the trailing slash. */
  projects: "/api/projects/",
  project: (id: number) => `/api/projects/${id}`,
} as const;
