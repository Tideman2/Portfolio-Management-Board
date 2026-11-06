import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#22C55E",
      dark: "#16A34A",
      light: "#4ADE80",
      contrastText: "#0F172A",
    },
    secondary: {
      main: "#334155",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#22C55E",
      contrastText: "#0F172A",
    },
    error: {
      main: "#EF4444",
    },
    background: {
      default: "#020617",
      paper: "#0E1223",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
    },
    divider: "#334155",
  },
  typography: {
    fontFamily: `"Fira Sans", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    h1: { fontFamily: `"Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace` },
    h2: { fontFamily: `"Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace` },
    h3: { fontFamily: `"Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace` },
    h4: { fontFamily: `"Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace` },
    h5: { fontFamily: `"Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace` },
    h6: { fontFamily: `"Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace` },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
