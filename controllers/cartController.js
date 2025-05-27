import pool from "../config/db.js";

export const addToCart = async (req, res) => {
  const { userId } = req.user;
  const { courseId } = req.body;

  try {
    const [[enrollment]] = await pool.query(
      `SELECT EnrollmentID FROM enrollments WHERE UserID = ? AND CourseID = ?`,
      [userId, courseId]
    );

    if (enrollment) {
      return res
        .status(400)
        .json({ message: "You have already purchased this course." });
    }

    const [[cart]] = await pool.query(
      `SELECT * FROM carts WHERE UserID = ? AND Status = 'pending'`,
      [userId]
    );

    let cartId = cart?.CartID;
    if (!cartId) {
      const [result] = await pool.query(
        `INSERT INTO carts (UserID, Status, TotalPrice, CreateAt) VALUES (?, 'pending', 0, NOW())`,
        [userId]
      );
      cartId = result.insertId;
    }

    const [[existingItem]] = await pool.query(
      `SELECT * FROM cartitems WHERE CartID = ? AND CourseID = ?`,
      [cartId, courseId]
    );
    if (existingItem) {
      return res.status(400).json({ message: "Course is already in cart" });
    }

    const [[course]] = await pool.query(
      `SELECT Price FROM courses WHERE CourseID = ?`,
      [courseId]
    );
    if (!course) return res.status(404).json({ message: "Not found course" });

    await pool.query(
      `INSERT INTO cartitems (CartID, CourseID, Price) VALUES (?, ?, ?)`,
      [cartId, courseId, course.Price]
    );

    await pool.query(
      `UPDATE carts SET TotalPrice = TotalPrice + ? WHERE CartID = ?`,
      [course.Price, cartId]
    );

    res.json({ success: true, message: "Course added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Cannot add to cart" });
  }
};

export const buyNow = async (req, res) => {
  const { userId } = req.user;
  const { courseId } = req.body;

  try {
    const [[enrollment]] = await pool.query(
      `SELECT EnrollmentID FROM enrollments WHERE UserID = ? AND CourseID = ?`,
      [userId, courseId]
    );

    if (enrollment) {
      return res
        .status(400)
        .json({ message: "You have already purchased this course." });
    }

    const [[course]] = await pool.query(
      `SELECT * FROM courses WHERE CourseID = ?`,
      [courseId]
    );
    if (!course) return res.status(404).json({ message: "No course found" });

    const [cartResult] = await pool.query(
      `INSERT INTO carts (UserID, Status, TotalPrice, CreateAt) VALUES (?, 'buy_now', ?, NOW())`,
      [userId, course.Price]
    );

    const cartId = cartResult.insertId;

    await pool.query(
      `INSERT INTO cartitems (CartID, CourseID, Price) VALUES (?, ?, ?)`,
      [cartId, courseId, course.Price]
    );

    res.json({
      success: true,
      message: "Ready to pay",
      cartId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to process purchase request",
    });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.user;

  try {
    const [[cart]] = await pool.query(
      `SELECT * FROM carts WHERE UserID = ? AND Status = 'pending'`,
      [userId]
    );

    if (!cart) return res.json({ items: [], totalPrice: 0 });

    const [items] = await pool.query(
      `SELECT 
        ci.CartItemID, 
        ci.CourseID, 
        ci.Price, 
        c.Title, 
        c.ImageURL, 
        c.Description
      FROM cartitems ci
      JOIN courses c ON ci.CourseID = c.CourseID
      WHERE ci.CartID = ?`,
      [cart.CartID]
    );

    const formattedItems = items.map((item) => ({
      ...item,
      ImageURL:
        item.ImageURL &&
        !item.ImageURL.startsWith("/") &&
        !item.ImageURL.startsWith("http")
          ? `/${item.ImageURL}`
          : item.ImageURL,
    }));

    res.json({ items: formattedItems, totalPrice: cart.TotalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const getCheckoutDetails = async (req, res) => {
  const { userId } = req.user;
  const { cartId } = req.query;

  try {
    let query = `SELECT * FROM carts WHERE UserID = ? AND `;
    let params = [userId];

    if (cartId) {
      query += `CartID = ? AND (Status = 'pending' OR Status = 'buy_now')`;
      params.push(cartId);
    } else {
      query += `Status = 'pending'`;
    }

    const [[cart]] = await pool.query(query, params);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const [items] = await pool.query(
      `SELECT ci.CartItemID, ci.CourseID, ci.Price, 
              c.Title, c.ImageURL, c.Description 
       FROM cartitems ci 
       JOIN courses c ON ci.CourseID = c.CourseID 
       WHERE ci.CartID = ?`,
      [cart.CartID]
    );

    res.json({ cartId: cart.CartID, totalPrice: cart.TotalPrice, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch checkout data" });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId } = req.user;
  const { courseId } = req.body;

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const [[cart]] = await conn.query(
      `SELECT * FROM carts WHERE UserID = ? AND Status = 'pending'`,
      [userId]
    );

    if (!cart) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const [[cartItem]] = await conn.query(
      `SELECT * FROM cartitems WHERE CartID = ? AND CourseID = ?`,
      [cart.CartID, courseId]
    );

    if (!cartItem) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Course not found in cart",
      });
    }

    await conn.query(
      `DELETE FROM cartitems WHERE CartID = ? AND CourseID = ?`,
      [cart.CartID, courseId]
    );

    await conn.query(
      `UPDATE carts SET TotalPrice = TotalPrice - ? WHERE CartID = ?`,
      [cartItem.Price, cart.CartID]
    );

    await conn.commit();
    res.json({
      success: true,
      message: "Course removed from cart",
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to remove course from cart",
    });
  } finally {
    conn.release();
  }
};
