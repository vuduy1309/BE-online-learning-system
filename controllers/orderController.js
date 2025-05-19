import pool from "../config/db.js";

export const confirmOrder = async (req, res) => {
  const { userId } = req.user;
  const { cartId, paymentMethod } = req.body;

  try {
    // Lấy lại cart để đảm bảo đúng trạng thái (có thể là cart pending hoặc buy_now)
    const [[cart]] = await pool.query(
      `SELECT * FROM carts WHERE CartID = ? AND UserID = ? AND (Status = 'pending' OR Status = 'buy_now')`,
      [cartId, userId]
    );
    
    if (!cart) return res.status(400).json({ message: "Cart not valid" });

    // Tạo order
    const [orderResult] = await pool.query(
      `INSERT INTO orders (UserID, OrderDate, TotalAmount, PaymentStatus, PaymentMethod) 
       VALUES (?, NOW(), ?, 'pending', ?)`,
      [userId, cart.TotalPrice, paymentMethod]
    );

    const orderId = orderResult.insertId;

    // Copy cartitems vào orderdetails
    const [items] = await pool.query(
      `SELECT CourseID, Price FROM cartitems WHERE CartID = ?`,
      [cartId]
    );

    for (const item of items) {
      await pool.query(
        `INSERT INTO orderdetails (OrderID, CourseID, Price) VALUES (?, ?, ?)`,
        [orderId, item.CourseID, item.Price]
      );
    }

    // Cập nhật trạng thái cart
    await pool.query(
      `UPDATE carts SET Status = 'checked_out' WHERE CartID = ?`,
      [cartId]
    );

    res.json({ message: "Order confirmed", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to confirm order" });
  }
};