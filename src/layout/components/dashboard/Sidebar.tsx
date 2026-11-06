"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { PATHS } from "@/routes/paths";

import type { ReactNode } from "react";

const DRAWER_WIDTH = 260;

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Dashboard",
    href: PATHS.dashboard.root,
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "Profile",
    href: PATHS.dashboard.profile,
    icon: <PersonOutlineIcon />,
  },
  {
    label: "Social links",
    href: PATHS.dashboard.socials,
    icon: <ShareOutlinedIcon />,
  },
  {
    label: "Skills",
    href: PATHS.dashboard.skills,
    icon: <PsychologyOutlinedIcon />,
  },
  {
    label: "Project groups",
    href: PATHS.dashboard.projectGroups,
    icon: <FolderOutlinedIcon />,
  },
  {
    label: "Projects",
    href: PATHS.dashboard.projects,
    icon: <WorkOutlineIcon />,
  },
];

const isActiveRoute = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          Portfolio
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.5,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Admin console
        </Typography>
      </Box>

      <List sx={{ px: 1.5, py: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.href);

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              onClick={onNavigate}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(34, 197, 94, 0.12)",
                  color: "success.main",
                  "& .MuiListItemIcon-root": {
                    color: "success.main",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(34, 197, 94, 0.18)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontWeight: active ? 600 : 500 } }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>
    </>
  );
}
