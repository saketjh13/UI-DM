import { useState } from "react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
    aadharNumber: "",
    employeeID: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      alert("Email is required");
      return;
    }

    const submissionData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      aadharNumber: formData.role === "citizen" ? formData.aadharNumber : undefined,
      employeeID: formData.role !== "citizen" ? formData.employeeID : undefined,
    };

    console.log("Submitting signup request:", submissionData); // Debugging

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      console.log("Signup Response:", data);

      if (res.ok) {
        alert("Signup Successful!");
      } else {
        alert("Signup Failed: " + data.msg);
      }
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="citizen">Citizen</option>
          <option value="responder">Responder</option>
          <option value="admin">Admin</option>
        </select>

        {formData.role === "citizen" ? (
          <input
            type="text"
            name="aadharNumber"
            placeholder="Aadhar Number"
            value={formData.aadharNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
        ) : (
          <input
            type="text"
            name="employeeID"
            placeholder="Employee ID"
            value={formData.employeeID}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
