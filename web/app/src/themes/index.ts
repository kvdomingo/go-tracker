import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: ['"Rubik"', '"Segoe UI Variable"', "sans-serif"].join(", "),
  },
});

export default responsiveFontSizes(theme);
