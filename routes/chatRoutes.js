import express from "express";
import {
  createChatRoom,
  getChatHistory,
  getTotalUnreadMessages,
  getUnreadMessageCounts,
  getUserChatRooms,
  markMessagesAsRead,
} from "../controllers/chatController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/chatrooms", authenticateToken, createChatRoom);
router.get("/chatrooms/:chatRoomId/messages", getChatHistory);
router.get("/chatrooms/user/:userId", authenticateToken, getUserChatRooms);
router.get(
  "/chatrooms/unread-counts",
  authenticateToken,
  getUnreadMessageCounts
);
router.post("/chatrooms/mark-read", authenticateToken, markMessagesAsRead);
router.get(
  "/chatrooms/unread-total",
  authenticateToken,
  getTotalUnreadMessages
);
export default router;
