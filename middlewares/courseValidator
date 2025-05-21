import { body } from "express-validator";

export const validateCourse = [
  body("Title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),

  body("Description").notEmpty().withMessage("Description is required"),

  body("Price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("InstructorID")
    .custom(async (value) => {
      const [rows] = await query(
        "SELECT * FROM users WHERE UserID = ? AND RoleID = 3",
        [value]
      );
      if (rows.length === 0) {
        throw new Error("Instructor does not exist");
      }
      return true;
    })
    .notEmpty()
    .withMessage("InstructorID is required")
    .isInt({ min: 1 })
    .withMessage("InstructorID must be a positive integer"),
];
