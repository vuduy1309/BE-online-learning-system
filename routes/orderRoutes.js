import { Router } from "express";
import {
  confirmOrder,
  getAllOrders,
  updateOrderSatus,
  viewOrderDetails,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/confirm", authenticateToken, confirmOrder);
router.get("/viewOrderList", authenticateToken, authorizeRole(2), getAllOrders);
router.put(
  "/updateStatus/:orderId",
  authenticateToken,
  authorizeRole(2),
  updateOrderSatus
);
router.get(
  "/orderDetails/:orderId",
  authenticateToken,
  authorizeRole(2, 4),
  viewOrderDetails
);

export default router;
