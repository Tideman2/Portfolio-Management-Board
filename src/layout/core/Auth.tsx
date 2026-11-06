"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ReactNode } from "react";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.08), transparent 45%)",
      }}
    >
      <Stack spacing={3} sx={{ width: "100%", maxWidth: 440 }}>
        <Stack spacing={0.5} alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Portfolio Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Content console
          </Typography>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderColor: "divider",
            backgroundColor: "background.paper",
            backgroundImage: "none",
          }}
        >
          {children}
        </Paper>

        <Typography variant="caption" color="text.secondary" textAlign="center">
          Authorized administrator only
        </Typography>
      </Stack>
    </Box>
  );
}
