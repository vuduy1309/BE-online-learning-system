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

      question.AnswerOptions = options.map((option) => ({
        ...option,
        IsCorrect: !!option.IsCorrect?.[0],
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
          typeof option.IsCorrect === "object" &&
          option.IsCorrect?.type === "Buffer"
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

export const getQuizById = async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user.userId;

  try {
    const [enrollCheck] = await pool.query(
      `
      SELECT q.QuizID
      FROM quizzes q
      JOIN lessons l ON q.LessonID = l.LessonID
      JOIN courses c ON l.CourseID = c.CourseID
      JOIN enrollments e ON c.CourseID = e.CourseID
      WHERE q.QuizID = ? AND e.UserID = ?
    `,
      [quizId, userId]
    );

    if (enrollCheck.length === 0) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const [[quiz]] = await pool.query(
      `SELECT QuizID, Title FROM quizzes WHERE QuizID = ?`,
      [quizId]
    );

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    const [questions] = await pool.query(
      `SELECT QuestionID, Content, ImageURL FROM questions WHERE QuizID = ?`,
      [quizId]
    );

    const [allOptions] = await pool.query(
      `SELECT OptionID, QuestionID, Content FROM answeroptions WHERE QuestionID IN (?)`,
      [questions.map((q) => q.QuestionID)]
    );

    const formattedQuestions = questions.map((question) => ({
      questionId: question.QuestionID,
      content: question.Content,
      imageUrl: question.ImageURL,
      options: allOptions
        .filter((opt) => opt.QuestionID === question.QuestionID)
        .map((opt) => ({
          optionId: opt.OptionID,
          content: opt.Content,
        })),
    }));

    res.json({
      success: true,
      data: {
        quizId: quiz.QuizID,
        title: quiz.Title,
        questions: formattedQuestions,
      },
    });
  } catch (err) {
    console.error("Error fetching quiz:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const takeQuiz = async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user.userId;
  const { answers } = req.body;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    let correctCount = 0;

    for (const answer of answers) {
      const [correctOption] = await conn.query(
        `SELECT IsCorrect FROM answeroptions WHERE OptionID = ?`,
        [answer.selectedOptionId]
      );

      let isCorrect = false;
      if (correctOption.length) {
        const val = correctOption[0].IsCorrect;
        isCorrect = Buffer.isBuffer(val) ? val[0] === 1 : val === 1;
      }
      if (isCorrect) {
        correctCount++;
      }
    }

    const totalQuestions = answers.length;
    const score = (correctCount / totalQuestions) * 100;

    const [attemptResult] = await conn.query(
      `INSERT INTO userquizattempts (UserID, QuizID, Score, AttemptDate)
       VALUES (?, ?, ?, NOW())`,
      [userId, quizId, score]
    );

    const attemptId = attemptResult.insertId;

    for (const answer of answers) {
      await conn.query(
        `INSERT INTO useranswers (AttemptID, QuestionID, SelectedOptionID)
         VALUES (?, ?, ?)`,
        [attemptId, answer.questionId, answer.selectedOptionId]
      );
    }

    await conn.commit();

    res.json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        attemptId,
        score,
        totalQuestions,
        correctAnswers: correctCount,
      },
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error taking quiz:", error);
    res.status(500).json({ success: false, message: "Failed to take quiz" });
  } finally {
    conn.release();
  }
};

export const getLessonQuizScores = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.userId;

  try {
    const [quizzes] = await pool.query(
      `SELECT QuizID, Title FROM quizzes WHERE LessonID = ?`,
      [lessonId]
    );

    const [scores] = await pool.query(
      `SELECT 
          QuizID, 
          MAX(Score) AS bestScore, 
          (SELECT Score FROM userquizattempts WHERE UserID = ? AND QuizID = q.QuizID ORDER BY AttemptDate DESC LIMIT 1) AS latestScore
        FROM userquizattempts q
        WHERE UserID = ? AND QuizID IN (SELECT QuizID FROM quizzes WHERE LessonID = ?)
        GROUP BY QuizID`,
      [userId, userId, lessonId]
    );

    const quizList = quizzes.map((q) => {
      const score = scores.find((s) => s.QuizID === q.QuizID) || {};
      return {
        quizId: q.QuizID,
        title: q.Title,
        bestScore: score.bestScore || null,
        latestScore: score.latestScore || null,
      };
    });

    res.json({ success: true, data: quizList });
  } catch (error) {
    console.error("Error fetching lesson quiz scores:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch lesson quiz scores" });
  }
};

export const getUserQuizHistory = async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user.userId;

  try {
    const [attempts] = await pool.query(
      `SELECT AttemptID, Score, AttemptDate FROM userquizattempts WHERE QuizID = ? AND UserID = ? ORDER BY AttemptDate DESC`,
      [quizId, userId]
    );

    for (const attempt of attempts) {
      const [answers] = await pool.query(
        `SELECT ua.QuestionID, q.Content AS QuestionContent, ua.SelectedOptionID, ao.Content AS SelectedOptionContent, ao.IsCorrect
         FROM useranswers ua
         JOIN questions q ON ua.QuestionID = q.QuestionID
         JOIN answeroptions ao ON ua.SelectedOptionID = ao.OptionID
         WHERE ua.AttemptID = ?`,
        [attempt.AttemptID]
      );
      attempt.answers = answers.map((a) => ({
        questionId: a.QuestionID,
        questionContent: a.QuestionContent,
        selectedOptionId: a.SelectedOptionID,
        selectedOptionContent: a.SelectedOptionContent,
        isCorrect: Buffer.isBuffer(a.IsCorrect)
          ? a.IsCorrect[0] === 1
          : a.IsCorrect === 1,
      }));
    }

    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user quiz history" });
  }
};

export const getLessonQuizAttempts = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const [attempts] = await pool.query(
      `SELECT 
        ua.AttemptID,
        u.FullName as StudentName, 
        q.Title as QuizTitle,
        ua.Score,
        (SELECT COUNT(*) FROM questions WHERE QuizID = q.QuizID) as TotalQuestions,
        ua.AttemptDate
      FROM userquizattempts ua
      JOIN users u ON ua.UserID = u.UserID
      JOIN quizzes q ON ua.QuizID = q.QuizID
      WHERE q.LessonID = ?
        AND ua.Score = (
          SELECT MAX(Score) 
          FROM userquizattempts ua2 
          WHERE ua2.UserID = ua.UserID 
          AND ua2.QuizID = ua.QuizID
        )
      ORDER BY ua.Score DESC, ua.AttemptDate DESC`,
      [lessonId]
    );

    res.json({
      success: true,
      attempts: attempts,
    });
  } catch (error) {
    console.error("Error fetching lesson quiz attempts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lesson quiz attempts",
    });
  }
};
