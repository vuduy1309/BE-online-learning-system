import pool from "../config/db.js";

export const getLessonDetails = async (req, res) => {
  const { courseId, lessonId } = req.params;

  try {
    // Lấy thông tin bài học
    const [[lesson]] = await pool.query(
      `SELECT * FROM lessons WHERE LessonID = ? AND CourseID = ?`,
      [lessonId, courseId]
    );

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    // Lấy materials của bài học
    const [materials] = await pool.query(
      `SELECT * FROM lessonmaterials WHERE LessonID = ?`,
      [lessonId]
    );

    // Lấy quizzes của bài học
    const [quizzes] = await pool.query(
      `SELECT * FROM quizzes WHERE LessonID = ?`,
      [lessonId]
    );

    return res.json({
      success: true,
      lesson,
      materials,
      quizzes,
    });
  } catch (error) {
    console.error("Error getting lesson details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
