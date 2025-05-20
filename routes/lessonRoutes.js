import express from "express";
import { addMaterial, getLessonDetails, updateLesson } from "../controllers/lessonController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/courses/:courseId/lessons/:lessonId", authenticateToken, getLessonDetails);
router.put('/courses/:courseId/lessons/:lessonId', authenticateToken, updateLesson);
router.post("/courses/:courseId/lessons/:lessonId/materials", authenticateToken, addMaterial)

export default router;
