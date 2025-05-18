import pool, { query } from "../config/db.js";

export const getCourses = async (req, res) => {
  try {
    const [courses] = await query(`
      SELECT 
        c.CourseID,
        c.Title,
        c.Description,
        c.Price,
        c.ImageURL,
        ROUND(AVG(r.Rating), 1) as AverageRating
      FROM courses c
      LEFT JOIN coursefeedback r ON c.CourseID = r.CourseID
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

export const createCourse = async (req, res) => {
  try {
    const { Title, Description, Price, ImageURL } = req.body;

    const [result] = await pool.query(
      `INSERT INTO courses (Title, Description, Price, ImageURL) VALUES (?, ?, ?, ?)`,
      [Title, Description, Price, ImageURL]
    );

    res
      .status(201)
      .json({ message: "Course created", courseId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create course" });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { Title, Description, Price, ImageURL, Status } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE courses SET Title = ?, Description = ?, Price = ?, ImageURL = ?, Status = ? WHERE CourseID = ?`,
      [Title, Description, Price, ImageURL, Status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update course" });
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
