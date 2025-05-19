import pool from "../config/db.js";

export const addToCart = async (req, res) => {
  const { userId } = req.user; // assuming JWT middleware extracts this
  const { courseId } = req.body;

  try {
    // 1. Kiểm tra cart đang hoạt động (Status = 'pending')
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

    // 2. Kiểm tra nếu course đã có trong giỏ
    const [[existingItem]] = await pool.query(
      `SELECT * FROM cartitems WHERE CartID = ? AND CourseID = ?`,
      [cartId, courseId]
    );
    if (existingItem) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    // 3. Lấy giá khóa học
    const [[course]] = await pool.query(
      `SELECT Price FROM courses WHERE CourseID = ?`,
      [courseId]
    );
    if (!course) return res.status(404).json({ message: "Course not found" });

    // 4. Thêm vào cartitem và cập nhật tổng tiền
    await pool.query(
      `INSERT INTO cartitems (CartID, CourseID, Price) VALUES (?, ?, ?)`,
      [cartId, courseId, course.Price]
    );

    await pool.query(
      `UPDATE carts SET TotalPrice = TotalPrice + ? WHERE CartID = ?`,
      [course.Price, cartId]
    );

    res.json({ message: "Course added to cart successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const buyNow = async (req, res) => {
  const { userId } = req.user;
  const { courseId } = req.body;

  try {
    // 1. Lấy thông tin khóa học
    const [[course]] = await pool.query(
      `SELECT * FROM courses WHERE CourseID = ?`,
      [courseId]
    );
    if (!course) return res.status(404).json({ message: "Course not found" });

    // 2. Tạo cart mới với status = 'buy_now' để phân biệt với cart thông thường
    const [cartResult] = await pool.query(
      `INSERT INTO carts (UserID, Status, TotalPrice, CreateAt) VALUES (?, 'buy_now', ?, NOW())`,
      [userId, course.Price]
    );

    const cartId = cartResult.insertId;

    // 3. Thêm course vào cartitem
    await pool.query(
      `INSERT INTO cartitems (CartID, CourseID, Price) VALUES (?, ?, ?)`,
      [cartId, courseId, course.Price]
    );

    // 4. Trả về cartId để redirect sang trang confirm
    res.json({ message: "Ready for checkout", cartId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process buy now request" });
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
    
    // Ensure ImageURL is properly formatted
    const formattedItems = items.map(item => ({
      ...item,
      // Make sure ImageURL starts with a slash if it's a relative path
      // This will ensure the Image component can properly format it
      ImageURL: item.ImageURL && !item.ImageURL.startsWith('/') && !item.ImageURL.startsWith('http') 
        ? `/${item.ImageURL}` 
        : item.ImageURL
    }));
    
    res.json({ items: formattedItems, totalPrice: cart.TotalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const getCheckoutDetails = async (req, res) => {
  const { userId } = req.user;
  const { cartId } = req.query; // Allow passing a specific cartId

  try {
    let query = `SELECT * FROM carts WHERE UserID = ? AND `;
    let params = [userId];

    if (cartId) {
      // If cartId provided, get that specific cart (buy now flow)
      query += `CartID = ? AND (Status = 'pending' OR Status = 'buy_now')`;
      params.push(cartId);
    } else {
      // Regular flow - just get the pending cart
      query += `Status = 'pending'`;
    }

    const [[cart]] = await pool.query(query, params);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Add Description to the SELECT statement
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
