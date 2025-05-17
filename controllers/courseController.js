import { query } from "../config/db.js";

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
