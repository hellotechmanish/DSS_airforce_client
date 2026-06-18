import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./assets/css/Master.css";
import AllRoutes from "./Routes";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Explicitly designated alignment viewport profile set to bottom-right */}
    <Toaster position="bottom-right" reverseOrder={false} />
    <AllRoutes />
  </React.StrictMode>,
);
