import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL_1 || "lakshaysingh433433@gmail.com",
  process.env.ADMIN_EMAIL_2 || "adminadmin433@gmail.com"
];

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 👇 auto admin
    const isAdmin = ADMIN_EMAILS.includes(email);

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,

      // 🔥 message added
      message: isAdmin
        ? "Welcome Admin 👑"
        : "Welcome User 🙂",

      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {

      // 👇 force admin if email matches
      if (ADMIN_EMAILS.includes(email) && !user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,

        // 🔥 message added
        message: user.isAdmin
          ? "Welcome Admin 👑"
          : "Welcome User 🙂",

        token: generateToken(user._id),
      });

    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGOUT
export const logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};