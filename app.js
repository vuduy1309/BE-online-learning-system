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
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";
config();

const app = express();

app.use(cors());
app.use(express.json());
app.post("/api/vnpay/create-qr", async (req, res) => {
  const { cartId } = req.body;
  try {
    // Lấy thông tin cart từ database
    const [[findCart]] = await pool.query(
      `SELECT * FROM carts WHERE CartID = ?`,
      [cartId]
    );
    if (!findCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const vnpay = new VNPay({
      tmnCode: "CHOECU21",
      secureSecret: "6KMM18JSCQI1BE63KD9TK0FOJGFRICS1",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      logger: ignoreLogger,
    });

    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: findCart.TotalPrice,
      vnp_IpAddr: "127.0.0.1",
      vnp_TxnRef: findCart.CartID,
      vnp_OrderInfo: `${findCart.CartID}`,
      vnpay_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `http://localhost:8080/api/vnpay/return`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date(), "YYYYMMDDHHmmss"),
      vnp_ExpireDate: dateFormat(
        new Date(Date.now() + 24 * 60 * 60 * 1000),
        "YYYYMMDDHHmmss"
      ),
    });

    return res.status(201).json(vnpayResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
