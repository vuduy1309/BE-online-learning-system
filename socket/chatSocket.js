import pool from "../config/db.js";

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ chatRoomId }) => {
      socket.join(`room_${chatRoomId}`);
    });

    socket.on(
      "sendMessage",
      async ({ chatRoomId, senderId, content, imageUrl }) => {
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
            sentAt: message.SentAt,
          });
        } catch (err) {
          socket.emit("error", { message: "Send message failed" });
        }
      }
    );
  });
}
