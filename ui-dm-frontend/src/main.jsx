import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext"; // ✅ Import AuthProvider
import "./index.css"; // Ensure Tailwind is applied

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider> {/* ✅ Wrap App inside AuthProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
