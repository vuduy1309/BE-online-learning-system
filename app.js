import express from "express";
import cors from "cors";
import { config } from "dotenv";
import http from "http";
import { Server } from "socket.io";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api", chatRoutes);
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ chatRoomId }) => {
    socket.join(`room_${chatRoomId}`);
  });

socket.on("sendMessage", async ({ chatRoomId, senderId, content, imageUrl }) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO messages (ChatRoomID, SenderID, Content, ImageURL) VALUES (?, ?, ?, ?)`,
      [chatRoomId, senderId, content, imageUrl || null]
    );
    const messageId = result.insertId;

    const [[user]] = await pool.query(
      `SELECT FullName FROM users WHERE UserID = ?`,
      [senderId]
    );

    const [[message]] = await pool.query(
      `SELECT MessageID, SenderID, Content, ImageURL, SentAt FROM messages WHERE MessageID = ?`,
      [messageId]
    );

    io.to(`room_${chatRoomId}`).emit("receiveMessage", {
      chatRoomId,
      MessageID: message.MessageID,
      senderId: message.SenderID,
      FullName: user ? user.FullName : "Ẩn danh",
      content: message.Content,
      imageUrl: message.ImageURL,
      sentAt: message.SentAt
    });
  } catch (err) {
    socket.emit("error", { message: "Send message failed" });
  }
});
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));