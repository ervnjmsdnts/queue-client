import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SWRConfig } from "swr";
import swrConfig from "./lib/swrConfig";
import AuthProvider from "./contexts/AuthContext";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SWRConfig value={swrConfig}>
      <BrowserRouter>
        <AuthProvider>
          <CssBaseline />
          <App />
          <ToastContainer position="top-right" newestOnTop theme="colored" />
        </AuthProvider>
      </BrowserRouter>
    </SWRConfig>
  </React.StrictMode>
);
