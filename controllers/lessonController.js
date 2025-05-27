import pool from "../config/db.js";

export const getLessonDetails = async (req, res) => {
  const { courseId, lessonId } = req.params;

  try {
    const [[lesson]] = await pool.query(
      `SELECT * FROM lessons WHERE LessonID = ? AND CourseID = ?`,
      [lessonId, courseId]
    );

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    const [materials] = await pool.query(
      `SELECT * FROM lessonmaterials WHERE LessonID = ?`,
      [lessonId]
    );

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
    const [[lesson]] = await pool.query(
      `SELECT * FROM lessons WHERE LessonID = ?`,
      [lessonId]
    );

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

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
    const [[lesson]] = await pool.query(
      `SELECT * FROM lessons WHERE LessonID = ? AND CourseID = ?`,
      [lessonId, courseId]
    );

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found in this course" });
    }

    const [[material]] = await pool.query(
      `SELECT * FROM lessonmaterials WHERE MaterialID = ? AND LessonID = ?`,
      [materialId, lessonId]
    );

    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    }

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
export const getAvailableLessons = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [lessons] = await pool.query(
      `
      SELECT l.LessonID, l.Title, l.Content, l.CourseID
      FROM orders o
      JOIN orderdetails od ON o.OrderID = od.OrderID
      JOIN lessons l ON od.CourseID = l.CourseID
      WHERE o.UserID = ? AND o.PaymentStatus = 'paid'
      ORDER BY l.CourseID, l.LessonID
      `,
      [userId]
    );

    res.json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLesson = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.userId;

  try {
    const [lessonAccess] = await pool.query(
      `
      SELECT l.*, c.Title as CourseTitle
      FROM lessons l
      JOIN courses c ON l.CourseID = c.CourseID
      JOIN enrollments e ON c.CourseID = e.CourseID
      WHERE l.LessonID = ? AND e.UserID = ?
      `,
      [lessonId, userId]
    );

    if (lessonAccess.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this lesson",
      });
    }

    const [lessonResult] = await pool.query(
      `
      SELECT 
        l.LessonID,
        l.CourseID,
        l.Title,
        l.Introduction,
        l.Content,
        l.Example,
        l.OrderNumber,
        c.Title as CourseTitle
      FROM lessons l
      JOIN courses c ON l.CourseID = c.CourseID
      WHERE l.LessonID = ?
      `,
      [lessonId]
    );

    if (lessonResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const lesson = lessonResult[0];

    const [materials] = await pool.query(
      `
      SELECT MaterialID, MaterialType, URL
      FROM lessonmaterials
      WHERE LessonID = ?
      ORDER BY MaterialID
      `,
      [lessonId]
    );

    const [quizzes] = await pool.query(
      `
      SELECT QuizID, Title
      FROM quizzes
      WHERE LessonID = ?
      ORDER BY QuizID
      `,
      [lessonId]
    );

    const [navigation] = await pool.query(
      `
      SELECT 
        LessonID,
        Title,
        OrderNumber
      FROM lessons
      WHERE CourseID = ? AND (
        OrderNumber = ? - 1 OR 
        OrderNumber = ? + 1
      )
      ORDER BY OrderNumber
      `,
      [lesson.CourseID, lesson.OrderNumber, lesson.OrderNumber]
    );

    const previousLesson = navigation.find(
      (l) => l.OrderNumber < lesson.OrderNumber
    );
    const nextLesson = navigation.find(
      (l) => l.OrderNumber > lesson.OrderNumber
    );

    const [courseLessons] = await pool.query(
      `
      SELECT LessonID, Title, OrderNumber
      FROM lessons
      WHERE CourseID = ?
      ORDER BY OrderNumber
      `,
      [lesson.CourseID]
    );

    const response = {
      success: true,
      data: {
        lesson: {
          id: lesson.LessonID,
          courseId: lesson.CourseID,
          courseTitle: lesson.CourseTitle,
          title: lesson.Title,
          introduction: lesson.Introduction,
          content: lesson.Content,
          example: lesson.Example,
          orderNumber: lesson.OrderNumber,
        },
        materials: materials.map((material) => ({
          id: material.MaterialID,
          type: material.MaterialType,
          url: material.URL,
        })),
        quizzes: quizzes.map((quiz) => ({
          id: quiz.QuizID,
          title: quiz.Title,
        })),
        navigation: {
          previous: previousLesson
            ? {
                id: previousLesson.LessonID,
                title: previousLesson.Title,
              }
            : null,
          next: nextLesson
            ? {
                id: nextLesson.LessonID,
                title: nextLesson.Title,
              }
            : null,
        },
        courseLessons: courseLessons.map((l) => ({
          id: l.LessonID,
          title: l.Title,
          orderNumber: l.OrderNumber,
          isCurrent: l.LessonID === parseInt(lessonId),
        })),
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching lesson details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLessonMaterials = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.userId;

  try {
    const [hasAccess] = await pool.query(
      `
      SELECT l.LessonID
      FROM lessons l
      JOIN courses c ON l.CourseID = c.CourseID
      JOIN enrollments e ON c.CourseID = e.CourseID
      WHERE l.LessonID = ? AND e.UserID = ?
      `,
      [lessonId, userId]
    );

    if (hasAccess.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [materials] = await pool.query(
      `
      SELECT MaterialID, MaterialType, URL
      FROM lessonmaterials
      WHERE LessonID = ?
      ORDER BY MaterialID
      `,
      [lessonId]
    );

    res.json({
      success: true,
      data: materials.map((material) => ({
        id: material.MaterialID,
        type: material.MaterialType,
        url: material.URL,
      })),
    });
  } catch (error) {
    console.error("Error fetching lesson materials:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLessonQuizzes = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.userId;

  try {
    const [hasAccess] = await pool.query(
      `
      SELECT l.LessonID
      FROM lessons l
      JOIN courses c ON l.CourseID = c.CourseID
      JOIN enrollments e ON c.CourseID = e.CourseID
      WHERE l.LessonID = ? AND e.UserID = ?
      `,
      [lessonId, userId]
    );

    if (hasAccess.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [quizzes] = await pool.query(
      `
      SELECT QuizID, Title
      FROM quizzes
      WHERE LessonID = ?
      ORDER BY QuizID
      `,
      [lessonId]
    );

    res.json({
      success: true,
      data: quizzes.map((quiz) => ({
        id: quiz.QuizID,
        title: quiz.Title,
      })),
    });
  } catch (error) {
    console.error("Error fetching lesson quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
};
