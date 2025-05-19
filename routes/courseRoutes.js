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
} from "../controllers/courseController.js";

const router = Router();

router.get('/instructors', getInstructors);
router.get("/listCourse", getListCourses);
router.get("/getCourseById/:id", getCourseById);
router.get("/", getCourses);
router.get("/:id", getCourseDetails);
// Thêm upload.single('image') middleware
router.post("/create", upload.single('image'), createCourse);
router.put("/update/:id", updateCourse);
router.get("/:courseId/feedback", getCourseFeedback);

export default router;
