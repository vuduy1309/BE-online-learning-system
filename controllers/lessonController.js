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

export const updateLesson = async (req, res) => {
  const { courseId, lessonId } = req.params;
  const { Title, Introduction, Content, Example, OrderNumber } = req.body;

  try {
    // Kiểm tra xem bài học có tồn tại không
    const [[existingLesson]] = await pool.query(
      `SELECT * FROM lessons WHERE LessonID = ? AND CourseID = ?`,
      [lessonId, courseId]
    );

    if (!existingLesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    await pool.query(
      `UPDATE lessons SET Title = ?, Introduction = ?, Content = ?, Example = ?, OrderNumber = ? 
       WHERE LessonID = ? AND CourseID = ?`,
      [Title, Introduction, Content, Example, OrderNumber, lessonId, courseId]
    );

    const [[updatedLesson]] = await pool.query(
      `SELECT * FROM lessons WHERE LessonID = ? AND CourseID = ?`,
      [lessonId, courseId]
    );

    return res.json({
      success: true,
      message: "Lesson updated successfully",
      updatedLesson,
    });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const addMaterial = async (req, res) => {
  const { lessonId } = req.params;
  const { MaterialType, URL } = req.body;

  if (!MaterialType || !URL) {
    return res
      .status(400)
      .json({ success: false, message: "Missing material type or URL." });
  }

  try {
    // Kiểm tra bài học có tồn tại không
    const [[lesson]] = await pool.query(
      `SELECT * FROM lessons WHERE LessonID = ?`,
      [lessonId]
    );

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    // Thêm material mới
    const [result] = await pool.query(
      `INSERT INTO lessonmaterials (LessonID, MaterialType, URL) VALUES (?, ?, ?)`,
      [lessonId, MaterialType, URL]
    );

    const [[newMaterial]] = await pool.query(
      `SELECT * FROM lessonmaterials WHERE MaterialID = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Material added successfully",
      material: newMaterial,
    });
  } catch (error) {
    console.error("Error adding material:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteMaterial = async (req, res) => {
  const { courseId, lessonId, materialId } = req.params;

  try {
    // Kiểm tra xem bài học có tồn tại trong khóa học không
    const [[lesson]] = await pool.query(
      `SELECT * FROM lessons WHERE LessonID = ? AND CourseID = ?`,
      [lessonId, courseId]
    );

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found in this course" });
    }

    // Kiểm tra xem material có tồn tại không
    const [[material]] = await pool.query(
      `SELECT * FROM lessonmaterials WHERE MaterialID = ? AND LessonID = ?`,
      [materialId, lessonId]
    );

    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    }

    // Xóa material
    await pool.query(
      `DELETE FROM lessonmaterials WHERE MaterialID = ? AND LessonID = ?`,
      [materialId, lessonId]
    );

    return res.json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
