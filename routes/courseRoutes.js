import { Router } from "express";
import { createCourse, getCourseDetails, getCourses, updateCourse, getCourseById} from "../controllers/courseController.js";


const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourseDetails);
router.post("/create", createCourse);
router.put("/update/:id", updateCourse);
router.get("/getCourseById/:id", getCourseById);

export default router;
