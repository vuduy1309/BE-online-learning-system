import express from "express";
import {
  addMaterial,
  deleteMaterial,
  getLessonDetails,
  updateLesson,
} from "../controllers/lessonController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/courses/:courseId/lessons/:lessonId",
  authenticateToken,
  getLessonDetails
);
router.put(
  "/courses/:courseId/lessons/:lessonId",
  authenticateToken,
  updateLesson
);
router.post(
  "/courses/:courseId/lessons/:lessonId/materials",
  authenticateToken,
  addMaterial
);
router.delete(
  "/courses/:courseId/lessons/:lessonId/materials/:materialId",
  authenticateToken,
  deleteMaterial
);
export default router;
