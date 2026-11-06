"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface StatItem {
  label: string;
  value: number | null;
}

export interface ContentStatsProps {
  items: StatItem[];
}

export default function ContentStats({ items }: ContentStatsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(2, 1fr)" },
        gap: 2,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1.5,
            px: 2,
            py: 1.5,
            backgroundColor: "rgba(148, 163, 184, 0.04)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontFamily: '"Fira Code", monospace', fontWeight: 600 }}
          >
            {item.value ?? "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
