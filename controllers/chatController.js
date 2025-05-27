import pool from "../config/db.js";

export const getChatHistory = async (req, res) => {
  const { chatRoomId } = req.params;
  try {
    const [messages] = await pool.query(
      `SELECT m.MessageID, m.SenderID, u.FullName, m.Content, m.ImageURL, m.SentAt
       FROM messages m
       LEFT JOIN users u ON m.SenderID = u.UserID
       WHERE m.ChatRoomID = ?
       ORDER BY m.SentAt ASC`,
      [chatRoomId]
    );
    res.json({ success: true, data: messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch chat history" });
  }
};

export const getUserChatRooms = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [rooms] = await pool.query(
      `SELECT 
          c.ChatRoomID, 
          c.UserID, 
          u1.FullName AS UserFullName, 
          c.InstructorID, 
          u2.FullName AS InstructorFullName, 
          c.CreatedAt
       FROM chatrooms c
       LEFT JOIN users u1 ON c.UserID = u1.UserID
       LEFT JOIN users u2 ON c.InstructorID = u2.UserID
       WHERE c.UserID = ? OR c.InstructorID = ?`,
      [userId, userId]
    );
    res.json({ success: true, data: rooms });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch chat rooms" });
  }
};

export const createChatRoom = async (req, res) => {
  const { userId, instructorId } = req.body;

  if (!userId || !instructorId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameters" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO chatrooms (UserID, InstructorID) VALUES (?, ?)`,
      [userId, instructorId]
    );
    const chatRoomId = result.insertId;

    res.json({ success: true, chatRoomId });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create chat room" });
  }
};

export const getUnreadMessageCounts = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [rows] = await pool.query(
      `SELECT 
          m.ChatRoomID,
          COUNT(m.MessageID) AS unreadCount
       FROM messages m
       LEFT JOIN messagereads mr 
         ON m.MessageID = mr.MessageID AND mr.UserID = ?
       WHERE (m.ChatRoomID IN (
                SELECT ChatRoomID FROM chatrooms WHERE UserID = ? OR InstructorID = ?
             ))
         AND m.SenderID != ?
         AND mr.ReadID IS NULL
       GROUP BY m.ChatRoomID`,
      [userId, userId, userId, userId]
    );

    const unreadCounts = {};
    rows.forEach((row) => {
      unreadCounts[row.ChatRoomID] = row.unreadCount;
    });

    res.json({ success: true, unreadCounts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch unread message counts",
      });
  }
};

export const markMessagesAsRead = async (req, res) => {
  const userId = req.user.userId;
  const { chatRoomId } = req.body;

  try {
    const [messages] = await pool.query(
      `SELECT m.MessageID
       FROM messages m
       LEFT JOIN messagereads mr ON m.MessageID = mr.MessageID AND mr.UserID = ?
       WHERE m.ChatRoomID = ? AND m.SenderID != ? AND mr.ReadID IS NULL`,
      [userId, chatRoomId, userId]
    );

    if (messages.length === 0) {
      return res.json({ success: true, message: "No unread messages" });
    }

    const values = messages.map((m) => [m.MessageID, userId, new Date()]);
    await pool.query(
      `INSERT INTO messagereads (MessageID, UserID, ReadAt) VALUES ?`,
      [values]
    );

    res.json({
      success: true,
      message: "Marked as read",
      count: messages.length,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to mark messages as read" });
  }
};

export const getTotalUnreadMessages = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [rows] = await pool.query(
      `SELECT 
          COUNT(m.MessageID) AS totalUnread
       FROM messages m
       LEFT JOIN messagereads mr 
         ON m.MessageID = mr.MessageID AND mr.UserID = ?
       WHERE (m.ChatRoomID IN (
                SELECT ChatRoomID FROM chatrooms WHERE UserID = ? OR InstructorID = ?
             ))
         AND m.SenderID != ?
         AND mr.ReadID IS NULL`,
      [userId, userId, userId, userId]
    );

    res.json({ success: true, totalUnread: rows[0]?.totalUnread || 0 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch total unread messages",
      });
  }
};
