import pool from "../config/db.js";

export const confirmOrder = async (req, res) => {
  const { userId } = req.user;
  const { cartId, paymentMethod } = req.body;

  console.log("confirmOrder called with:", { userId, cartId, paymentMethod });

  try {
    const [[cart]] = await pool.query(
      `SELECT * FROM carts WHERE CartID = ? AND UserID = ? AND (Status = 'pending' OR Status = 'buy_now')`,
      [cartId, userId]
    );
    console.log("Cart found:", cart);

    if (!cart) return res.status(400).json({ message: "Cart not valid" });

    const totalAmount = Number(cart.TotalPrice);
    console.log("Total amount for order:", totalAmount);

    if (isNaN(totalAmount)) {
      return res.status(400).json({ message: "Cart total price is invalid" });
    }

    const [orderResult] = await pool.query(
      `INSERT INTO orders (UserID, CartID, OrderDate, TotalAmount, PaymentStatus, PaymentMethod) 
       VALUES (?, ?, NOW(), ?, 'pending', ?)`,
      [userId, cartId, totalAmount, paymentMethod]
    );
    console.log("Inserted order with ID:", orderResult.insertId);

    const orderId = orderResult.insertId;

    const [items] = await pool.query(
      `SELECT CourseID, Price FROM cartitems WHERE CartID = ?`,
      [cartId]
    );
    console.log("Cart items:", items);

    for (const item of items) {
      console.log("Inserting order detail for item:", item);
      await pool.query(
        `INSERT INTO orderdetails (OrderID, CourseID, Price) VALUES (?, ?, ?)`,
        [orderId, item.CourseID, item.Price]
      );
    }

    await pool.query(
      `UPDATE carts SET Status = 'checked_out' WHERE CartID = ?`,
      [cartId]
    );

    res.json({ message: "Order confirmed", orderId });
  } catch (err) {
    console.error("Error confirmOrder:", err);
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

export const getOrdersByUserID = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `
  SELECT 
    o.OrderID,
    o.OrderDate,
    o.TotalAmount,
    o.PaymentStatus,
    o.PaymentMethod
  FROM orders o
  WHERE o.UserID = ?
  ORDER BY o.OrderDate DESC
`,
      [req.params.userId]
    );

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
    await pool.query(`UPDATE orders SET PaymentStatus = ? WHERE OrderID = ?`, [
      status,
      orderId,
    ]);

    if (status === "paid") {
      const [[order]] = await pool.query(
        `SELECT UserID FROM orders WHERE OrderID = ?`,
        [orderId]
      );
      const userId = order.UserID;

      const [courseList] = await pool.query(
        `SELECT CourseID FROM orderdetails WHERE OrderID = ?`,
        [orderId]
      );

      for (const { CourseID } of courseList) {
        await pool.query(
          `INSERT IGNORE INTO enrollments (UserID, CourseID) VALUES (?, ?)`,
          [userId, CourseID]
        );
      }
    }

    res.json({ message: "Payment status updated successfully." });
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
