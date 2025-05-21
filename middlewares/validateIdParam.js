import { param } from "express-validator";

export const validateIdParam = [
  param("id").isInt().withMessage("Invalid ID format"),
];

export const validateCourseIdParam = [
  param("courseId").isInt().withMessage("Invalid Course ID"),
];
