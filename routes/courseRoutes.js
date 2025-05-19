
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
} from "../controllers/courseController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/instructors', getInstructors);
router.get("/listCourse", getListCourses);
router.get("/:id/lessons", viewLessons);
router.get("/instructorCourses", authenticateToken, getCoursesByInstructor);
router.get("/getCourseById/:id", getCourseById);
router.get("/", getCourses);
router.get("/:id", getCourseDetails);
router.post("/create", upload.single('image'), createCourse);
router.put("/update/:id", upload.single('image'), updateCourse);
router.get("/:courseId/feedback", getCourseFeedback);

export default router;