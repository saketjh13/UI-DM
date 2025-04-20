import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, role, password, aadharNumber, employeeID } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    if (role === "citizen" && !aadharNumber) {
      return res.status(400).json({ msg: "Aadhar number is required for citizens" });
    }

    if (role !== "citizen" && !employeeID) {
      return res.status(400).json({ msg: "Employee ID is required for responders and admins" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
      aadharNumber: role === "citizen" ? aadharNumber : undefined,
      employeeID: role !== "citizen" ? employeeID : undefined,
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    const user = await User.findOne({
      email,
      role: { $regex: new RegExp("^" + role + "$", "i") },
    });

    if (!user) return res.status(400).json({ message: "User not found. Check email or role." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ⬇️ Include employeeID if user is not a citizen
    res.status(200).json({
      message: "Login successful",
      token,
      name: user.name,
      role: user.role,
      employeeID: user.role !== "citizen" ? user.employeeID : undefined,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get User Info from Token
export const getUser = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
