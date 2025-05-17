import { hash, compare } from "bcryptjs";
import * as userModel from "../models/user.js";

import jwt from 'jsonwebtoken';
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

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const foundUser = await userModel.findUserByEmail(email);
    if (!foundUser)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await compare(password, foundUser.PasswordHash);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = sign(
      { id: foundUser.UserID, email: foundUser.Email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: foundUser.UserID,
        email: foundUser.Email,
        fullName: foundUser.FullName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { Title, Description, Price, ImageURL } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE courses SET Title = ?, Description = ?, Price = ?, ImageURL = ? WHERE CourseID = ?`,
      [Title, Description, Price, ImageURL, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update course" });
  }
};
