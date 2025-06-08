import { Router } from "express";
import {
  createCourse,
  getCourseDetails,
  getCourses,
  updateCourse,
  getCourseById,
  getListCourses,
  getCourseFeedback,
  getInstructors,
  upload,
  getCoursesByInstructor,
  viewLessons,
  enrolledCoures,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getMyFeedbackForCourse,
} from "../controllers/courseController.js";

import { authenticateToken } from "../middlewares/authMiddleware.js";

import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import { validateCourse } from "../middlewares/courseValidator.js";
import {
  validateCourseIdParam,
  validateIdParam,
} from "../middlewares/validateIdParam.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/enrollments/my-courses", authenticateToken, enrolledCoures);
router.get("/instructors", getInstructors);
router.get("/listCourse", authenticateToken, authorizeRole(2), getListCourses);
router.get("/:id/lessons", validateIdParam, authenticateToken, viewLessons);
router.get(
  "/instructorCourses",
  authenticateToken,
  authorizeRole(3),
  getCoursesByInstructor
);
router.get("/getCourseById/:id", getCourseById);
router.get("/", getCourses);
router.get("/:id", validateIdParam, getCourseDetails);

router.post(
  "/create",
  upload.single("image"),
  validateCourse,
  handleValidationErrors,
  createCourse
);

router.put(
  "/update/:id",
  upload.single("image"),
  handleValidationErrors,
  updateCourse
);

router.get(
  "/:courseId/feedback",
  validateCourseIdParam,
  authenticateToken,
  getCourseFeedback,
  authorizeRole(2)
);
router.get("/feedback/course/:courseId", authenticateToken, getMyFeedbackForCourse);
router.post("/feedback/create", authenticateToken, createFeedback);
router.put("/feedback/:feedbackId", authenticateToken, updateFeedback);
router.delete("/feedback/:feedbackId", authenticateToken, deleteFeedback);

export default router;
