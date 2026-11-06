"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

export interface LoadingStateProps {
  /** Optional muted label shown below the spinner. */
  label?: string;
  minHeight?: number | string;
  size?: number;
  sx?: SxProps<Theme>;
}

export default function LoadingState({
  label,
  minHeight = 160,
  size = 32,
  sx,
}: LoadingStateProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      role="status"
      aria-live="polite"
      sx={[
        {
          width: "100%",
          minHeight,
          py: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CircularProgress
          size={size}
          color="success"
          aria-label={label ?? "Loading"}
        />
      </Box>
      {label !== undefined ? (
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      ) : null}
    </Stack>
  );
}
