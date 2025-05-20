import express from "express";
import {
  createQuiz,
  viewQuizByLessonId,
  updateQuiz,
} from "../controllers/quizController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createQuiz);
router.get("/:lessonId", viewQuizByLessonId);
router.put("/:quizId", authenticateToken, updateQuiz);

export default router;
