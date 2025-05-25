import { hash, compare } from "bcryptjs";
import * as userModel from "../models/user.js";
import { findUserByEmail, getUserRole } from "../models/user.js";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
const { sign } = jwt;

export async function register(req, res) {
  const { email, password, fullName } = req.body;

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await hash(password, 10);
    await userModel.createUser(email, hashed, fullName);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT UserID, FullName, Email FROM users`
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error); // Log chi tiết lỗi trên server
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message, // Gửi thông báo lỗi cụ thể
    });
  }
};


export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const foundUser = await findUserByEmail(email);
    if (!foundUser)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await compare(password, foundUser.PasswordHash);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const roleId = await getUserRole(foundUser.UserID);

    const token = sign(
      {
        id: foundUser.UserID,
        email: foundUser.Email,
        role: roleId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: foundUser.UserID,
        email: foundUser.Email,
        fullName: foundUser.FullName,
        roleId,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
