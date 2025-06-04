import { VNPay, ignoreLogger, ProductCode, VnpLocale } from "vnpay";
import dayjs from "dayjs";
import pool from "../config/db.js";

export const createVNPayQR = async (req, res) => {
  const { cartId } = req.body;
  try {
    const [[findCart]] = await pool.query(
      `SELECT * FROM carts WHERE CartID = ?`,
      [cartId]
    );
    if (!findCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const now = new Date();
    const expire = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const vnpay = new VNPay({
      tmnCode: "CHOECU21",
      secureSecret: "6KMM18JSCQI1BE63KD9TK0FOJGFRICS1",
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: "SHA512",
      logger: ignoreLogger,
    });

    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: Math.round(findCart.TotalPrice) * 100,
      vnp_IpAddr: "127.0.0.1",
      vnp_TxnRef: `${findCart.CartID}_${Date.now()}`,
      vnp_OrderInfo: `Thanh toan don hang ${findCart.CartID}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `http://localhost:8080/api/payment/vnpay/return`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dayjs(now).format("YYYYMMDDHHmmss"),
      vnp_ExpireDate: dayjs(expire).format("YYYYMMDDHHmmss"),
    });

    return res.status(201).json(vnpayResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const vnpayReturn = async (req, res) => {
  const { vnp_TxnRef, vnp_ResponseCode } = req.query;
  const cartId = vnp_TxnRef ? vnp_TxnRef.split('_')[0] : null;

  console.log("[VNPay Callback] Query:", req.query); 

  if (!cartId) {
    return res.status(400).json({ success: false, message: "Invalid transaction reference" });
  }

  try {
    const [[order]] = await pool.query(
      `SELECT OrderID FROM orders WHERE CartID = ? ORDER BY OrderID DESC LIMIT 1`,
      [cartId]
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (vnp_ResponseCode === '00') {
      await pool.query(
        `UPDATE orders SET PaymentStatus = 'paid' WHERE OrderID = ?`,
        [order.OrderID]
      );
      await pool.query(
        `UPDATE carts SET Status = 'checked_out' WHERE CartID = ?`,
        [cartId]
      );
      const [[orderInfo]] = await pool.query(
        `SELECT UserID FROM orders WHERE OrderID = ?`,
        [order.OrderID]
      );
      const userId = orderInfo.UserID;
      const [courseList] = await pool.query(
        `SELECT CourseID FROM orderdetails WHERE OrderID = ?`,
        [order.OrderID]
      );
      for (const { CourseID } of courseList) {
        await pool.query(
          `INSERT IGNORE INTO enrollments (UserID, CourseID) VALUES (?, ?)` ,
          [userId, CourseID]
        );
      }
      return res.redirect("http://localhost:3000/payment-success"); 
    } else {
      await pool.query(
        `UPDATE orders SET PaymentStatus = 'failed' WHERE OrderID = ?`,
        [order.OrderID]
      );
      await pool.query(
        `UPDATE carts SET Status = 'pending' WHERE CartID = ?`,
        [cartId]
      );
      return res.redirect("http://localhost:3000/payment-failed");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};
