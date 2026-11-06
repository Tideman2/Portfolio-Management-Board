"use client";

import Link from "next/link";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { PATHS } from "@/routes/paths";

const ACTIONS = [
  { label: "Profile", href: PATHS.dashboard.profile, icon: <PersonOutlineIcon /> },
  { label: "Social links", href: PATHS.dashboard.socials, icon: <ShareOutlinedIcon /> },
  { label: "Skills", href: PATHS.dashboard.skills, icon: <PsychologyOutlinedIcon /> },
  { label: "Project groups", href: PATHS.dashboard.projectGroups, icon: <FolderOutlinedIcon /> },
  { label: "Projects", href: PATHS.dashboard.projects, icon: <WorkOutlineIcon /> },
] as const;

export default function QuickActions() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 1.5,
      }}
    >
      {ACTIONS.map((action) => (
        <Button
          key={action.href}
          component={Link}
          href={action.href}
          variant="outlined"
          startIcon={action.icon}
          sx={{ justifyContent: "flex-start" }}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
}
