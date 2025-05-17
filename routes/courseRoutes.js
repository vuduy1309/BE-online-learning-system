import { Router } from "express";
import { getCourses } from "../controllers/courseController.js";

const router = Router();

router.get("/", getCourses);

export default router;
