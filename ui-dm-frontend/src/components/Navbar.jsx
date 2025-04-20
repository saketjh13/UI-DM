import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <Link
            to="/signup"
            className="text-orange-600 border px-4 py-1 rounded border-orange-400 hover:bg-orange-100"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="text-orange-600 border px-4 py-1 rounded border-orange-400 hover:bg-orange-100"
          >
            Login
          </Link>
        </>
      );
    }

    const role = user.role?.toLowerCase();

    const commonLinks = (
      <>
        <span className="text-gray-700 font-semibold">
          Welcome, {user.name?.split(" ")[0]}!
        </span>
      </>
    );

    const roleLinks = {
      citizen: (
        <>
          <Link
            to="/citizen-dashboard"
            className="text-orange-600 border px-4 py-1 rounded border-orange-400 hover:bg-orange-100"
          >
            Dashboard
          </Link>
          <Link
            to="/my-reports"
            className="text-orange-600 border px-4 py-1 rounded border-orange-400 hover:bg-orange-100"
          >
            My Reports
          </Link>
          <Link
            to="/report-disaster"
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition duration-200"
          >
            Report Disaster
          </Link>
        </>
      ),
      admin: (
        <>
          <Link
            to="/events"
            className="text-orange-600 border px-4 py-1 rounded border-orange-400 hover:bg-orange-100"
          >
            Events
          </Link>
          <Link
            to="/teams"
            className="text-orange-600 border px-4 py-1 rounded border-orange-400 hover:bg-orange-100"
          >
            Teams
          </Link>
        </>
      ),
      responder: (
        <>
          <Link
            to="/responder/dashboard"
            className="text-orange-600 border px-4 py-1 rounded border-orange-400 hover:bg-orange-100"
          >
            Dashboard
          </Link>
          <Link
            to="/responder/tasks"
            className="text-orange-600 border px-4 py-1 rounded border-orange-400 hover:bg-orange-100"
          >
            My Tasks
          </Link>
        </>
      ),
    };

    return (
      <>
        {commonLinks}
        {roleLinks[role]}
        <button
          onClick={handleLogout}
          className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition duration-200"
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md border-b-2 border-gray-300 px-6 flex justify-between items-center z-50">
      <Link to="/" className="text-xl font-bold text-orange-600">UI-DM</Link>
      <div className="flex gap-4 items-center">{renderLinks()}</div>
    </nav>
  );
};

export default Navbar;
