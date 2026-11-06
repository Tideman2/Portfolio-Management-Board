"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { getProfile } from "@/app/actions/profile-actions";
import { getSkills } from "@/app/actions/skills-actions";
import { getSocials } from "@/app/actions/socials-actions";
import { getGroupedProjects } from "@/app/actions/projects-actions";
import {
  profileQueryKeys,
  projectQueryKeys,
  skillQueryKeys,
  socialQueryKeys,
} from "@/api/react-query-keys";
import DashboardCard from "@/components/DashboardCard";
import SectionHeading from "@/components/SectionHeading";
import ContentStats from "@/views/dashboard/Home/components/ContentStats";
import ProfileSummary from "@/views/dashboard/Home/components/ProfileSummary";
import QuickActions from "@/views/dashboard/Home/components/QuickActions";
import { PATHS } from "@/routes/paths";

import type { StatItem } from "@/views/dashboard/Home/components/ContentStats";

const STALE_TIME = 60_000;

export default function DashboardHomeView() {
  const profileQuery = useQuery({
    queryKey: profileQueryKeys.detail,
    queryFn: () => getProfile(),
    staleTime: STALE_TIME,
  });
  const socialsQuery = useQuery({
    queryKey: socialQueryKeys.list,
    queryFn: () => getSocials(),
    staleTime: STALE_TIME,
  });
  const professionalQuery = useQuery({
    queryKey: skillQueryKeys.list("professional"),
    queryFn: () => getSkills("professional"),
    staleTime: STALE_TIME,
  });
  const technicalQuery = useQuery({
    queryKey: skillQueryKeys.list("technical"),
    queryFn: () => getSkills("technical"),
    staleTime: STALE_TIME,
  });
  const projectsQuery = useQuery({
    queryKey: projectQueryKeys.grouped,
    queryFn: () => getGroupedProjects(),
    staleTime: STALE_TIME,
  });

  const sections = projectsQuery.data;
  const stats: StatItem[] = [
    {
      label: "Projects",
      value: sections === undefined
        ? null
        : sections.reduce((sum, section) => sum + section.projects.length, 0),
    },
    { label: "Groups", value: sections?.length ?? null },
    { label: "Social links", value: socialsQuery.data?.length ?? null },
    {
      label: "Skills",
      value:
        professionalQuery.data === undefined ||
        technicalQuery.data === undefined
          ? null
          : professionalQuery.data.length + technicalQuery.data.length,
    },
  ];

  return (
    <Stack spacing={3}>
      <SectionHeading
        title="Welcome back"
        subtitle="Everything shown on the public portfolio starts here."
        action={
          <Button
            component={Link}
            href={PATHS.dashboard.projects}
            variant="contained"
            color="success"
            endIcon={<OpenInNewOutlinedIcon />}
          >
            View projects
          </Button>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(0, 1fr)" },
          gap: 3,
        }}
      >
        <ProfileSummary
          profile={profileQuery.data ?? null}
          loading={profileQuery.isPending}
        />

        <DashboardCard
          title="Content"
          subtitle="What the public site is showing"
          icon={<InsightsOutlinedIcon />}
        >
          <ContentStats items={stats} />
        </DashboardCard>

        <Box sx={{ gridColumn: { lg: "1 / -1" } }}>
          <DashboardCard title="Quick actions" subtitle="Jump to an editor">
            <QuickActions />
          </DashboardCard>
        </Box>
      </Box>
    </Stack>
  );
}
