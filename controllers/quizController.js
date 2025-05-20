import pool from "../config/db.js";

export const createQuiz = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { LessonID, Title, Questions } = req.body;

    await conn.beginTransaction();

    const [quizResult] = await conn.query(
      `INSERT INTO quizzes (LessonID, Title) VALUES (?, ?)`,
      [LessonID, Title]
    );

    const quizId = quizResult.insertId;

    for (const q of Questions) {
      const [questionResult] = await conn.query(
        `INSERT INTO questions (QuizID, Content, ImageURL) VALUES (?, ?, ?)`,
        [quizId, q.Content, q.ImageURL || null]
      );

      const questionId = questionResult.insertId;

      for (const option of q.AnswerOptions) {
        await conn.query(
          `INSERT INTO answeroptions (QuestionID, Content, IsCorrect) VALUES (?, ?, ?)`,
          [questionId, option.Content, option.IsCorrect]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ message: "Quiz created successfully", quizId });
  } catch (error) {
    await conn.rollback();
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Failed to create quiz" });
  } finally {
    conn.release();
  }
};

export const viewQuizByLessonId = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const [[quiz]] = await pool.query(
      `SELECT * FROM quizzes WHERE LessonID = ?`,
      [lessonId]
    );

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const [questions] = await pool.query(
      `SELECT * FROM questions WHERE QuizID = ?`,
      [quiz.QuizID]
    );

    for (const question of questions) {
      const [options] = await pool.query(
        `SELECT * FROM answeroptions WHERE QuestionID = ?`,
        [question.QuestionID]
      );

      // Chuyển IsCorrect từ Buffer -> boolean
      question.AnswerOptions = options.map((option) => ({
        ...option,
        IsCorrect: !!option.IsCorrect?.[0], // Ép kiểu
      }));
    }

    res.json({
      ...quiz,
      Questions: questions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

export const updateQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { Title, Questions } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(`UPDATE quizzes SET Title = ? WHERE QuizID = ?`, [
      Title,
      quizId,
    ]);

    const [oldQuestions] = await conn.query(
      `SELECT QuestionID FROM questions WHERE QuizID = ?`,
      [quizId]
    );

    for (const q of oldQuestions) {
      await conn.query(`DELETE FROM answeroptions WHERE QuestionID = ?`, [
        q.QuestionID,
      ]);
    }

    await conn.query(`DELETE FROM questions WHERE QuizID = ?`, [quizId]);

    for (const q of Questions) {
      const [questionResult] = await conn.query(
        `INSERT INTO questions (QuizID, Content, ImageURL) VALUES (?, ?, ?)`,
        [quizId, q.Content, q.ImageURL || null]
      );

      const questionId = questionResult.insertId;

      for (const option of q.AnswerOptions) {
        
        const isCorrect =
          typeof option.IsCorrect === "object" && option.IsCorrect?.type === "Buffer"
            ? option.IsCorrect.data[0] === 1
            : !!option.IsCorrect;

        await conn.query(
          `INSERT INTO answeroptions (QuestionID, Content, IsCorrect) VALUES (?, ?, ?)`,
          [questionId, option.Content, isCorrect]
        );
      }
    }

    await conn.commit();
    res.json({ message: "Quiz updated successfully" });
  } catch (error) {
    await conn.rollback();
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Failed to update quiz" });
  } finally {
    conn.release();
  }
};


// controllers/quizController.js
export const viewQuizById = async (req, res) => {
  const { quizId } = req.params;
  try {
    const [[quiz]] = await pool.query(
      `SELECT * FROM quizzes WHERE QuizID = ?`,
      [quizId]
    );

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const [questions] = await pool.query(
      `SELECT * FROM questions WHERE QuizID = ?`,
      [quiz.QuizID]
    );

    for (const question of questions) {
      const [options] = await pool.query(
        `SELECT * FROM answeroptions WHERE QuestionID = ?`,
        [question.QuestionID]
      );
      question.AnswerOptions = options;
    }

    res.json({
      ...quiz,
      Questions: questions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};
