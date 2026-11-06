"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional icon rendered above the title. */
  icon?: ReactNode;
  /** Optional call to action rendered below the description. */
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  sx,
}: EmptyStateProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={[
        {
          px: 3,
          py: 6,
          textAlign: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {icon !== undefined && icon !== null ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            "& svg": { fontSize: 40 },
          }}
        >
          {icon}
        </Box>
      ) : null}
      <Typography
        variant="subtitle1"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        {title}
      </Typography>
      {description !== undefined && description !== null ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 420 }}
        >
          {description}
        </Typography>
      ) : null}
      {action !== undefined && action !== null ? (
        <Box sx={{ pt: 1 }}>{action}</Box>
      ) : null}
    </Stack>
  );
}
