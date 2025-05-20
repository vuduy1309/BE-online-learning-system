import express from "express";
import {
  createQuiz,
  viewQuizByLessonId,
  updateQuiz,
  viewQuizById,
} from "../controllers/quizController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createQuiz);
router.get("/lesson/:lessonId", viewQuizByLessonId);
router.get("/id/:quizId", viewQuizById);
router.put("/:quizId", authenticateToken, updateQuiz);

export default router;
