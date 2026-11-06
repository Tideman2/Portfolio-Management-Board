"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useAuthSession } from "@/contexts/authSession/hooks";
import ContentWrapper from "@/layout/components/ContentWrapper";
import Sidebar from "@/layout/components/dashboard/Sidebar";
import Topbar from "@/layout/components/dashboard/Topbar";
import { PATHS } from "@/routes/paths";

import type { ReactNode } from "react";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading, error, unauthenticated, checkUserSession } =
    useAuthSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (unauthenticated) {
      router.replace(PATHS.auth.login);
    }
  }, [unauthenticated, router]);

  if (error !== null) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <EmptyState
          title="Unable to load your session"
          description={error}
          action={
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                void checkUserSession();
              }}
            >
              Retry
            </Button>
          }
        />
      </Box>
    );
  }

  if (loading || user === null) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingState
          label={
            unauthenticated ? "Redirecting to sign in…" : "Loading session…"
          }
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <ContentWrapper>{children}</ContentWrapper>
      </Box>
    </Box>
  );
}
