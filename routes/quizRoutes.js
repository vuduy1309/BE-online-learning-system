import express from "express";
import {
  createQuiz,
  viewQuizByLessonId,
  updateQuiz,
  viewQuizById,
  getQuizById,
  takeQuiz,
  getLessonQuizScores,
  getUserQuizHistory, // thêm hàm mới
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
router.get('/:quizId/view', authenticateToken, authorizeRole(4) , getQuizById);
router.post('/:quizId/take', authenticateToken, authorizeRole(4), takeQuiz);
router.get("/:lessonId/quiz-scores", authenticateToken, authorizeRole(4), getLessonQuizScores);
router.get("/:quizId/user-history", authenticateToken, authorizeRole(4), getUserQuizHistory);

export default router;
