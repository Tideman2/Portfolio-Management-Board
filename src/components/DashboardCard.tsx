"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

export interface DashboardCardProps {
  /** Card heading. Rendered with the theme's heading font. */
  title?: ReactNode;
  /** Optional supporting text below the title. */
  subtitle?: ReactNode;
  /** Optional content aligned to the right of the header. */
  action?: ReactNode;
  /** Optional icon shown before the title. */
  icon?: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

export default function DashboardCard({
  title,
  subtitle,
  action,
  icon,
  children,
  sx,
  contentSx,
}: DashboardCardProps) {
  const hasTitle = title !== undefined && title !== null;
  const hasSubtitle = subtitle !== undefined && subtitle !== null;
  const hasHeader = hasTitle || hasSubtitle || action !== undefined || icon !== undefined;

  return (
    <Card
      elevation={0}
      sx={[
        {
          backgroundColor: "background.paper",
          backgroundImage: "none",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {hasHeader ? (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ px: 3, pt: 3 }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ minWidth: 0 }}
          >
            {icon !== undefined && icon !== null ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "success.main",
                  mt: 0.25,
                }}
              >
                {icon}
              </Box>
            ) : null}
            {hasTitle || hasSubtitle ? (
              <Box sx={{ minWidth: 0 }}>
                {hasTitle ? (
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, lineHeight: 1.3 }}
                  >
                    {title}
                  </Typography>
                ) : null}
                {hasSubtitle ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {subtitle}
                  </Typography>
                ) : null}
              </Box>
            ) : null}
          </Stack>
          {action !== undefined && action !== null ? (
            <Box sx={{ flexShrink: 0 }}>{action}</Box>
          ) : null}
        </Stack>
      ) : null}
      <CardContent
        sx={[
          {
            p: 3,
            pt: hasHeader ? 2 : 3,
            "&:last-child": {
              pb: 3,
            },
          },
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        {children}
      </CardContent>
    </Card>
  );
}
