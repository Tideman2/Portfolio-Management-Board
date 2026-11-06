"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

export interface DetailRowProps {
  label: ReactNode;
  value: ReactNode;
  sx?: SxProps<Theme>;
}

export default function DetailRow({ label, value, sx }: DetailRowProps) {
  return (
    <Box
      component="dl"
      sx={[
        {
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          alignItems: "baseline",
          gap: 2,
          m: 0,
          py: 1.25,
          borderBottom: 1,
          borderColor: "divider",
          "&:last-of-type": {
            borderBottom: 0,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component="dt"
        sx={{
          minWidth: 0,
          m: 0,
          color: "text.secondary",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </Box>
      <Box
        component="dd"
        sx={{
          minWidth: 0,
          m: 0,
          color: "text.primary",
          fontSize: "0.875rem",
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Box>
    </Box>
  );
}
