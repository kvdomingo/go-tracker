import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/rubik/300.css";
import "@fontsource/rubik/400.css";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/700.css";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";

import App from "./App";
import "./index.css";
import TrackerProvider from "./providers/TrackerProvider";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TrackerProvider>
          <App />
        </TrackerProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
