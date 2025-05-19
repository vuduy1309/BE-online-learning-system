import express from "express";
import { getLessonDetails } from "../controllers/lessonController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/courses/:courseId/lessons/:lessonId", authenticateToken, getLessonDetails);

export default router;
