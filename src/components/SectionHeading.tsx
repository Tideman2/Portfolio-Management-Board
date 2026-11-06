"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

export interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional content aligned to the right on larger screens. */
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function SectionHeading({
  title,
  subtitle,
  action,
  sx,
}: SectionHeadingProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      sx={[
        {
          width: "100%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
          {title}
        </Typography>
        {subtitle !== undefined && subtitle !== null ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {action !== undefined && action !== null ? (
        <Box sx={{ flexShrink: 0 }}>{action}</Box>
      ) : null}
    </Stack>
  );
}
