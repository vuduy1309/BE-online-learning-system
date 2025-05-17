import { hash, compare } from "bcryptjs";
import * as user from "../models/user.js";

import jwt from 'jsonwebtoken';
const { sign } = jwt;

export async function register(req, res) {
  const { email, password, fullName } = req.body;

  try {
    const existingUser = await user.findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await hash(password, 10);
    await user.createUser(email, hashed, fullName);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await user.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await compare(password, user.PasswordHash);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = sign(
      { id: user.UserID, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.UserID, email: user.Email, fullName: user.FullName },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
