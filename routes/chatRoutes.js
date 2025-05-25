import express from "express";
import {
    createChatRoom,
  getChatHistory,
  getUserChatRooms,
} from "../controllers/chatController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/chatrooms", authenticateToken, createChatRoom);
router.get("/chatrooms/:chatRoomId/messages", getChatHistory);
router.get("/chatrooms/user/:userId", authenticateToken, getUserChatRooms);
export default router;
