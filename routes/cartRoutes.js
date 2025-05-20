import { Router } from "express";
import {
  addToCart,
  buyNow,
  getCart,
  getCheckoutDetails,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/add", authenticateToken, addToCart);
router.post("/buynow", authenticateToken, buyNow);
router.get("/view", authenticateToken, getCart);
router.get("/checkout", authenticateToken, getCheckoutDetails);

export default router;
