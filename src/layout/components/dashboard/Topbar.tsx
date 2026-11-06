"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { logout } from "@/app/actions/auth-actions";
import { useAuthSession } from "@/contexts/authSession/hooks";
import { PATHS } from "@/routes/paths";

const PAGE_TITLES: readonly { path: string; title: string }[] = [
  { path: PATHS.dashboard.profile, title: "Profile" },
  { path: PATHS.dashboard.socials, title: "Social links" },
  { path: PATHS.dashboard.skills, title: "Skills" },
  { path: PATHS.dashboard.projectGroups, title: "Project groups" },
  { path: PATHS.dashboard.projects, title: "Projects" },
  { path: PATHS.dashboard.root, title: "Dashboard" },
];

const getPageTitle = (pathname: string): string =>
  PAGE_TITLES.find(
    (entry) =>
      pathname === entry.path || pathname.startsWith(`${entry.path}/`),
  )?.title ?? "Dashboard";

export type TopbarProps = {
  onOpenMenu: () => void;
};

export default function Topbar({ onOpenMenu }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthSession();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);

    try {
      await logout();
    } finally {
      router.replace(PATHS.auth.login);
      router.refresh();
      setPending(false);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <IconButton
          edge="start"
          aria-label="Open navigation"
          onClick={onOpenMenu}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}
        >
          {getPageTitle(pathname)}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              textAlign: "right",
            }}
          >
            <Typography variant="body2" noWrap>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>

          <Tooltip title="Sign out">
            <span>
              <IconButton
                aria-label="Sign out"
                disabled={pending}
                onClick={() => {
                  void handleLogout();
                }}
              >
                {pending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LogoutOutlinedIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
