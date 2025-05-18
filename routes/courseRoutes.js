import { Router } from "express";
import {
  createCourse,
  getCourseDetails,
  getCourses,
  updateCourse,
  getCourseById,
  getListCourses,
  getCourseFeedback,
} from "../controllers/courseController.js";

const router = Router();

router.get("/listCourse", getListCourses);
router.get("/getCourseById/:id", getCourseById);
router.get("/", getCourses);
router.get("/:id", getCourseDetails);
router.post("/create", createCourse);
router.put("/update/:id", updateCourse);
router.get("/:courseId/feedback", getCourseFeedback);

export default router;
