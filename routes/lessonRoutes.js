import express from "express";
import {
  addMaterial,
  deleteMaterial,
  getLessonDetails,
  updateLesson,
} from "../controllers/lessonController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/courses/:courseId/lessons/:lessonId",
  authenticateToken,
  authorizeRole(3),
  getLessonDetails
);
router.put(
  "/courses/:courseId/lessons/:lessonId",
  authenticateToken,
  authorizeRole(3),
  updateLesson
);
router.post(
  "/courses/:courseId/lessons/:lessonId/materials",
  authenticateToken,
  authorizeRole(3),
  addMaterial
);
router.delete(
  "/courses/:courseId/lessons/:lessonId/materials/:materialId",
  authenticateToken,
  authorizeRole(3),
  deleteMaterial
);
export default router;
