import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SWRConfig } from "swr";
import swrConfig from "./lib/swrConfig";
import AuthProvider from "./contexts/AuthContext";
import { CssBaseline } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        <CssBaseline />
        <App />
      </AuthProvider>
    </SWRConfig>
  </React.StrictMode>
);
