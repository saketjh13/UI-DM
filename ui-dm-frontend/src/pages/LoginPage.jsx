import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    teamID: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if ((formData.role === "responder" || formData.role === "admin") && !formData.teamID.trim()) {
      newErrors.teamID = `${formData.role === "admin" ? "Admin" : "Team"} ID is required`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    const payload = {
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role.toLowerCase(),
      ...(formData.role !== "citizen" && { teamID: formData.teamID.trim() }),
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Login failed. Please try again.");
        return;
      }

      const { token, role, name, email, teamID } = data;

      if (!token || !role || !name) {
        setServerError("Missing token, role, or name in server response.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          email: email || formData.email, // fallback to input if missing
          role: role.toLowerCase(),
          token,
          teamID: teamID || (formData.role !== "citizen" ? formData.teamID : null),
        })
      );

      window.dispatchEvent(new Event("storage"));

      switch (role.toLowerCase()) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "responder":
          navigate("/responder/dashboard");
          break;
        default:
          navigate("/citizen-dashboard");
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      setServerError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-orange-600 text-center mb-4">Login</h2>

        {serverError && <p className="text-red-500 text-center">{serverError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
            >
              <option value="">-- Select Role --</option>
              <option value="citizen">Citizen</option>
              <option value="responder">Responder</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>

          {(formData.role === "responder" || formData.role === "admin") && (
            <div>
              <label className="block text-gray-700">
                {formData.role === "admin" ? "Admin ID" : "Team ID"}
              </label>
              <input
                type="text"
                name="teamID"
                value={formData.teamID}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
              />
              {errors.teamID && <p className="text-red-500 text-sm">{errors.teamID}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
