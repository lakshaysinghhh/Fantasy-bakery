import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "lakshaysingh433433@gmail.com";

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 👇 auto admin
    const isAdmin = email === ADMIN_EMAIL;

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
    });

    console.log(isAdmin ? "👑 Admin Registered:" : "🙂 User Registered:", email);

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

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {

      // 👇 force admin if email matches
      if (email === ADMIN_EMAIL && !user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }

      console.log(
        user.isAdmin
          ? `👑 Admin Logged In: ${email}`
          : `🙂 User Logged In: ${email}`
      );

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
  console.log("🔓 User Logged Out");
  res.json({ message: "Logged out successfully" });
};