import Box from "@mui/material/Box";

import type { ReactNode } from "react";

export default function ContentWrapper({ children }: { children: ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {children}
    </Box>
  );
}
