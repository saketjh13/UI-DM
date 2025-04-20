import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Menu,
  X,
  ClipboardList,
  AlertCircle,
  Package,
  Home,
  CalendarCheck,
  Users,
  Boxes
} from "lucide-react";

const Sidebar = () => {
  const [alerts, setAlerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role?.toLowerCase());
    }
  }, []);

  useEffect(() => {
    if (!["responder", "admin"].includes(role)) return;
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, [role]);

  if (role === "citizen") return null;

  const navItems = role === "responder"
    ? [
        { to: "/responder/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
        { to: "/responder/tasks", label: "My Tasks", icon: <ClipboardList className="w-4 h-4" /> },
        { to: "/responder/alerts", label: "Assigned Alerts", icon: <AlertCircle className="w-4 h-4" /> },
        { to: "/responder/resources", label: "Resources", icon: <Package className="w-4 h-4" /> },
      ]
    : [
        { to: "/events", label: "Events", icon: <CalendarCheck className="w-4 h-4" /> },
        { to: "/tasks", label: "Tasks", icon: <ClipboardList className="w-4 h-4" /> },
        { to: "/teams", label: "Teams", icon: <Users className="w-4 h-4" /> },
        { to: "/resources", label: "Resources", icon: <Boxes className="w-4 h-4" /> },
        // { to: "/alerts", label: "Alerts", icon: <Bell className="w-4 h-4" /> },
      ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white bg-orange-600 rounded-md md:hidden fixed top-4 left-4 z-50"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 w-64 h-screen bg-white text-orange-900 p-4 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-60 md:block shadow-lg border-r border-orange-300`}
      >
        <nav className="space-y-4">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-orange-200 ${
                location.pathname === to ? "bg-orange-100 font-semibold" : ""
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>

        {/* Alerts Preview */}
        {(role === "responder" || role === "admin") && (
          <div className="mt-6 border-t border-orange-300 pt-4">
            <Link
              to="/alerts"
              className="flex items-center justify-between py-2 px-4 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              <span className="flex items-center">
                <Bell className="mr-2" /> Alerts
              </span>
              {alerts.length > 0 && (
                <span className="bg-white text-orange-600 px-2 py-1 rounded-full text-sm font-bold">
                  {alerts.length}
                </span>
              )}
            </Link>

            {alerts.length === 0 ? (
              <p className="text-orange-500 mt-2">No active alerts.</p>
            ) : (
              <ul className="space-y-2 mt-2">
                {alerts.slice(0, 3).map((alert) => (
                  <li key={alert._id} className="p-2 bg-orange-100 rounded">
                    <p className="text-sm font-medium text-orange-800">{alert.disasterType}</p>
                    <p className="text-xs text-orange-600 truncate">{alert.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
