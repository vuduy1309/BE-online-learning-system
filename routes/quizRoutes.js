import express from "express";
import {
  createQuiz,
  viewQuizByLessonId,
  updateQuiz,
  viewQuizById,
} from "../controllers/quizController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRole(3), createQuiz);
router.get(
  "/lesson/:lessonId",
  authenticateToken,
  authorizeRole(3),
  viewQuizByLessonId
);
router.get("/id/:quizId", authenticateToken, authorizeRole(3), viewQuizById);
router.put("/:quizId", authenticateToken, authorizeRole(3), updateQuiz);

export default router;
