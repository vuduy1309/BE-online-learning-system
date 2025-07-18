import pool, { query } from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { validateCourse } from "../middlewares/courseValidator.js";
import { validationResult } from "express-validator";

export const getCourses = async (req, res) => {
  try {
    const [courses] = await query(`
      SELECT 
        c.CourseID,
        c.Title,
        c.Description,
        c.Price,
        c.ImageURL,
        ROUND(AVG(r.Rating), 1) as AverageRating,
        ANY_VALUE(u.FullName) AS InstructorName
      FROM courses c
      LEFT JOIN coursefeedback r ON c.CourseID = r.CourseID
      LEFT JOIN courseinstructors ci ON ci.CourseID = c.CourseID
      LEFT JOIN users u ON u.UserID = ci.InstructorID
      WHERE Status = 'Active'
      GROUP BY c.CourseID
      ORDER BY c.CreatedAt DESC
    `);

    res.json(courses);
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const [[course]] = await pool.query(
      `
      SELECT 
        c.CourseID,
        c.Title,
        c.Description,
        c.Price,
        c.ImageURL,
        ROUND(AVG(cf.Rating), 1) AS Rating,
        COUNT(DISTINCT e.EnrollmentID) AS EnrollmentCount,
        COUNT(DISTINCT l.LessonID) AS LessonCount,
        COUNT(DISTINCT lm.MaterialID) AS MaterialCount,
        ANY_VALUE(u.FullName) AS InstructorName
      FROM courses c
      LEFT JOIN coursefeedback cf ON cf.CourseID = c.CourseID
      LEFT JOIN enrollments e ON e.CourseID = c.CourseID
      LEFT JOIN lessons l ON l.CourseID = c.CourseID
      LEFT JOIN lessonmaterials lm ON lm.LessonID = l.LessonID
      LEFT JOIN courseinstructors ci ON ci.CourseID = c.CourseID
      LEFT JOIN users u ON u.UserID = ci.InstructorID
      WHERE c.CourseID = ?
      GROUP BY c.CourseID
      `,
      [id]
    );

    if (!course) return res.status(404).json({ error: "Course not found" });

    const [reviews] = await pool.query(
      `
      SELECT u.FullName, u.AvatarURL, f.Rating, f.Comment, f.ReviewDate
      FROM coursefeedback f
      JOIN users u ON f.UserID = u.UserID
      WHERE f.CourseID = ?
      ORDER BY f.ReviewDate DESC
      `,
      [id]
    );

    res.json({ ...course, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
};

export const getInstructors = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT u.UserID, u.FullName
        FROM userroles ur
        JOIN users u ON ur.UserID = u.UserID
        WHERE ur.RoleID = 3;`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch instructors" });
  } finally {
    conn.release();
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/courses/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "course-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
export const createCourse = [
  validateCourse,
  async (req, res) => {
    const conn = await pool.getConnection();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { Title, Description, Price, InstructorID } = req.body;

      let ImageURL = null;
      if (req.file) {
        ImageURL = `/uploads/courses/${req.file.filename}`;
      }

      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO courses (Title, Description, Price, ImageURL) VALUES (?, ?, ?, ?)`,
        [Title, Description, Price, ImageURL]
      );

      const courseId = result.insertId;

      await conn.query(
        `INSERT INTO courseinstructors (CourseID, InstructorID) VALUES (?, ?)`,
        [courseId, InstructorID]
      );

      await conn.commit();

      res.status(201).json({
        message: "Course created successfully",
        courseId,
        imageUrl: ImageURL,
      });
    } catch (err) {
      await conn.rollback();
      console.error(err);

      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      }

      res.status(500).json({ error: "Failed to create course" });
    } finally {
      conn.release();
    }
  },
];

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { Title, Description, Price, Status, InstructorID } = req.body;
  const conn = await pool.getConnection();

  try {
    let ImageURL = req.body.ImageURL;

    if (req.file) {
      ImageURL = `/uploads/courses/${req.file.filename}`;

      const [oldCourse] = await conn.query(
        `SELECT ImageURL FROM courses WHERE CourseID = ?`,
        [id]
      );

      if (oldCourse[0]?.ImageURL && oldCourse[0].ImageURL !== ImageURL) {
        const oldImagePath = path.join(
          process.cwd(),
          oldCourse[0].ImageURL.replace("/", "")
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
      }
    }

    await conn.beginTransaction();

    const [result] = await conn.query(
      `UPDATE courses SET Title = ?, Description = ?, Price = ?, ImageURL = ?, Status = ? WHERE CourseID = ?`,
      [Title, Description, Price, ImageURL, Status, id]
    );

    if (InstructorID) {
      const [existingInstructor] = await conn.query(
        `SELECT * FROM courseinstructors WHERE CourseID = ?`,
        [id]
      );

      if (existingInstructor.length > 0) {
        await conn.query(
          `UPDATE courseinstructors SET InstructorID = ? WHERE CourseID = ?`,
          [InstructorID, id]
        );
      } else {
        await conn.query(
          `INSERT INTO courseinstructors (CourseID, InstructorID) VALUES (?, ?)`,
          [id, InstructorID]
        );
      }
    }

    await conn.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({
      message: "Course updated successfully",
      imageUrl: ImageURL,
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error updating course:", error);

    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting file:", unlinkErr);
      });
    }

    res.status(500).json({ error: "Failed to update course" });
  } finally {
    conn.release();
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM courses WHERE CourseID = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

export const getListCourses = async (req, res) => {
  if (!req.user || req.user.role !== 2) {
    return res
      .status(403)
      .json({ message: "Access denied. Only instructors can access this." });
  }

  try {
    const [rows] = await query(`
      SELECT 
          c.CourseID,
          c.Title,
          c.Description,
          c.Price,
          ROUND(AVG(cf.Rating), 1) AS Rating,
          COUNT(DISTINCT e.EnrollmentID) AS EnrollmentCount,
          COUNT(DISTINCT l.LessonID) AS LessonCount,
          COUNT(DISTINCT lm.MaterialID) AS MaterialCount,
          ANY_VALUE(u.FullName) AS InstructorName
      FROM courses c
          LEFT JOIN coursefeedback cf ON cf.CourseID = c.CourseID
          LEFT JOIN enrollments e ON e.CourseID = c.CourseID
          LEFT JOIN lessons l ON l.CourseID = c.CourseID
          LEFT JOIN lessonmaterials lm ON lm.LessonID = l.LessonID
          LEFT JOIN courseinstructors ci ON ci.CourseID = c.CourseID
          LEFT JOIN users u ON u.UserID = ci.InstructorID
      GROUP BY c.CourseID
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching course data." });
  }
};

export const getCourseFeedback = async (req, res) => {
  const { courseId } = req.params;
  try {
    const [rows] = await query(
      `
      SELECT 
        cf.Rating,
        cf.Comment,
        cf.ReviewDate,
        u.FullName,
        u.AvatarURL
      FROM coursefeedback cf
      JOIN users u ON cf.UserID = u.UserID
      WHERE cf.CourseID = ?
    `,
      [courseId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching feedback." });
  }
};

export const getCoursesByInstructor = async (req, res) => {
  const instructorId = req.user.userId;

  try {
    const [courses] = await query(
      `
      SELECT 
        c.CourseID,
        c.Title,
        c.Description,
        c.Price,
        c.ImageURL,
        ROUND(AVG(cf.Rating), 1) AS Rating,
        COUNT(DISTINCT e.EnrollmentID) AS EnrollmentCount,
        COUNT(DISTINCT l.LessonID) AS LessonCount,
        COUNT(DISTINCT lm.MaterialID) AS MaterialCount
      FROM courses c
        JOIN courseinstructors ci ON ci.CourseID = c.CourseID
        LEFT JOIN coursefeedback cf ON cf.CourseID = c.CourseID
        LEFT JOIN enrollments e ON e.CourseID = c.CourseID
        LEFT JOIN lessons l ON l.CourseID = c.CourseID
        LEFT JOIN lessonmaterials lm ON lm.LessonID = l.LessonID
      WHERE ci.InstructorID = ?
      GROUP BY c.CourseID
      ORDER BY c.CreatedAt DESC
    `,
      [instructorId]
    );

    res.json(courses);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({ message: "Failed to fetch instructor's courses." });
  }
};

export const viewLessons = async (req, res) => {
  const courseId = req.params.id;

  try {
    const [courseResults] = await query(
      `SELECT 
         CourseID, 
         Title, 
         Description 
       FROM courses 
       WHERE CourseID = ?`,
      [courseId]
    );

    if (courseResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const course = courseResults[0];

    const [lessons] = await query(
      `SELECT 
         LessonID, 
         Title, 
         Introduction 
       FROM lessons 
       WHERE CourseID = ? 
       ORDER BY OrderNumber ASC`,
      [courseId]
    );

    res.json({
      success: true,
      course,
      lessons,
    });
  } catch (error) {
    console.error("Error fetching course with lessons:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const enrolledCoures = async (req, res) => {
  const userId = req.user.userId;
  try {
    const [courses] = await pool.query(
      `
      SELECT DISTINCT c.CourseID, c.Title, c.Description, c.Price, c.ImageURL
      FROM enrollments e
      JOIN courses c ON e.CourseID = c.CourseID
      WHERE e.UserID = ?
    `,
      [userId]
    );

    res.json(courses);
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createFeedback = async (req, res) => {
  const { userId } = req.user;
  const { courseId, rating, comment } = req.body;

  try {
    const [[enrollment]] = await pool.query(
      `SELECT EnrollmentID FROM enrollments WHERE UserID = ? AND CourseID = ?`,
      [userId, courseId]
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: "You can only review courses you've enrolled in",
      });
    }

    const [[existingFeedback]] = await pool.query(
      `SELECT FeedbackID FROM coursefeedback WHERE UserID = ? AND CourseID = ?`,
      [userId, courseId]
    );

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    await pool.query(
      `INSERT INTO coursefeedback (UserID, CourseID, Rating, Comment, ReviewDate) 
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, courseId, rating, comment]
    );

    res.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

export const updateFeedback = async (req, res) => {
  const { userId } = req.user;
  const { feedbackId } = req.params;
  const { rating, comment } = req.body;

  try {
    const [[feedback]] = await pool.query(
      `SELECT FeedbackID FROM coursefeedback WHERE FeedbackID = ? AND UserID = ?`,
      [feedbackId, userId]
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found or unauthorized",
      });
    }

    await pool.query(
      `UPDATE coursefeedback SET Rating = ?, Comment = ? WHERE FeedbackID = ?`,
      [rating, comment, feedbackId]
    );

    res.json({
      success: true,
      message: "Feedback updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update feedback",
    });
  }
};

export const deleteFeedback = async (req, res) => {
  const { userId } = req.user;
  const { feedbackId } = req.params;

  try {
    const [[feedback]] = await pool.query(
      `SELECT FeedbackID FROM coursefeedback WHERE FeedbackID = ? AND UserID = ?`,
      [feedbackId, userId]
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found or unauthorized",
      });
    }

    await pool.query(`DELETE FROM coursefeedback WHERE FeedbackID = ?`, [
      feedbackId,
    ]);

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
    });
  }
};

export const getMyFeedbackForCourse = async (req, res) => {
  const { userId } = req.user;
  const { courseId } = req.params;

  try {
    const [[feedback]] = await pool.query(
      `SELECT FeedbackID, Rating, Comment, ReviewDate
       FROM coursefeedback
       WHERE UserID = ? AND CourseID = ?`,
      [userId, courseId]
    );

    if (!feedback) {
      return res.json({ success: true, feedback: null });
    }

    res.json({ success: true, feedback });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch feedback" });
  }
};
