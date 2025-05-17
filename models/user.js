import { query } from "../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await query("SELECT * FROM Users WHERE Email = ?", [
    email,
  ]);
  return rows[0];
}

export async function createUser(email, hashedPassword, fullName) {
  const [result] = await query(
    "INSERT INTO Users (Email, PasswordHash, FullName) VALUES (?, ?, ?)",
    [email, hashedPassword, fullName]
  );
  return result.insertId;
}

export async function findUserById(id) {
  const [rows] = await query("SELECT * FROM Users WHERE UserID = ?", [id]);
  return rows[0];
}
