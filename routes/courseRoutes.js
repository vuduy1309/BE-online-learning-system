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
router.get(
  "/:id/lessons",
  validateIdParam,
  authenticateToken,
  viewLessons
);
router.get(
  "/instructorCourses",
  authenticateToken,
  authorizeRole(3),
  getCoursesByInstructor
);
router.get(
  "/getCourseById/:id",
  getCourseById
);
router.get("/", getCourses);
router.get("/:id", validateIdParam, getCourseDetails);

router.post(
  "/create",
  upload.single("image"),
  validateCourse,
  handleValidationErrors,
  authorizeRole(2),
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


export default router;
