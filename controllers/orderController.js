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

export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.OrderID,
        o.UserID,
        u.FullName,
        o.OrderDate,
        o.TotalAmount,
        o.PaymentStatus,
        o.PaymentMethod
      FROM orders o
      JOIN users u ON o.UserID = u.UserID
      ORDER BY o.OrderDate DESC
    `);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const updateOrderSatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    await pool.query(
      `
      UPDATE orders Set PaymentStatus = ? WHERE OrderID = ?
      `,
      [status, orderId]
    );
    res.json({ message: "Payment status update successfully." });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const viewOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const [details] = await pool.query(
      `
      SELECT 
        od.OrderDetailID,
        od.OrderID,
        od.CourseID,
        od.Price,
        c.Title,
        c.Description
      FROM orderdetails od
      JOIN courses c ON od.CourseID = c.CourseID
      WHERE od.OrderID = ?
      `,
      [orderId]
    );

    res.json(details);
  } catch (err) {
    console.error("Error fetch order details:", err);
    res.status(500).json({ message: "Failed to view order details" });
  }
};

