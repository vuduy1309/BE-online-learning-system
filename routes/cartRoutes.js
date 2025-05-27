import { Router } from "express";
import {
  addToCart,
  buyNow,
  getCart,
  getCheckoutDetails,
  removeFromCart,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/add", authenticateToken, addToCart);
router.post("/buynow", authenticateToken, buyNow);
router.get("/view", authenticateToken, getCart);
router.post("/remove/", authenticateToken, removeFromCart);
router.get("/checkout", authenticateToken, getCheckoutDetails);

export default router;
