// UserContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

// Create the User Context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || ""); // Default value is empty string if role is not found in localStorage

  // You could also check localStorage for user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const loginUser = (userData, role) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", role); // Save user role to localStorage
    setUser(userData);
    setUserRole(role);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    setUser(null);
    setUserRole("");
  };

  return (
    <UserContext.Provider value={{ user, userRole, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming context
export const useUser = () => useContext(UserContext);
