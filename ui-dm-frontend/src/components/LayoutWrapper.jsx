import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const LayoutWrapper = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role?.toLowerCase());
  }, []);

  const shouldShowSidebar = role && role !== "citizen";

  return (
    <div className="flex">
      {shouldShowSidebar && <Sidebar />}
      <main className={`w-full ${shouldShowSidebar ? "md:ml-64" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default LayoutWrapper;
