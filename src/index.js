import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/Master.css";
import AllRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AllRoutes />
    </AuthProvider>
  </React.StrictMode>,
);
